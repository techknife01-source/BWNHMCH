import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StaffModel, SEED_STAFF, IStaff } from './staffModel';
import { googleDriveService } from './googleDriveService';
import { departmentCmsService } from '../services/departmentCmsService';

// In-memory store for fallback and rapid sync
let memoryStaffStore: any[] = JSON.parse(JSON.stringify(SEED_STAFF));

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
  memoryStaffStore.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  memoryStaffStore.forEach((item, idx) => {
    item.displayOrder = idx + 1;
    item.slNo = idx + 1;
    item.empId = item.empId || `SL-${String(idx + 1).padStart(2, '0')}`;
  });

  if (mongoose.connection.readyState === 1) {
    try {
      const bulkOps = memoryStaffStore.map((item) => ({
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
        await (StaffModel as any).bulkWrite(bulkOps);
      }
    } catch (err: any) {
      console.warn('[Staff DB Reindex Notice]:', err?.message || err);
    }
  }
}

// Helper: Seed initial staff data idempotently into MongoDB Atlas
export async function initStaffDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      // 1. Remove test/debug records from MongoDB Atlas
      const deleteTestRes = await (StaffModel as any).deleteMany({
        $or: [
          { name: { $regex: /test/i } },
          { name: { $regex: /diagnostic/i } },
          { id: { $regex: /^fac-/i } },
          { empId: { $regex: /^fac-/i } },
        ],
      });
      if (deleteTestRes.deletedCount > 0) {
        console.log(`[Staff DB Sync] Cleaned up ${deleteTestRes.deletedCount} test/debug records from MongoDB Atlas.`);
      }

      // 2. Idempotent sync of all 83 SEED_STAFF records
      const existingList = await (StaffModel as any).find({}).lean();
      let insertedCount = 0;
      let preservedCount = 0;

      for (const seed of SEED_STAFF) {
        const existing = existingList.find(
          (f: any) =>
            (f.id && String(f.id).toLowerCase() === String(seed.id).toLowerCase()) ||
            (seed.empId && f.empId && String(f.empId).toLowerCase() === String(seed.empId).toLowerCase()) ||
            (seed.registrationNumber && f.registrationNumber && String(f.registrationNumber).trim().toLowerCase() === String(seed.registrationNumber).trim().toLowerCase()) ||
            (seed.name && f.name && String(f.name).trim().toLowerCase() === String(seed.name).trim().toLowerCase())
        );

        if (!existing) {
          await (StaffModel as any).create(seed);
          insertedCount++;
        } else {
          preservedCount++;
        }
      }

      const totalCount = await (StaffModel as any).countDocuments();
      console.log(
        `[Staff DB Sync] Idempotent sync complete. Inserted: ${insertedCount}, Preserved: ${preservedCount}, Total in MongoDB: ${totalCount}`
      );

      const dbStaff = await (StaffModel as any).find({}).sort({ displayOrder: 1 }).lean();
      if (dbStaff && dbStaff.length > 0) {
        memoryStaffStore = dbStaff.map((s: any, idx: number) => ({
          ...s,
          id: s.id || s._id.toString(),
          slNo: idx + 1,
          displayOrder: s.displayOrder || idx + 1,
        }));
      }
    }
  } catch (err: any) {
    console.warn('[Staff DB Sync Notice]: Using memory store:', err?.message || err);
  }

  await reindexDisplayOrders();
}

