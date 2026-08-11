const { google } = require('googleapis');

async function checkFolderPermissions() {
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
    const res = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id, type, role, emailAddress, displayName)',
      supportsAllDrives: true,
    });
    console.log('Folder permissions for ID', folderId, ':');
    console.log(JSON.stringify(res.data.permissions, null, 2));
  } catch (err) {
    console.error('Error getting permissions:', err.message);
  }
}

checkFolderPermissions();
