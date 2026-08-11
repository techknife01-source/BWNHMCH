const { google } = require('googleapis');
const { Readable } = require('stream');

async function testResumableAndDelegation() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Attempt 1: Create empty file metadata first, then upload media content via update
  console.log('--- Attempt 1: Create metadata then update media ---');
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });

    const createRes = await drive.files.create({
      requestBody: {
        name: 'test_meta_first.pdf',
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name',
    });

    console.log('Metadata created! ID:', createRes.data.id);

    const buf = Buffer.from('Test PDF content for BHMCH E-Library', 'utf-8');
    const stream = new Readable();
    stream.push(buf);
    stream.push(null);

    const updateRes = await drive.files.update({
      fileId: createRes.data.id,
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: 'id, name, size',
    });

    console.log('Attempt 1 SUCCESS! Updated file ID:', updateRes.data.id, 'Size:', updateRes.data.size);
  } catch (err) {
    console.error('Attempt 1 Error:', err.message);
  }

  // Attempt 2: Try JWT with subject 'bwnhmch@gmail.com'
  console.log('--- Attempt 2: JWT with subject bwnhmch@gmail.com ---');
  try {
    const auth2 = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'],
      subject: 'bwnhmch@gmail.com',
    });
    const drive2 = google.drive({ version: 'v3', auth: auth2 });

    const buf = Buffer.from('Test PDF content for BHMCH E-Library', 'utf-8');
    const stream = new Readable();
    stream.push(buf);
    stream.push(null);

    const res2 = await drive2.files.create({
      requestBody: {
        name: 'test_sub_bwn.pdf',
        mimeType: 'application/pdf',
        parents: [folderId],
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      supportsAllDrives: true,
      fields: 'id, name',
    });

    console.log('Attempt 2 SUCCESS! File ID:', res2.data.id);
  } catch (err) {
    console.error('Attempt 2 Error:', err.message);
  }
}

testResumableAndDelegation();