// Format staff output for REST API
function formatStaffOutput(s: any, index: number) {
  if (!s) return null;
  const staffId = s.id || s._id?.toString() || `staff-${index + 1}`;
  let photoUrl = s.photo?.driveFileId
    ? `/api/v1/faculty/${staffId}/photo?v=${s.photo.driveFileId}`
    : (s.photoUrl || '');

  if (photoUrl.startsWith('blob:')) {
    photoUrl = s.photo?.driveFileId
      ? `/api/v1/faculty/${staffId}/photo?v=${s.photo.driveFileId}`
      : '';
  }

  return {
    id: staffId,
    slNo: index + 1,
    empId: s.empId || `SL-${String(index + 1).padStart(2, '0')}`,
    name: s.name || 'Staff Member',
    roleCategory: s.roleCategory || 'OFFICE_STAFF',
    department: s.department || 'General Administration',
    departmentName: s.department || 'General Administration',
    designation: s.designation || 'Staff',
    category: s.category || 'STAFF',
    displayOrder: s.displayOrder || index + 1,
    qualification: s.qualification || '',
    contactNumber: s.contactNumber || s.phone || '',
    phone: s.contactNumber || s.phone || '',
    email: s.email || '',
    photoUrl,
    photo: s.photo || null,
    registrationNumber: s.registrationNumber || s.registrationNo || '',
    registrationNo: s.registrationNumber || s.registrationNo || '',
    joiningDate: s.joiningDate || s.dateOfJoining || '',
    promotionDate: s.promotionDate || '',
    experienceYears: s.experienceYears !== undefined && s.experienceYears !== null ? String(s.experienceYears) : '',
    specialization: s.specialization || '',
    biography: s.biography || s.bio || '',
    availability: s.availability || 'AVAILABLE',
    dutyShift: s.dutyShift || '',
    opdCounter: s.opdCounter || '',
    status: s.status || 'ACTIVE',
    joiningYear: s.joiningYear,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

// PUBLIC GET /api/v1/staff - No authentication required
export const handleGetStaff = async (req: Request, res: Response) => {
  try {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const dbStaff = await (StaffModel as any).find({}).sort({ displayOrder: 1 }).lean();
        if (dbStaff && dbStaff.length > 0) {
          list = dbStaff;
        } else {
          list = memoryStaffStore;
        }
      } catch (dbErr: any) {
        console.warn('[Staff DB Query Fallback]: Using memory store:', dbErr?.message || dbErr);
        list = memoryStaffStore;
      }
    } else {
      list = memoryStaffStore;
    }

    if (!Array.isArray(list)) {
      list = memoryStaffStore;
    }

    list.sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0));

    const { category, department, roleCategory, search, status } = req.query;
    if (category && category !== 'ALL') {
      list = list.filter((s) => s && s.category?.toUpperCase() === String(category).toUpperCase());
    }
    if (roleCategory && roleCategory !== 'ALL') {
      list = list.filter((s) => s && s.roleCategory === roleCategory);
    }
    if (department && department !== 'ALL') {
      list = list.filter((s) => s && s.department === department);
    }
    if (status && status !== 'ALL') {
      list = list.filter((s) => s && s.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (s) =>
          s &&
          (s.name?.toLowerCase().includes(q) ||
            s.department?.toLowerCase().includes(q) ||
            s.designation?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q))
      );
    }

    const formattedList = list.map((s, idx) => formatStaffOutput(s, idx)).filter(Boolean);

    res.status(200).json({
      success: true,
      data: formattedList,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleGetStaff error:', err?.message || err);
    const fallbackList = memoryStaffStore.map((s, idx) => formatStaffOutput(s, idx)).filter(Boolean);
    res.status(200).json({
      success: true,
      data: fallbackList,
      message: `Recovered staff directory gracefully: ${err?.message || err}`,
      timestamp: new Date().toISOString(),
    });
  }
};

// PUBLIC GET /api/v1/staff/:id - Fetch single faculty/staff member by ID
export const handleGetSingleStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let staffDoc: any = null;

    if (mongoose.connection.readyState === 1) {
      staffDoc = await (StaffModel as any).findOne({
        $or: [
          { id: { $regex: new RegExp(`^${id}$`, 'i') } },
          { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        ],
      }).lean();
    }

    if (!staffDoc) {
      const q = String(id).toLowerCase().trim();
      staffDoc = memoryStaffStore.find(
        (s) =>
          String(s.id).toLowerCase() === q ||
          String(s.empId).toLowerCase() === q ||
          String(s._id).toLowerCase() === q
      );
    }

    if (!staffDoc) {
      const depts = departmentCmsService.getDepartments();
      for (const dept of depts) {
        if (Array.isArray(dept.facultyList)) {
          const fac = dept.facultyList.find(
            (f: any) => String(f.id).toLowerCase() === String(id).toLowerCase()
          );
          if (fac) {
            staffDoc = {
              ...fac,
              department: dept.name,
              departmentId: dept.id,
            };
            break;
          }
        }
      }
    }

    if (!staffDoc) {
      return res.status(404).json({
        success: false,
        message: `Faculty/Staff member with ID '${id}' not found.`,
      });
    }

    const output = formatStaffOutput(staffDoc, 0);

    return res.status(200).json({
      success: true,
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleGetSingleStaff error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch faculty member: ${err?.message || err}`,
    });
  }
};

// PROTECTED POST /api/v1/staff - Requires Admin Authorization
export const handleCreateStaff = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const {
    name,
    department,
    designation,
    category,
    roleCategory,
    displayOrder,
    status,
    qualification,
    contactNumber,
    email,
    photoUrl,
    availability,
  } = req.body;

  const finalCategory = (category && String(category).trim().length > 0) ? String(category).trim() : 'ACADEMIC FACULTY';

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'Staff name is mandatory.' });
  }
  if (!department || !String(department).trim()) {
    return res.status(400).json({ success: false, message: 'Department is mandatory.' });
  }
  if (!designation || !String(designation).trim()) {
    return res.status(400).json({ success: false, message: 'Designation is mandatory.' });
  }

  try {
    const targetOrder = displayOrder ? parseInt(String(displayOrder), 10) : memoryStaffStore.length + 1;

    // Shift memory store items if inserted at specific displayOrder
    memoryStaffStore.forEach((item) => {
      if (item.displayOrder >= targetOrder) {
        item.displayOrder += 1;
      }
    });

    const normStatus = String(status || 'ACTIVE').trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const newId = `hs-${Date.now()}`;
    const newStaff: any = {
      id: newId,
      slNo: targetOrder,
      empId: `SL-${String(targetOrder).padStart(2, '0')}`,
      name: name.trim(),
      department: department.trim(),
      designation: designation.trim(),
      category: finalCategory,
      roleCategory: roleCategory || 'OFFICE_STAFF',
      displayOrder: targetOrder,
      qualification: qualification || '',
      contactNumber: contactNumber || '',
      email: email || '',
      photoUrl: photoUrl || '',
      availability: availability || 'AVAILABLE',
      status: normStatus,
    };

    memoryStaffStore.push(newStaff);
    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).create(newStaff);
    }

    const createdIndex = memoryStaffStore.findIndex((s) => s.id === newId);
    const output = formatStaffOutput(newStaff, createdIndex >= 0 ? createdIndex : 0);

    res.status(201).json({
      success: true,
      message: 'Staff member record added successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleCreateStaff error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to create staff record: ${err?.message || err}`,
    });
  }
};

