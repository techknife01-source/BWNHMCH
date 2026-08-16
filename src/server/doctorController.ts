import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DoctorModel, SEED_DOCTORS, IDoctor } from './doctorModel';
import { googleDriveService } from './googleDriveService';

// In-memory store for fallback and rapid sync
let memoryDoctorStore: any[] = [];

// Helper: Ensure authentication header is present for Admin write ops
export function checkAdminAuthHeader(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7).trim();
  if (!token || token === 'undefined' || token === 'null') {
    return false;
  }
  return true;
}

// Helper: Re-index display orders so they are strictly sequential 1, 2, 3...
async function reindexDisplayOrders() {
  memoryDoctorStore.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  memoryDoctorStore.forEach((item, idx) => {
    item.displayOrder = idx + 1;
    item.slNo = idx + 1;
    item.empId = item.empId || `DOC-${String(idx + 1).padStart(3, '0')}`;
  });

  if (mongoose.connection.readyState === 1) {
    try {
      const bulkOps = memoryDoctorStore.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: {
            $set: {
              displayOrder: item.displayOrder,
              slNo: item.slNo,
            },
          },
        },
      }));
      if (bulkOps.length > 0) {
        await (DoctorModel as any).bulkWrite(bulkOps);
      }
    } catch (err: any) {
      console.warn('[Doctor DB Reindex Notice]:', err?.message || err);
    }
  }
}

// Helper: Load existing doctor records from MongoDB Atlas into in-memory cache (NO AUTO-SEEDING)
export async function initDoctorDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbDoctors = await (DoctorModel as any).find({}).sort({ displayOrder: 1 }).lean();
      if (dbDoctors) {
        memoryDoctorStore = dbDoctors.map((s: any, idx: number) => ({
          ...s,
          id: s.id || (s._id ? String(s._id) : `doc-${idx + 1}`),
          slNo: s.slNo || idx + 1,
          displayOrder: s.displayOrder || idx + 1,
        }));
        console.log(`[Doctor DB Sync] Loaded ${dbDoctors.length} doctor records from MongoDB Atlas into memory store.`);
      }
    }
  } catch (err: any) {
    console.error('[Doctor DB Init Error]:', err?.message || err);
  }
}

// GET /api/v1/doctors - Fetch all doctor records from Doctors data source ONLY
export const handleGetDoctors = async (req: Request, res: Response) => {
  try {
    let doctors: any[] = [];
    if (mongoose.connection.readyState === 1) {
      doctors = await (DoctorModel as any).find({}).sort({ displayOrder: 1 }).lean();
    } else {
      doctors = memoryDoctorStore;
    }

    doctors = doctors.map((item: any, idx: number) => ({
      ...item,
      id: item.id || (item._id ? String(item._id) : `doc-${idx + 1}`),
      slNo: item.slNo || idx + 1,
      empId: item.empId || `DOC-${String(idx + 1).padStart(3, '0')}`,
      displayOrder: item.displayOrder || idx + 1,
      roleCategory: item.roleCategory || 'MEDICAL_DOCTOR',
      medicalRegistrationNumber: item.medicalRegistrationNumber || item.registrationNumber || '',
    }));

    const search = req.query.search ? String(req.query.search).trim().toLowerCase() : '';
    const department = req.query.department ? String(req.query.department).trim().toLowerCase() : '';
    const status = req.query.status ? String(req.query.status).trim().toUpperCase() : '';

    if (search) {
      doctors = doctors.filter(
        (d) =>
          (d.name && d.name.toLowerCase().includes(search)) ||
          (d.empId && d.empId.toLowerCase().includes(search)) ||
          (d.department && d.department.toLowerCase().includes(search)) ||
          (d.designation && d.designation.toLowerCase().includes(search)) ||
          (d.medicalRegistrationNumber && d.medicalRegistrationNumber.toLowerCase().includes(search))
      );
    }

    if (department && department !== 'all') {
      doctors = doctors.filter(
        (d) =>
          d.department &&
          (d.department.toLowerCase().includes(department) ||
            (d.departmentId && d.departmentId.toLowerCase() === department))
      );
    }

    if (status && status !== 'ALL') {
      doctors = doctors.filter((d) => (d.status || 'ACTIVE').toUpperCase() === status);
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor records retrieved successfully',
      data: doctors,
      total: doctors.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Doctor Controller Error]:', err?.message || err);
    return res.status(200).json({
      success: true,
      message: 'Retrieved doctor records from fallback store',
      data: memoryDoctorStore,
      total: memoryDoctorStore.length,
    });
  }
};

