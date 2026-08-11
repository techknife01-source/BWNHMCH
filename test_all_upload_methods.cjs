const { google } = require('googleapis');
const { Readable } = require('stream');

async function testAllUploadMethods() {
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

  const testBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n', 'utf-8');

  console.log('--- Testing Method 1: drive.files.create with supportsAllDrives ---');
  try {
    const stream = new Readable();
    stream.push(testBuf);
    stream.push(null);

    const res = await drive.files.create({
      requestBody: {
        name: `test_m1_${Date.now()}.pdf`,
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
    console.log('Method 1 Result:', res.data);
  } catch (e) {
    console.error('Method 1 Error:', e.message);
  }

  console.log('\n--- Testing Method 2: Resumable Upload protocol ---');
  try {
    const tokenRes = await auth.getAccessToken();
    const token = tokenRes.token;

    const metadata = {
      name: `test_resumable_${Date.now()}.pdf`,
      mimeType: 'application/pdf',
      parents: [folderId],
    };

    const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'application/pdf',
        'X-Upload-Content-Length': testBuf.length.toString(),
      },
      body: JSON.stringify(metadata),
    });

    console.log('Resumable init status:', initRes.status);
    const location = initRes.headers.get('location');
    console.log('Resumable location header:', location ? 'RECEIVED' : 'NONE');

    if (location) {
      const uploadRes = await fetch(location, {
        method: 'PUT',
        headers: {
          'Content-Length': testBuf.length.toString(),
          'Content-Type': 'application/pdf',
        },
        body: testBuf,
      });
      const uploadData = await uploadRes.json();
      console.log('Resumable upload result status:', uploadRes.status, uploadData);
    }
  } catch (e) {
    console.error('Method 2 Error:', e.message);
  }

  console.log('\n--- Testing Method 3: Upload to root (no parents) ---');
  try {
    const stream = new Readable();
    stream.push(testBuf);
    stream.push(null);

    const res = await drive.files.create({
      requestBody: {
        name: `test_root_${Date.now()}.pdf`,
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      supportsAllDrives: true,
      fields: 'id, name, size',
    });
    console.log('Method 3 Result:', res.data);
  } catch (e) {
    console.error('Method 3 Error:', e.message);
  }
}

testAllUploadMethods();
