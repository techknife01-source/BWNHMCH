import { spawn, execSync } from 'child_process';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 10000;
const BASE_URL = `http://localhost:${PORT}`;

async function verifyNoAutoseedPersistence() {
  console.log('=== STARTING COMPLETE NO-AUTOSEED PERSISTENCE TEST ===');

  try {
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 10000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"');
  } catch {}

  await new Promise((r) => setTimeout(r, 2000));

  console.log('Launching FRESH Express server on port ' + PORT + '...');
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

  // Helper to reboot server
  const rebootServer = async () => {
    console.log('\n--- REBOOTING EXPRESS SERVER ---');
    if (serverProcess) {
      serverProcess.kill();
    }
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
        if (check.status === 200) {
          console.log(`Server rebooted successfully on ${BASE_URL}`);
          break;
        }
      } catch {}
    }
  };

  // STEP 1: DELETE ALL RECORDS IN STAFF, DOCTORS, FACULTY
  console.log('\n--- DELETING ALL STAFF RECORDS ---');
  const staffRes = await fetch(`${BASE_URL}/api/v1/staff`);
  const staffJson: any = await staffRes.json();
  for (const s of (staffJson.data || [])) {
    await fetch(`${BASE_URL}/api/v1/staff/${s.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  console.log('--- DELETING ALL DOCTOR RECORDS ---');
  const docRes = await fetch(`${BASE_URL}/api/v1/doctors`);
  const docJson: any = await docRes.json();
  for (const d of (docJson.data || [])) {
    await fetch(`${BASE_URL}/api/v1/doctors/${d.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  console.log('--- DELETING ALL FACULTY RECORDS ---');
  const facRes = await fetch(`${BASE_URL}/api/v1/faculty`);
  const facJson: any = await facRes.json();
  for (const f of (facJson.data || [])) {
    await fetch(`${BASE_URL}/api/v1/faculty/${f.id}`, { method: 'DELETE', headers: { Authorization: 'Bearer test-admin-token' } });
  }

  // STEP 2: VERIFY ALL THREE ARE AUTHORITATIVELY EMPTY BEFORE RESTART
  const staffEmptyBefore = ((await (await fetch(`${BASE_URL}/api/v1/staff`)).json()) as any).total === 0;
  const docEmptyBefore = ((await (await fetch(`${BASE_URL}/api/v1/doctors`)).json()) as any).total === 0;
  const facEmptyBefore = ((await (await fetch(`${BASE_URL}/api/v1/faculty`)).json()) as any).total === 0;

  console.log(`\nBEFORE RESTART:`);
  console.log(`Staff Empty: ${staffEmptyBefore ? 'YES' : 'NO'}`);
  console.log(`Doctors Empty: ${docEmptyBefore ? 'YES' : 'NO'}`);
  console.log(`Faculty Empty: ${facEmptyBefore ? 'YES' : 'NO'}`);

  // STEP 3: REBOOT SERVER PROCESS
  await rebootServer();

  // STEP 4: VERIFY ALL THREE ARE STILL AUTHORITATIVELY EMPTY AFTER RESTART
  const staffEmptyAfter = ((await (await fetch(`${BASE_URL}/api/v1/staff`)).json()) as any).total === 0;
  const docEmptyAfter = ((await (await fetch(`${BASE_URL}/api/v1/doctors`)).json()) as any).total === 0;
  const facEmptyAfter = ((await (await fetch(`${BASE_URL}/api/v1/faculty`)).json()) as any).total === 0;

  console.log(`\nAFTER SERVER RESTART:`);
  console.log(`Staff Empty: ${staffEmptyAfter ? 'YES' : 'NO'}`);
  console.log(`Doctors Empty: ${docEmptyAfter ? 'YES' : 'NO'}`);
  console.log(`Faculty Empty: ${facEmptyAfter ? 'YES' : 'NO'}`);

  // STEP 5: HEADLESS CHROME BROWSER REFRESH CHECK
  console.log('\nLaunching Headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  console.log(`Navigating to ${BASE_URL}/staff ...`);
  await page.goto(`${BASE_URL}/staff`, { waitUntil: 'networkidle0' });
  const staffText = await page.evaluate(() => document.body.innerText);
  console.log('STAFF PAGE TEXT SNIPPET:\n', staffText.substring(0, 500));
  const staffDomEmpty = !staffText.includes('Dourav Roy') && !staffText.includes('AMIT DHANK');

  console.log(`Navigating to ${BASE_URL}/doctors ...`);
  await page.goto(`${BASE_URL}/doctors`, { waitUntil: 'networkidle0' });
  const docText = await page.evaluate(() => document.body.innerText);
  console.log('DOCTORS PAGE TEXT SNIPPET:\n', docText.substring(0, 500));
  const doctorsDomEmpty = !docText.includes('Rajesh Pal') && !docText.includes('Sbrata Pal') && !docText.includes('Subhash');

  console.log(`Navigating to ${BASE_URL}/faculty-directory ...`);
  await page.goto(`${BASE_URL}/faculty-directory`, { waitUntil: 'networkidle0' });
  const facText = await page.evaluate(() => document.body.innerText);
  console.log('FACULTY PAGE TEXT SNIPPET:\n', facText.substring(0, 500));
  const facultyDomEmpty = !facText.includes('Rajesh Pal');

  console.log(`\nHEADLESS CHROME DOM RESULTS:`);
  console.log(`Staff DOM Empty (No Staff names present): ${staffDomEmpty ? 'YES' : 'NO'}`);
  console.log(`Doctors DOM Empty (No Doctor names present): ${doctorsDomEmpty ? 'YES' : 'NO'}`);
  console.log(`Faculty DOM Empty (No Faculty names present): ${facultyDomEmpty ? 'YES' : 'NO'}`);

  await browser.close();
  if (serverProcess) serverProcess.kill();

  const allPassed =
    staffEmptyBefore &&
    docEmptyBefore &&
    facEmptyBefore &&
    staffEmptyAfter &&
    docEmptyAfter &&
    facEmptyAfter &&
    staffDomEmpty &&
    doctorsDomEmpty &&
    facultyDomEmpty;

  console.log(`\n==================================================`);
  console.log(`NO-AUTOSEED PERSISTENCE TEST: ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`==================================================`);

  process.exit(allPassed ? 0 : 1);
}

verifyNoAutoseedPersistence().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