// GET /api/v1/doctors/:id
export const handleGetSingleDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let doctor: any = null;
    if (mongoose.connection.readyState === 1) {
      doctor = await (DoctorModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      }).lean();
    }
    if (!doctor) {
      doctor = memoryDoctorStore.find((d) => d.id === id || d.empId === id);
    }
    if (!doctor) {
      return res.status(404).json({ success: false, message: `Doctor with ID '${id}' not found.` });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch doctor.' });
  }
};

// POST /api/v1/doctors
export const handleCreateDoctor = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  try {
    const data = req.body;
    console.log('[DOCTOR CREATE PAYLOAD]', data);
    const newId = `doc-${Date.now()}`;

    let docCount = memoryDoctorStore.length;
    if (mongoose.connection.readyState === 1) {
      docCount = await (DoctorModel as any).countDocuments();
    }

    let generatedEmpId = data.empId;
    if (!generatedEmpId) {
      let num = docCount + 1;
      let candidate = `DOC-${String(num).padStart(3, '0')}`;
      let exists = memoryDoctorStore.some((d) => d.empId === candidate);
      if (mongoose.connection.readyState === 1 && !exists) {
        exists = !!(await (DoctorModel as any).findOne({ empId: candidate }));
      }
      while (exists) {
        num++;
        candidate = `DOC-${String(num).padStart(3, '0')}`;
        exists = memoryDoctorStore.some((d) => d.empId === candidate);
        if (mongoose.connection.readyState === 1 && !exists) {
          exists = !!(await (DoctorModel as any).findOne({ empId: candidate }));
        }
      }
      generatedEmpId = candidate;
    }

    const nextOrder = docCount + 1;
    const category = (data.category && data.category !== 'ACADEMIC FACULTY') ? data.category : 'CLINICAL_DOCTOR';

    const newDoctor: any = {
      ...data,
      id: newId,
      slNo: nextOrder,
      displayOrder: nextOrder,
      empId: generatedEmpId,
      roleCategory: 'MEDICAL_DOCTOR',
      category: category,
      status: data.status || 'ACTIVE',
      medicalRegistrationNumber: data.medicalRegistrationNumber || data.registrationNumber || '',
    };

    memoryDoctorStore.push(newDoctor);
    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (DoctorModel as any).create(newDoctor);
    }

    return res.status(201).json({
      success: true,
      message: 'Doctor record created successfully.',
      data: newDoctor,
    });
  } catch (err: any) {
    console.error('[Create Doctor Error]:', err?.message || err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to create doctor record.' });
  }
};

// PUT/PATCH /api/v1/doctors/:id
export const handleUpdateDoctor = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;
  const updates = req.body;

  try {
    let updatedDoc: any = null;
    const memIdx = memoryDoctorStore.findIndex((d) => d.id === id);
    if (memIdx !== -1) {
      memoryDoctorStore[memIdx] = { ...memoryDoctorStore[memIdx], ...updates };
      updatedDoc = memoryDoctorStore[memIdx];
    }

    if (mongoose.connection.readyState === 1) {
      const dbDoc = await (DoctorModel as any).findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updates },
        { new: true }
      ).lean();
      if (dbDoc) updatedDoc = dbDoc;
    }

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: `Doctor record with ID '${id}' not found.` });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor record updated successfully.',
      data: updatedDoc,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to update doctor.' });
  }
};

// DELETE /api/v1/doctors/:id
export const handleDeleteDoctor = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;
  console.log(`[DOCTOR DELETE] id=${id}`);

  try {
    let targetDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      targetDoc = await (DoctorModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!targetDoc) {
      targetDoc = memoryDoctorStore.find((d) => d.id === id);
    }

    if (targetDoc?.photo?.driveFileId) {
      try {
        await googleDriveService.deleteFile(targetDoc.photo.driveFileId);
      } catch (e: any) {
        console.warn(`[Doctor Drive Delete Notice]:`, e?.message || e);
      }
    }

    const initialLen = memoryDoctorStore.length;
    memoryDoctorStore = memoryDoctorStore.filter((d) => d.id !== id);

    if (memoryDoctorStore.length === initialLen && mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: `Doctor record with ID '${id}' not found.` });
    }

    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (DoctorModel as any).deleteOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor record deleted successfully.',
      data: { id },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to delete doctor.' });
  }
};