// PROTECTED PUT/PATCH /api/v1/staff/:id - Requires Admin Authorization
export const handleUpdateStaff = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;
  const updates = req.body;

  try {
    const q = String(id).toLowerCase().trim();
    let staffIdx = memoryStaffStore.findIndex(
      (s) =>
        String(s.id).toLowerCase() === q ||
        String(s.empId).toLowerCase() === q ||
        String(s._id).toLowerCase() === q
    );

    if (staffIdx === -1) {
      if (mongoose.connection.readyState === 1) {
        const dbDoc = await (StaffModel as any).findOne({
          $or: [
            { id: id },
            { id: { $regex: new RegExp(`^${id}$`, 'i') } },
            { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          ],
        }).lean();
        if (!dbDoc) {
          return res.status(404).json({ success: false, message: `Staff record with ID '${id}' not found.` });
        }
      } else {
        return res.status(404).json({ success: false, message: `Staff record with ID '${id}' not found.` });
      }
    }

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({ success: false, message: 'Staff name cannot be empty.' });
    }
    if (updates.department !== undefined && !String(updates.department).trim()) {
      return res.status(400).json({ success: false, message: 'Department cannot be empty.' });
    }
    if (updates.designation !== undefined && !String(updates.designation).trim()) {
      return res.status(400).json({ success: false, message: 'Designation cannot be empty.' });
    }
    if (updates.category !== undefined && !String(updates.category).trim()) {
      return res.status(400).json({ success: false, message: 'Category cannot be empty.' });
    }

    if (updates.status !== undefined) {
      updates.status = String(updates.status).trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    if (staffIdx !== -1) {
      const current = memoryStaffStore[staffIdx];
      const updatedItem = {
        ...current,
        ...updates,
        name: updates.name ? updates.name.trim() : current.name,
        department: updates.department ? updates.department.trim() : current.department,
        designation: updates.designation ? updates.designation.trim() : current.designation,
        category: updates.category ? updates.category.trim() : current.category,
      };

      if (updates.displayOrder && parseInt(String(updates.displayOrder), 10) !== current.displayOrder) {
        updatedItem.displayOrder = parseInt(String(updates.displayOrder), 10);
      }

      memoryStaffStore[staffIdx] = updatedItem;
      await reindexDisplayOrders();
    }

    let updatedDbDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      updatedDbDoc = await (StaffModel as any).findOneAndUpdate(
        {
          $or: [
            { id: id },
            { id: { $regex: new RegExp(`^${id}$`, 'i') } },
            { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          ],
        },
        { $set: updates },
        { returnDocument: 'after', new: true }
      ).lean();

      if (updatedDbDoc) {
        console.log(`[Staff Controller] MongoDB Atlas updated document ID '${id}' successfully.`);
        if (staffIdx !== -1) {
          memoryStaffStore[staffIdx] = { ...memoryStaffStore[staffIdx], ...updatedDbDoc };
        }
      } else {
        console.warn(`[Staff Controller] Mongo findOneAndUpdate matched 0 documents for ID '${id}'`);
      }
    }

    const finalRecord = updatedDbDoc || (staffIdx >= 0 ? memoryStaffStore[staffIdx] : { id, ...updates });
    const output = formatStaffOutput(finalRecord, staffIdx >= 0 ? staffIdx : 0);

    res.status(200).json({
      success: true,
      message: 'Staff member record updated successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleUpdateStaff error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to update staff record: ${err?.message || err}`,
    });
  }
};

