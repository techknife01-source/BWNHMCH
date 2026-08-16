import { spawn, execSync } from 'child_process';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 10000;
const BASE_URL = `http://localhost:${PORT}`;

async function verifyExplicitSeedCommand() {
  console.log('=== TESTING EXPLICIT SEED COMMAND & NO-AUTOSEED PERSISTENCE ===');

  try {
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 10000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"');
  } catch {}

  await new Promise((r) => setTimeout(r, 2000));

  console.log('Launching Express server on port ' + PORT + '...');
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
        console.log(`Server booted and ready at ${BASE_URL}`);
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

  // STEP 1: RUN EXPLICIT SEED COMMAND
  console.log('\nExecuting POST /api/v1/admin/seed (EXPLICIT MANUAL SEED) ...');
  const seedRes = await fetch(`${BASE_URL}/api/v1/admin/seed`, { method: 'POST' });
  const seedJson: any = await seedRes.json();
  console.log('SEED API RESPONSE:', seedJson.message);

  const facCountAfterSeed = ((await (await fetch(`${BASE_URL}/api/v1/faculty`)).json()) as any).total;
  const docCountAfterSeed = ((await (await fetch(`${BASE_URL}/api/v1/doctors`)).json()) as any).total;
  const stfCountAfterSeed = ((await (await fetch(`${BASE_URL}/api/v1/staff`)).json()) as any).total;

  console.log(`\nAFTER EXPLICIT SEED:`);
  console.log(`Faculty Count: ${facCountAfterSeed}`);
  console.log(`Doctors Count: ${docCountAfterSeed}`);
  console.log(`Staff Count: ${stfCountAfterSeed}`);

  const seedWorked = facCountAfterSeed > 0 && docCountAfterSeed > 0 && stfCountAfterSeed > 0;
  console.log(`EXPLICIT SEED CREATED RECORDS: ${seedWorked ? 'YES' : 'NO'}`);

  // STEP 2: DELETE ALL RECORDS AGAIN
  console.log('\nDeleting all records to test persistence...');
  const facList: any = await (await fetch(`${BASE_URL}/api/v1/faculty`)).json();
  for (const f of (facList.data || [])) {
    await fetch(`${BASE_URL}/api/v1/faculty/${f.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  const docList: any = await (await fetch(`${BASE_URL}/api/v1/doctors`)).json();
  for (const d of (docList.data || [])) {
    await fetch(`${BASE_URL}/api/v1/doctors/${d.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  const stfList: any = await (await fetch(`${BASE_URL}/api/v1/staff`)).json();
  for (const s of (stfList.data || [])) {
    await fetch(`${BASE_URL}/api/v1/staff/${s.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  // STEP 3: RESTART SERVER & CONFIRM RECORDS ARE STILL DELETED
  console.log('\n--- RESTARTING EXPRESS SERVER ---');
  if (serverProcess) serverProcess.kill();
  try {
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 10000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"');
  } catch {}
  await new Promise((r) => setTimeout(r, 2000));

  serverProcess = spawn('npx', ['tsx', 'server.ts'], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'pipe',
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const check = await fetch(`${BASE_URL}/api/v1/actuator/health`);
      if (check.status === 200) break;
    } catch {}
  }

  const facCountAfterRestart = ((await (await fetch(`${BASE_URL}/api/v1/faculty`)).json()) as any).total;
  const docCountAfterRestart = ((await (await fetch(`${BASE_URL}/api/v1/doctors`)).json()) as any).total;
  const stfCountAfterRestart = ((await (await fetch(`${BASE_URL}/api/v1/staff`)).json()) as any).total;

  console.log(`\nAFTER SERVER RESTART:`);
  console.log(`Faculty Count: ${facCountAfterRestart}`);
  console.log(`Doctors Count: ${docCountAfterRestart}`);
  console.log(`Staff Count: ${stfCountAfterRestart}`);

  const noAutoseedOnRestart = facCountAfterRestart === 0 && docCountAfterRestart === 0 && stfCountAfterRestart === 0;
  console.log(`RECORDS REMAIN DELETED ON RESTART (NO AUTOSEED): ${noAutoseedOnRestart ? 'YES' : 'NO'}`);

  if (serverProcess) serverProcess.kill();

  const passed = seedWorked && noAutoseedOnRestart;
  console.log(`\n==================================================`);
  console.log(`EXPLICIT SEED & PERSISTENCE VERIFICATION: ${passed ? 'PASSED' : 'FAILED'}`);
  console.log(`==================================================`);

  process.exit(passed ? 0 : 1);
}

verifyExplicitSeedCommand().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
