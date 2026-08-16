import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { DoctorModel, SEED_DOCTORS } from '../src/server/doctorModel';
import { StaffModel, SEED_STAFF } from '../src/server/staffModel';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const sanitizeMongoUri = (rawUri: string): string => {
  if (!rawUri) return '';
  let uri = rawUri.trim();
  while ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.substring(1, uri.length - 1).trim();
  }
  uri = uri.replace(/[\r\n]/g, '').trim();
  if (uri.startsWith('mongodb+srv://') && !uri.toLowerCase().includes('authsource=')) {
    uri = uri.includes('?') ? `${uri}&authSource=admin` : `${uri}?authSource=admin`;
  }
  return uri;
};

async function seedDatabase() {
  const uri = sanitizeMongoUri(process.env.MONGODB_URI || '');
  if (!uri) {
    console.error('[Manual Seed Error] MONGODB_URI is required to run database seeding.');
    process.exit(1);
  }

  console.log('[Manual Seed] Connecting to MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  console.log(`[Manual Seed] Processing ${SEED_DOCTORS.length} Doctor seed records...`);
  let docInserted = 0;
  let docPreserved = 0;
  for (const doc of SEED_DOCTORS) {
    const exists = await (DoctorModel as any).findOne({
      $or: [
        { id: doc.id },
        { empId: doc.empId },
        { name: doc.name },
      ],
    });
    if (!exists) {
      await (DoctorModel as any).create(doc);
      docInserted++;
    } else {
      docPreserved++;
    }
  }
  const totalDoctors = await (DoctorModel as any).countDocuments();
  console.log(`[Manual Seed] Doctors: ${docInserted} inserted, ${docPreserved} preserved. Total in DB: ${totalDoctors}`);

  console.log(`[Manual Seed] Processing ${SEED_STAFF.length} Staff seed records...`);
  let staffInserted = 0;
  let staffPreserved = 0;
  for (const stf of SEED_STAFF) {
    const exists = await (StaffModel as any).findOne({
      $or: [
        { id: stf.id },
        { empId: stf.empId },
        { name: stf.name },
      ],
    });
    if (!exists) {
      await (StaffModel as any).create(stf);
      staffInserted++;
    } else {
      staffPreserved++;
    }
  }
  const totalStaff = await (StaffModel as any).countDocuments();
  console.log(`[Manual Seed] Staff: ${staffInserted} inserted, ${staffPreserved} preserved. Total in DB: ${totalStaff}`);

  await mongoose.disconnect();
  console.log('[Manual Seed] Database seeding completed successfully.');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('[Manual Seed Error]:', err?.message || err);
  process.exit(1);
});
