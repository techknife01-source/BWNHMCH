const { google } = require('googleapis');

async function checkAllDriveFilesDetailed() {
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
      pageSize: 100,
      fields: 'files(id, name, mimeType, size, createdTime, trashed, webViewLink, webContentLink, parents)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    console.log(`Total files found in Google Drive: ${res.data.files.length}`);
    const nonZero = res.data.files.filter(f => parseInt(f.size || '0', 10) > 0);
    console.log(`Files with size > 0: ${nonZero.length}`);
    nonZero.forEach(f => {
      console.log(`ID: ${f.id} | Name: ${f.name} | Size: ${f.size} bytes (${(parseInt(f.size)/1024/1024).toFixed(2)} MB)`);
    });

    if (nonZero.length === 0) {
      console.log('\nAll files in list:');
      res.data.files.forEach(f => {
        console.log(`ID: ${f.id} | Name: ${f.name} | Size: ${f.size} | Created: ${f.createdTime}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkAllDriveFilesDetailed();
