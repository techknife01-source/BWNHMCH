const { google } = require('googleapis');
const { Readable } = require('stream');

async function testDriveUploads() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  console.log('Testing Drive upload options...');

  // Test 1: Standard JWT
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const buf = Buffer.from('Test PDF content for BHMCH E-Library', 'utf-8');
    const stream = new Readable();
    stream.push(buf);
    stream.push(null);

    console.log('Attempting drive.files.create without parents...');
    const res1 = await drive.files.create({
      requestBody: {
        name: 'test_sample.pdf',
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
    console.log('Result 1 success! File ID:', res1.data.id);
  } catch (err) {
    console.error('Result 1 error:', err.message);
  }

  // Test 2: Try JWT with subject impersonation
  const testEmails = ['bwnhmch@gmail.com', 'algorithmpankajsir@gmail.com'];
  for (const email of testEmails) {
    try {
      console.log(`Attempting JWT with subject impersonation (${email})...`);
      const authSub = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive'],
        subject: email,
      });
      const driveSub = google.drive({ version: 'v3', auth: authSub });

      const buf = Buffer.from('Test PDF content for BHMCH E-Library', 'utf-8');
      const stream = new Readable();
      stream.push(buf);
      stream.push(null);

      const res2 = await driveSub.files.create({
        requestBody: {
          name: 'test_sample_sub.pdf',
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
      console.log(`Result 2 (${email}) success! File ID:`, res2.data.id);
    } catch (err) {
      console.error(`Result 2 (${email}) error:`, err.message);
    }
  }
}

testDriveUploads();
