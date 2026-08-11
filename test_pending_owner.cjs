const { google } = require('googleapis');
const { Readable } = require('stream');

async function testPendingOwner() {
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

  try {
    const createRes = await drive.files.create({
      requestBody: {
        name: 'test_pending.pdf',
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name',
    });

    const fileId = createRes.data.id;
    console.log('0-byte File created! ID:', fileId);

    // Try creating owner permission without transferOwnership flag or with moveToNewOwnersRoot
    const permRes = await drive.permissions.create({
      fileId,
      transferOwnership: true,
      moveToNewOwnersRoot: true,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        role: 'owner',
        type: 'user',
        emailAddress: 'bwnhmch@gmail.com',
      },
    });

    console.log('Permission res:', permRes.data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testPendingOwner();
