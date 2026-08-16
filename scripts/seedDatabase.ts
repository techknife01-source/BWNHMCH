import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { FacultyModel } from '../src/server/facultyModel';
import { DoctorModel } from '../src/server/doctorModel';
import { StaffModel } from '../src/server/staffModel';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DEMO_FACULTY = [
  {
    id: 'fac-test-001',
    slNo: 1,
    empId: 'TEST-FAC-001',
    name: 'Rajesh Pal',
    department: 'Homoeopathic Medicine',
    departmentId: 'med',
    designation: 'Assistant Professor',
    category: 'ACADEMIC FACULTY',
    displayOrder: 1,
    qualification: 'BHMS, MD (Hom)',
    specialization: 'Homoeopathic Medicine',
    email: 'rajesh.pal@bhmc.edu.in',
    phone: '+91 98000 00001',
    status: 'ACTIVE',
  },
];

const DEMO_DOCTORS = [
  {
    id: 'doc-test-001',
    slNo: 1,
    empId: 'TEST-FAC-001',
    name: 'Rajesh Pal',
    roleCategory: 'MEDICAL_DOCTOR',
    department: 'Homoeopathic Medicine',
    departmentId: 'med',
    designation: 'Medical Officer',
    category: 'CLINICAL_DOCTOR',
    displayOrder: 1,
    qualification: 'BHMS, MD (Hom)',
    specialization: 'Homoeopathic Medicine',
    email: 'rajesh.pal@bhmc.edu.in',
    phone: '+91 98000 00001',
    status: 'ACTIVE',
  },
  {
    id: 'doc-test-002',
    slNo: 2,
    empId: 'TEST-DOC-001',
    name: 'Sbrata Pal',
    roleCategory: 'MEDICAL_DOCTOR',
    department: 'Hospital',
    departmentId: 'hosp',
    designation: 'Medical Officer',
    category: 'CLINICAL_DOCTOR',
    displayOrder: 2,
    qualification: 'BHMS',
    specialization: 'General Medicine',
    email: 'sbrata.pal@bhmc.edu.in',
    phone: '+91 98000 00002',
    status: 'ACTIVE',
  },
];

const DEMO_STAFF = [
  {
    id: 'staff-test-001',
    slNo: 1,
    empId: 'TEST-STF-001',
    name: 'Dourav Roy',
    roleCategory: 'OFFICE_STAFF',
    staffCategory: 'NON_MEDICAL',
    department: 'Hospital Administration',
    designation: 'Senior Executive Officer',
    category: 'STAFF',
    displayOrder: 1,
    qualification: 'B.Com, MHA',
    email: 'dourav.roy@bhmc.edu.in',
    phone: '+91 98000 00003',
    status: 'ACTIVE',
  },
];

const sanitizeMongoUri = (rawUri: string): string => {
  if (!rawUri) return '';
  let uri = rawUri.trim();
  while ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.substring(1, uri.length - 1).trim();
  }
  return uri.replace(/[\r\n]/g, '').trim();
};

async function seedDatabase() {
  // First check if local Express server is running and trigger API seed
  try {
    const apiRes = await fetch('http://localhost:10000/api/v1/admin/seed', { method: 'POST' });
    if (apiRes.status === 200) {
      const apiJson = await apiRes.json();
      console.log('[Explicit Manual Seed] Server API response:', apiJson.message);
      console.log('[Explicit Manual Seed] Database seeding completed successfully via Server API.');
      process.exit(0);
    }
  } catch {}

  const uri = sanitizeMongoUri(process.env.MONGODB_URI || '');
  if (!uri) {
    console.error('[Explicit Manual Seed Error] MONGODB_URI is required to run database seeding.');
    process.exit(1);
  }

  console.log('[Explicit Manual Seed] Connecting directly to MongoDB Atlas...');
  let connected = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      connected = true;
      break;
    } catch (err: any) {
      console.warn(`[Explicit Manual Seed] Connect attempt ${attempt}/3 failed (${err?.message}).`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!connected) {
    console.error('[Explicit Manual Seed Error] Could not connect directly to MongoDB Atlas. Ensure server is running or check internet connection.');
    process.exit(1);
  }

  console.log(`[Explicit Manual Seed] Processing Faculty demo seed records...`);
  for (const f of DEMO_FACULTY) {
    const exists = await (FacultyModel as any).findOne({ id: f.id });
    if (!exists) await (FacultyModel as any).create(f);
  }
  const totalFaculty = await (FacultyModel as any).countDocuments();
  console.log(`[Explicit Manual Seed] Faculty total in DB: ${totalFaculty}`);

  console.log(`[Explicit Manual Seed] Processing Doctor demo seed records...`);
  for (const doc of DEMO_DOCTORS) {
    const exists = await (DoctorModel as any).findOne({ id: doc.id });
    if (!exists) await (DoctorModel as any).create(doc);
  }
  const totalDoctors = await (DoctorModel as any).countDocuments();
  console.log(`[Explicit Manual Seed] Doctors total in DB: ${totalDoctors}`);

  console.log(`[Explicit Manual Seed] Processing Staff demo seed records...`);
  for (const stf of DEMO_STAFF) {
    const exists = await (StaffModel as any).findOne({ id: stf.id });
    if (!exists) await (StaffModel as any).create(stf);
  }
  const totalStaff = await (StaffModel as any).countDocuments();
  console.log(`[Explicit Manual Seed] Staff total in DB: ${totalStaff}`);

  await mongoose.disconnect();
  console.log('[Explicit Manual Seed] Database seeding completed successfully.');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('[Explicit Manual Seed Error]:', err?.message || err);
  process.exit(1);
});
