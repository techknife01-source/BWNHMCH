const { google } = require('googleapis');
const { Readable } = require('stream');

async function testUpdatePending() {
  const fileId = '1P3igF4uB7vBQfxiiH5Wk0jmkgj6JPZYW';
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
    console.log('Updating file media content on pendingOwner file...');
    const buf = Buffer.from('Test PDF content for BHMCH E-Library - Organon 6th Edition', 'utf-8');
    const stream = new Readable();
    stream.push(buf);
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

    console.log('SUCCESS! Updated file ID:', updateRes.data.id, 'Size:', updateRes.data.size);
  } catch (err) {
    console.error('Error in update:', err.message);
  }
}

testUpdatePending();