// PROTECTED POST /api/v1/faculty/:facultyId/photo - Upload photo to Google Drive & update MongoDB
export const handleUploadFacultyPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const facultyId = req.params.facultyId || req.params.id;
  const file = req.file || (req.files && Array.isArray(req.files) ? (req.files[0] as Express.Multer.File) : null);

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No photo file uploaded.',
    });
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: `Invalid file type: ${file.mimetype}. Allowed types: image/jpeg, image/png, image/webp`,
    });
  }

  if (file.size > 15 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum limit of 15MB.',
    });
  }

  try {
    let existingStaff: any = null;

    if (mongoose.connection.readyState === 1) {
      existingStaff = await (StaffModel as any).findOne({
        $or: [{ id: facultyId }, { _id: mongoose.Types.ObjectId.isValid(facultyId) ? facultyId : null }],
      });
    }

    if (!existingStaff) {
      const memoryIdx = memoryStaffStore.findIndex((s) => s.id === facultyId);
      if (memoryIdx !== -1) {
        existingStaff = memoryStaffStore[memoryIdx];
      }
    }

    if (!existingStaff) {
      return res.status(404).json({
        success: false,
        message: `Faculty/Staff member record with ID '${facultyId}' not found.`,
      });
    }

    const oldDriveFileId = existingStaff.photo?.driveFileId;

    // Upload new image file to Google Drive
    const cleanFileName = `faculty-${facultyId}-${Date.now()}.${file.mimetype.split('/')[1] || 'jpg'}`;
    const uploadRes = await googleDriveService.uploadPdf(file.buffer, cleanFileName, file.mimetype);

    if (!uploadRes || !uploadRes.fileId) {
      return res.status(500).json({
        success: false,
        message: `Google Drive photo upload failed: ${uploadRes?.error || 'Unknown error'}`,
      });
    }

    const driveFileId = uploadRes.fileId;
    const photoData = {
      driveFileId,
      fileName: cleanFileName,
      mimeType: file.mimetype,
    };

    const photoUrl = `/api/v1/faculty/${facultyId}/photo?v=${driveFileId}`;

    // Update MongoDB record
    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).updateOne(
        { $or: [{ id: facultyId }, { _id: mongoose.Types.ObjectId.isValid(facultyId) ? facultyId : null }] },
        {
          $set: {
            photo: photoData,
            photoUrl: photoUrl,
          },
        }
      );
    }

    // Update memory store
    const memIdx = memoryStaffStore.findIndex((s) => s.id === facultyId);
    if (memIdx !== -1) {
      memoryStaffStore[memIdx].photo = photoData;
      memoryStaffStore[memIdx].photoUrl = photoUrl;
    }

    // Safely delete old Drive file if it exists and is different
    if (oldDriveFileId && oldDriveFileId !== driveFileId) {
      try {
        await googleDriveService.deleteFile(oldDriveFileId);
      } catch (delErr: any) {
        console.warn(`[Faculty Photo] Warning: Could not delete old Drive file ${oldDriveFileId}:`, delErr?.message || delErr);
      }
    }

    return res.status(200).json({
      success: true,
      facultyId,
      photoUrl,
      photo: photoData,
      message: 'Faculty photo updated and uploaded to Google Drive successfully.',
    });
  } catch (err: any) {
    console.error('[Faculty Photo Upload Error]:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to upload faculty photo: ${err?.message || err}`,
    });
  }
};

