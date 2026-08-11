const { google } = require('googleapis');
const { Readable } = require('stream');

async function testUploadFixes() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  const drive = google.drive({ version: 'v3', auth });

  console.log('Testing upload to folder:', folderId);

  // Check folder details first
  try {
    const folderRes = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, driveId, sharedWithMe, capabilities',
      supportsAllDrives: true,
      supportsTeamDrives: true,
    });
    console.log('Folder details:', folderRes.data);
  } catch (e) {
    console.error('Error fetching folder:', e.message);
  }

  const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF', 'utf-8');

  // Attempt 1: Standard files.create with supportsAllDrives
  try {
    const stream = new Readable();
    stream.push(testBuf);
    stream.push(null);

    const res = await drive.files.create({
      requestBody: {
        name: `test_direct_${Date.now()}.pdf`,
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name, size',
    });
    console.log('SUCCESS Attempt 1:', res.data);
  } catch (e) {
    console.error('FAILED Attempt 1:', e.message);
  }

  // Attempt 2: files.create with driveId if folder is in a Shared Drive
  try {
    const folderInfo = await drive.files.get({
      fileId: folderId,
      fields: 'driveId',
      supportsAllDrives: true,
    });
    if (folderInfo.data.driveId) {
      const stream = new Readable();
      stream.push(testBuf);
      stream.push(null);

      const res = await drive.files.create({
        requestBody: {
          name: `test_shared_${Date.now()}.pdf`,
          mimeType: 'application/pdf',
          parents: [folderId],
        },
        media: {
          mimeType: 'application/pdf',
          body: stream,
        },
        supportsAllDrives: true,
        supportsTeamDrives: true,
        driveId: folderInfo.data.driveId,
        fields: 'id, name, size',
      });
      console.log('SUCCESS Attempt 2:', res.data);
    } else {
      console.log('Folder is not in a Shared Drive (driveId is empty)');
    }
  } catch (e) {
    console.error('FAILED Attempt 2:', e.message);
  }
}

testUploadFixes();
