const { google } = require('googleapis');

async function listDriveFiles() {
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
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size, createdTime)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    console.log('Files in Google Drive folder:');
    console.log(JSON.stringify(res.data.files, null, 2));

    // Also list all files owned by or accessible to service account
    const allRes = await drive.files.list({
      pageSize: 30,
      fields: 'files(id, name, mimeType, size, createdTime)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    console.log('\nAll accessible files in Google Drive:');
    console.log(JSON.stringify(allRes.data.files, null, 2));
  } catch (err) {
    console.error('Error listing files:', err.message);
  }
}

listDriveFiles();