// POST /api/v1/doctors/:doctorId/photo
export const handleUploadDoctorPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const doctorId = req.params.doctorId || req.params.id;
  const files = (req as any).files;
  const file = files && files.length > 0 ? files[0] : (req as any).file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No photo file provided.' });
  }

  try {
    let driveRes: any = null;
    try {
      driveRes = await googleDriveService.uploadFile(file.buffer, file.originalname, file.mimetype);
    } catch (gErr: any) {
      console.warn('[Doctor Photo Upload Drive Notice]:', gErr?.message || gErr);
    }

    const photoMeta = {
      driveFileId: driveRes?.id || `local-${Date.now()}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
    const photoUrl = driveRes?.webContentLink || driveRes?.webViewLink || '';

    const updates = { photo: photoMeta, photoUrl };

    if (mongoose.connection.readyState === 1) {
      await (DoctorModel as any).updateOne(
        { $or: [{ id: doctorId }, { _id: mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : null }] },
        { $set: updates }
      );
    }

    const idx = memoryDoctorStore.findIndex((d) => d.id === doctorId);
    if (idx !== -1) {
      memoryDoctorStore[idx].photo = photoMeta;
      memoryDoctorStore[idx].photoUrl = photoUrl;
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor photo uploaded successfully.',
      data: { doctorId, photo: photoMeta, photoUrl },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Photo upload failed.' });
  }
};

// GET /api/v1/doctors/:doctorId/photo
export const handleGetDoctorPhoto = async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId || req.params.id;
  try {
    let doctor: any = null;
    if (mongoose.connection.readyState === 1) {
      doctor = await (DoctorModel as any).findOne({
        $or: [{ id: doctorId }, { _id: mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : null }],
      }).lean();
    }
    if (!doctor) {
      doctor = memoryDoctorStore.find((d) => d.id === doctorId);
    }

    const driveFileId = doctor?.photo?.driveFileId;
    if (driveFileId) {
      try {
        const stream = await googleDriveService.getFileStream(driveFileId);
        res.setHeader('Content-Type', doctor.photo.mimeType || 'image/jpeg');
        return stream.pipe(res);
      } catch (err: any) {
        console.warn(`[Doctor Photo Stream Notice]:`, err?.message || err);
      }
    }

    if (doctor?.photoUrl && doctor.photoUrl.startsWith('http')) {
      return res.redirect(doctor.photoUrl);
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cbd5e1" width="256" height="256"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`;
    return res.send(defaultSvg);
  } catch (err: any) {
    res.setHeader('Content-Type', 'image/svg+xml');
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cbd5e1" width="256" height="256"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`;
    return res.send(defaultSvg);
  }
};

// DELETE /api/v1/doctors/:doctorId/photo
export const handleDeleteDoctorPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const doctorId = req.params.doctorId || req.params.id;

  try {
    let doctorDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      doctorDoc = await (DoctorModel as any).findOne({
        $or: [{ id: doctorId }, { _id: mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : null }],
      });
    }
    if (!doctorDoc) {
      doctorDoc = memoryDoctorStore.find((d) => d.id === doctorId);
    }
    if (!doctorDoc) {
      return res.status(404).json({ success: false, message: `Doctor record with ID '${doctorId}' not found.` });
    }

    const driveFileId = doctorDoc.photo?.driveFileId;
    if (driveFileId) {
      try {
        await googleDriveService.deleteFile(driveFileId);
      } catch (delErr: any) {
        console.warn('[Doctor Photo Delete Notice]:', delErr?.message || delErr);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await (DoctorModel as any).updateOne(
        { $or: [{ id: doctorId }, { _id: mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : null }] },
        { $unset: { photo: 1 }, $set: { photoUrl: '' } }
      );
    }
    const memIdx = memoryDoctorStore.findIndex((d) => d.id === doctorId);
    if (memIdx !== -1) {
      memoryDoctorStore[memIdx].photo = null;
      memoryDoctorStore[memIdx].photoUrl = '';
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor photo deleted successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to delete photo.' });
  }
};
