const { google } = require('googleapis');
const { Readable } = require('stream');

async function testUpdateExistingMedia() {
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

  const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n', 'utf-8');

  try {
    console.log('1. Creating metadata file...');
    const createRes = await drive.files.create({
      requestBody: {
        name: `test_update_media_${Date.now()}.pdf`,
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name',
    });

    const fileId = createRes.data.id;
    console.log('Metadata file created with ID:', fileId);

    console.log('2. Attempting drive.files.update with media on fileId:', fileId);
    const stream = new Readable();
    stream.push(testBuf);
    stream.push(null);

    const updateRes = await drive.files.update({
      fileId,
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name, size',
    });

    console.log('Update result:', updateRes.data);

    // Clean up test file
    await drive.files.delete({ fileId, supportsAllDrives: true });
  } catch (err) {
    console.error('Update Error:', err.message);
  }
}

testUpdateExistingMedia();
