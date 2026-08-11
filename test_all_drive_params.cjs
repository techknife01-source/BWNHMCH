const { google } = require('googleapis');
const { Readable } = require('stream');

async function testAllParams() {
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

  const buf = Buffer.from('Test PDF content for BHMCH E-Library - Organon 6th Edition', 'utf-8');

  // Variant A: create with keepRevisionForever, supportsAllDrives, enforceSingleParent
  const variants = [
    { name: 'v1: supportsAllDrives=true', params: { supportsAllDrives: true } },
    { name: 'v2: supportsAllDrives=true + supportsTeamDrives=true', params: { supportsAllDrives: true, supportsTeamDrives: true } },
    { name: 'v3: enforceSingleParent=true', params: { supportsAllDrives: true, enforceSingleParent: true } },
    { name: 'v4: ignoreDefaultVisibility=true', params: { supportsAllDrives: true, ignoreDefaultVisibility: true } },
    { name: 'v5: keepRevisionForever=true', params: { supportsAllDrives: true, keepRevisionForever: true } },
    { name: 'v6: useDomainAdminAccess=true', params: { supportsAllDrives: true, useDomainAdminAccess: true } },
  ];

  for (const v of variants) {
    try {
      console.log(`Testing ${v.name}...`);
      const stream = new Readable();
      stream.push(buf);
      stream.push(null);

      const res = await drive.files.create({
        requestBody: {
          name: `test_${Date.now()}.pdf`,
          mimeType: 'application/pdf',
          parents: [folderId],
        },
        media: {
          mimeType: 'application/pdf',
          body: stream,
        },
        fields: 'id, name, size',
        ...v.params,
      });

      console.log(`SUCCESS ${v.name}: File ID =`, res.data.id);
      return;
    } catch (err) {
      console.error(`FAILED ${v.name}:`, err.message);
    }
  }
}

testAllParams();
