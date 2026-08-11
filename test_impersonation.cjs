const { google } = require('googleapis');
const { Readable } = require('stream');

async function testImpersonation() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const emailsToTry = [
    'bwnhmch@gmail.com',
    'algorithmpankajsir@gmail.com',
    'bwnhmch-elibrary@bwnhmch.iam.gserviceaccount.com'
  ];

  const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF', 'utf-8');

  for (const email of emailsToTry) {
    try {
      console.log('Testing subject:', email);
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive'],
        subject: email,
      });
      const drive = google.drive({ version: 'v3', auth });

      const stream = new Readable();
      stream.push(testBuf);
      stream.push(null);

      const res = await drive.files.create({
        requestBody: {
          name: `test_impersonate_${Date.now()}.pdf`,
          mimeType: 'application/pdf',
          parents: [folderId],
        },
        media: {
          mimeType: 'application/pdf',
          body: stream,
        },
        supportsAllDrives: true,
        fields: 'id, name, size',
      });
      console.log('SUCCESS for subject:', email, 'File ID:', res.data.id);
      return;
    } catch (err) {
      console.error('FAILED for subject:', email, 'Error:', err.message);
    }
  }
}

testImpersonation();
