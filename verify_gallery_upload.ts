import { spawn, execSync } from 'child_process';
import path from 'path';

const PORT = 10000;
const BASE_URL = `http://localhost:${PORT}`;

async function verifyGalleryUpload() {
  console.log('=== STARTING GALLERY UPLOAD VERIFICATION TEST ===');

  try {
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 10000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"');
  } catch {}

  await new Promise((r) => setTimeout(r, 2000));

  console.log('Booting Express server on port ' + PORT + '...');
  let serverProcess = spawn('npx', ['tsx', 'server.ts'], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'pipe',
  });

  let isReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const check = await fetch(`${BASE_URL}/api/v1/actuator/health`);
      if (check.status === 200) {
        console.log(`Server ready at ${BASE_URL}`);
        isReady = true;
        break;
      }
    } catch {}
  }

  if (!isReady) {
    console.error('Server failed to start');
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  // Create dummy image buffer (1x1 transparent PNG)
  const dummyPngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  console.log('\nTesting POST /api/v1/gallery/upload ...');
  const formData = new FormData();
  const blob = new Blob([dummyPngBuffer], { type: 'image/png' });
  formData.append('file', blob, 'test-campus-photo.png');
  formData.append('title', 'Test Campus Front Gate');
  formData.append('description', 'Official front gate view');
  formData.append('category', 'Hospital & OPD');

  const uploadRes = await fetch(`${BASE_URL}/api/v1/gallery/upload`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-admin-token-12345',
    },
    body: formData,
  });

  console.log(`Upload HTTP Status: ${uploadRes.status}`);
  const uploadJson: any = await uploadRes.json();
  console.log('Upload Response Payload:\n', JSON.stringify(uploadJson, null, 2));

  const uploadPassed = uploadRes.status === 200 && uploadJson.success === true && !!uploadJson.data?.id;

  // Query GET /api/v1/gallery
  console.log('\nTesting GET /api/v1/gallery ...');
  const getRes = await fetch(`${BASE_URL}/api/v1/gallery`);
  const getJson: any = await getRes.json();
  const galleryItems = getJson.data || getJson || [];
  console.log(`Gallery items count: ${Array.isArray(galleryItems) ? galleryItems.length : 0}`);

  const itemFound = Array.isArray(galleryItems) && galleryItems.some((i: any) => i.title === 'Test Campus Front Gate' || i.id === uploadJson.data?.id);
  console.log(`Uploaded item present in GET /gallery: ${itemFound ? 'YES' : 'NO'}`);

  // Test Image Stream route
  let streamPassed = false;
  if (uploadJson.data?.id) {
    const streamUrl = `${BASE_URL}/api/v1/gallery/${uploadJson.data.id}/image`;
    console.log(`\nTesting GET ${streamUrl} ...`);
    const streamRes = await fetch(streamUrl);
    console.log(`Stream HTTP Status: ${streamRes.status}`);
    streamPassed = streamRes.status === 200 || streamRes.status === 302;
  }

  if (serverProcess) serverProcess.kill();

  const allPassed = uploadPassed && itemFound && streamPassed;
  console.log(`\n==================================================`);
  console.log(`GALLERY UPLOAD TEST RESULT: ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`==================================================`);

  process.exit(allPassed ? 0 : 1);
}

verifyGalleryUpload().catch((err) => {
  console.error('Gallery verification error:', err);
  process.exit(1);
});
