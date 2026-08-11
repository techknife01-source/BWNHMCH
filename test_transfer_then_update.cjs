const { google } = require('googleapis');
const { Readable } = require('stream');

async function testTransferThenUpdate() {
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
    console.log('1. Creating 0-byte metadata file in Google Drive folder...');
    const createRes = await drive.files.create({
      requestBody: {
        name: 'test_transfer_first.pdf',
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name, owners',
    });

    const fileId = createRes.data.id;
    console.log('0-byte File created! ID:', fileId);

    // 2. Transfer ownership or share with bwnhmch@gmail.com
    console.log('2. Creating writer permission for bwnhmch@gmail.com...');
    await drive.permissions.create({
      fileId,
      transferOwnership: true,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        role: 'owner',
        type: 'user',
        emailAddress: 'bwnhmch@gmail.com',
      },
    });
    console.log('Ownership transferred to bwnhmch@gmail.com!');

    // 3. Update file media content
    console.log('3. Updating media content...');
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
    console.error('Error in transfer then update flow:', err.message);
  }
}

testTransferThenUpdate();
