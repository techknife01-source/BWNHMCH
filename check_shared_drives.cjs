const { google } = require('googleapis');

async function checkSharedDrives() {
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
    const res = await drive.drives.list({
      pageSize: 50,
      fields: 'drives(id, name, createdTime)',
    });
    console.log('Shared Drives found:', res.data.drives);
  } catch (err) {
    console.error('Error listing shared drives:', err.message);
  }
}

checkSharedDrives();