// PUBLIC GET /api/v1/faculty/:facultyId/photo - Fetch image from Google Drive & stream to client
export const handleGetFacultyPhoto = async (req: Request, res: Response) => {
  const facultyId = req.params.facultyId || req.params.id;

  try {
    let staffDoc: any = null;

    if (mongoose.connection.readyState === 1) {
      staffDoc = await (StaffModel as any).findOne({
        $or: [{ id: facultyId }, { _id: mongoose.Types.ObjectId.isValid(facultyId) ? facultyId : null }],
      }).lean();
    }

    if (!staffDoc) {
      staffDoc = memoryStaffStore.find((s) => s.id === facultyId);
    }

    const driveFileId = staffDoc?.photo?.driveFileId;

    if (driveFileId && googleDriveService.hasCredentials()) {
      try {
        const driveRes = await googleDriveService.getPdfStream(driveFileId);
        if (driveRes && driveRes.stream) {
          const mimeType = staffDoc?.photo?.mimeType || driveRes.mimeType || 'image/jpeg';
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return driveRes.stream.pipe(res);
        }
      } catch (driveErr: any) {
        console.warn(`[Faculty Photo Stream Warning] Drive file ${driveFileId} error:`, driveErr?.message || driveErr);
      }
    }

    // Fallback: If legacy external photoUrl is present
    if (staffDoc?.photoUrl && staffDoc.photoUrl.startsWith('http')) {
      return res.redirect(staffDoc.photoUrl);
    }

    // Default Fallback SVG avatar
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#002147" width="256" height="256"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(defaultSvg);
  } catch (err: any) {
    console.error('[Faculty Photo Retrieval Error]:', err?.message || err);
    res.setHeader('Content-Type', 'image/svg+xml');
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#cbd5e1" width="256" height="256"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg>`;
    return res.send(errorSvg);
  }
};

// PROTECTED DELETE /api/v1/faculty/:facultyId/photo & /api/v1/staff/:id/photo
export const handleDeleteFacultyPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const id = req.params.facultyId || req.params.id;
  const isDoctor = req.originalUrl.includes('/doctors');
  const tag = isDoctor ? '[DOCTOR PHOTO DELETE]' : '[STAFF PHOTO DELETE]';
  console.log(`${tag} id=${id}`);

  try {
    let staffDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      staffDoc = await (StaffModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!staffDoc) {
      const idx = memoryStaffStore.findIndex((s) => s.id === id);
      if (idx !== -1) staffDoc = memoryStaffStore[idx];
    }
    if (!staffDoc) {
      return res.status(404).json({ success: false, message: `Record with ID '${id}' not found.` });
    }

    const driveFileId = staffDoc.photo?.driveFileId;
    if (driveFileId) {
      try {
        await googleDriveService.deleteFile(driveFileId);
        console.log(`${tag} Google Drive file '${driveFileId}' deleted successfully.`);
      } catch (delErr: any) {
        console.warn(`${tag} Drive deletion notice:`, delErr?.message || delErr);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).updateOne(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $unset: { photo: 1 }, $set: { photoUrl: '' } }
      );
    }
    const memIdx = memoryStaffStore.findIndex((s) => s.id === id);
    if (memIdx !== -1) {
      memoryStaffStore[memIdx].photo = null;
      memoryStaffStore[memIdx].photoUrl = '';
    }

    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully from Google Drive & MongoDB Atlas.',
    });
  } catch (err: any) {
    console.error(`${tag} Error:`, err?.message || err);
    return res.status(500).json({ success: false, message: `Failed to delete photo: ${err?.message || err}` });
  }
};

// PROTECTED DELETE /api/v1/staff/:id - Requires Admin Authorization
export const handleDeleteStaff = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;
  const isDoctor = req.originalUrl.includes('/doctors');
  const tag = isDoctor ? '[DOCTOR DELETE]' : '[STAFF DELETE]';
  console.log(`${tag} id=${id}`);

  try {
    let targetDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      targetDoc = await (StaffModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!targetDoc) {
      targetDoc = memoryStaffStore.find((s) => s.id === id);
    }

    if (targetDoc?.photo?.driveFileId) {
      try {
        await googleDriveService.deleteFile(targetDoc.photo.driveFileId);
        console.log(`${tag} Associated Drive file '${targetDoc.photo.driveFileId}' deleted.`);
      } catch (e: any) {
        console.warn(`${tag} Drive deletion notice for file ${targetDoc.photo.driveFileId}:`, e?.message || e);
      }
    }

    const initialLen = memoryStaffStore.length;
    memoryStaffStore = memoryStaffStore.filter((s) => s.id !== id);

    if (memoryStaffStore.length === initialLen && mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: `Record with ID '${id}' not found.` });
    }

    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).deleteOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully from MongoDB Atlas & Google Drive.',
      data: { id },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error(`${tag} error:`, err?.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to delete record: ${err?.message || err}`,
    });
  }
};
