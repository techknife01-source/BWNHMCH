const { google } = require('googleapis');
const { Readable } = require('stream');

async function testDriveVariants() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
  ];

  for (const scope of scopes) {
    try {
      console.log(`Testing scope: ${scope}`);
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: [scope],
      });
      const drive = google.drive({ version: 'v3', auth });

      const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n', 'utf-8');
      const stream = new Readable();
      stream.push(testBuf);
      stream.push(null);

      const res = await drive.files.create({
        requestBody: {
          name: `test_scope_${Date.now()}.pdf`,
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
      console.log(`SUCCESS scope ${scope}:`, res.data);
      return;
    } catch (err) {
      console.error(`FAILED scope ${scope}:`, err.message);
    }
  }
}

testDriveVariants();
