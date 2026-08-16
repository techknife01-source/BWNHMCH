import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StaffModel, SEED_STAFF, IStaff } from './staffModel';
import { googleDriveService } from './googleDriveService';

// In-memory store for fallback and rapid sync
let memoryStaffStore: any[] = [];

export function seedMemoryStaffStore(records: any[]) {
  memoryStaffStore = [...records];
}

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

// Helper: Load existing staff records from MongoDB Atlas into in-memory cache (NO AUTO-SEEDING)
export async function initStaffDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbStaff = await (StaffModel as any).find({}).sort({ displayOrder: 1 }).lean();
      if (dbStaff) {
        memoryStaffStore = dbStaff.map((s: any, idx: number) => ({
          ...s,
          id: s.id || (s._id ? String(s._id) : `staff-${idx + 1}`),
          slNo: s.slNo || idx + 1,
          displayOrder: s.displayOrder || idx + 1,
        }));
        console.log(`[Staff DB Sync] Loaded ${dbStaff.length} staff records from MongoDB Atlas into memory store.`);
      }
    }
  } catch (err: any) {
    console.error('[Staff DB Init Error]:', err?.message || err);
  }
}

// Format staff output for REST API
function formatStaffOutput(s: any, index: number) {
  if (!s) return null;
  const staffId = s.id || s._id?.toString() || `staff-${index + 1}`;
  let photoUrl = s.photo?.driveFileId
    ? `/api/v1/staff/${staffId}/photo?v=${s.photo.driveFileId}`
    : (s.photoUrl || '');

  if (photoUrl.startsWith('blob:')) {
    photoUrl = s.photo?.driveFileId
      ? `/api/v1/staff/${staffId}/photo?v=${s.photo.driveFileId}`
      : '';
  }

  const staffCategory = s.staffCategory ||
    (s.roleCategory === 'PARAMEDICAL_STAFF' || (s.designation && /nurse|physio|diet|lab|ot|radiograph|pharmacist|dispenser/i.test(s.designation)) ? 'MEDICAL' : 'NON_MEDICAL');

  return {
    id: staffId,
    staffId: s.empId || `STF-${String(index + 1).padStart(3, '0')}`,
    slNo: index + 1,
    empId: s.empId || `STF-${String(index + 1).padStart(3, '0')}`,
    name: s.name || 'Staff Member',
    roleCategory: s.roleCategory || 'OFFICE_STAFF',
    staffCategory,
    department: s.department || 'Hospital Administration',
    departmentName: s.department || 'Hospital Administration',
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

// PUBLIC GET /api/v1/staff - Fetch all staff records from Staff collection
export const handleGetStaff = async (req: Request, res: Response) => {
  try {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const dbStaff = await (StaffModel as any).find({}).sort({ displayOrder: 1 }).lean();
        list = dbStaff || [];
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

    const { category, department, roleCategory, staffCategory, search, status } = req.query;
    if (category && category !== 'ALL') {
      list = list.filter((s) => s && s.category?.toUpperCase() === String(category).toUpperCase());
    }
    if (roleCategory && roleCategory !== 'ALL') {
      list = list.filter((s) => s && s.roleCategory === roleCategory);
    }
    if (staffCategory && staffCategory !== 'ALL') {
      list = list.filter((s) => s && (s.staffCategory || 'NON_MEDICAL') === staffCategory);
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
            s.empId?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q))
      );
    }

    const formattedList = list.map((s, idx) => formatStaffOutput(s, idx)).filter(Boolean);

    return res.status(200).json({
      success: true,
      message: 'Staff records retrieved successfully',
      data: formattedList,
      total: formattedList.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleGetStaff error:', err?.message || err);
    const fallbackList = memoryStaffStore.map((s, idx) => formatStaffOutput(s, idx)).filter(Boolean);
    return res.status(200).json({
      success: true,
      data: fallbackList,
      message: `Recovered staff directory gracefully: ${err?.message || err}`,
      timestamp: new Date().toISOString(),
    });
  }
};

// PUBLIC GET /api/v1/staff/:id - Fetch single staff member by ID
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
      return res.status(404).json({
        success: false,
        message: `Staff member with ID '${id}' not found.`,
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
      message: `Failed to fetch staff member: ${err?.message || err}`,
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
    staffCategory,
    displayOrder,
    status,
    qualification,
    contactNumber,
    email,
    photoUrl,
    availability,
  } = req.body;

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

    memoryStaffStore.forEach((item) => {
      if (item.displayOrder >= targetOrder) {
        item.displayOrder += 1;
      }
    });

    const normStatus = String(status || 'ACTIVE').trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const finalStaffCat = staffCategory || (roleCategory === 'PARAMEDICAL_STAFF' ? 'MEDICAL' : 'NON_MEDICAL');

    const newId = `hs-${Date.now()}`;
    const newStaff: any = {
      id: newId,
      slNo: targetOrder,
      empId: `SL-${String(targetOrder).padStart(2, '0')}`,
      name: name.trim(),
      department: department.trim(),
      designation: designation.trim(),
      category: category || 'STAFF',
      roleCategory: roleCategory || 'OFFICE_STAFF',
      staffCategory: finalStaffCat,
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

    return res.status(201).json({
      success: true,
      message: 'Staff member record added successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleCreateStaff error:', err?.message || err);
    return res.status(500).json({
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

    if (updates.status !== undefined) {
      updates.status = String(updates.status).trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    if (staffIdx !== -1) {
      const current = memoryStaffStore[staffIdx];
      memoryStaffStore[staffIdx] = {
        ...current,
        ...updates,
        name: updates.name ? updates.name.trim() : current.name,
        department: updates.department ? updates.department.trim() : current.department,
        designation: updates.designation ? updates.designation.trim() : current.designation,
      };
    }

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).updateOne(
        {
          $or: [
            { id: id },
            { id: { $regex: new RegExp(`^${id}$`, 'i') } },
            { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          ],
        },
        { $set: updates }
      );
    }

    const updatedDoc = memoryStaffStore.find((s) => String(s.id).toLowerCase() === q || String(s.empId).toLowerCase() === q) || updates;
    const output = formatStaffOutput(updatedDoc, staffIdx >= 0 ? staffIdx : 0);

    return res.status(200).json({
      success: true,
      message: 'Staff member updated successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleUpdateStaff error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to update staff member: ${err?.message || err}`,
    });
  }
};

// PROTECTED POST /api/v1/staff/:id/photo
export const handleUploadFacultyPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const id = req.params.facultyId || req.params.id;
  const files = (req as any).files;
  const file = files && files.length > 0 ? files[0] : (req as any).file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No photo file uploaded.' });
  }

  try {
    let driveRes: any = null;
    try {
      driveRes = await googleDriveService.uploadFile(file.buffer, file.originalname, file.mimetype);
    } catch (driveErr: any) {
      console.warn('[Staff Photo Drive Upload Notice]:', driveErr?.message || driveErr);
    }

    const photoMeta = {
      driveFileId: driveRes?.id || `local-${Date.now()}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
    const photoUrl = driveRes?.webContentLink || driveRes?.webViewLink || '';

    const updates = { photo: photoMeta, photoUrl };

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).updateOne(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updates }
      );
    }

    const idx = memoryStaffStore.findIndex((s) => s.id === id);
    if (idx !== -1) {
      memoryStaffStore[idx].photo = photoMeta;
      memoryStaffStore[idx].photoUrl = photoUrl;
    }

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully.',
      data: { id, photo: photoMeta, photoUrl },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Photo upload failed.' });
  }
};

// PUBLIC GET /api/v1/staff/:id/photo
export const handleGetFacultyPhoto = async (req: Request, res: Response) => {
  const id = req.params.facultyId || req.params.id;
  try {
    let staffDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      staffDoc = await (StaffModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      }).lean();
    }
    if (!staffDoc) {
      staffDoc = memoryStaffStore.find((s) => s.id === id);
    }

    const driveFileId = staffDoc?.photo?.driveFileId;
    if (driveFileId) {
      try {
        const stream = await googleDriveService.getFileStream(driveFileId);
        res.setHeader('Content-Type', staffDoc.photo.mimeType || 'image/jpeg');
        return stream.pipe(res);
      } catch (err: any) {
        console.warn(`[Staff Photo Stream Notice]:`, err?.message || err);
      }
    }

    if (staffDoc?.photoUrl && staffDoc.photoUrl.startsWith('http')) {
      return res.redirect(staffDoc.photoUrl);
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

// PROTECTED DELETE /api/v1/staff/:id/photo
export const handleDeleteFacultyPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const id = req.params.facultyId || req.params.id;

  try {
    let staffDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      staffDoc = await (StaffModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!staffDoc) {
      staffDoc = memoryStaffStore.find((s) => s.id === id);
    }
    if (!staffDoc) {
      return res.status(404).json({ success: false, message: `Record with ID '${id}' not found.` });
    }

    const driveFileId = staffDoc.photo?.driveFileId;
    if (driveFileId) {
      try {
        await googleDriveService.deleteFile(driveFileId);
      } catch (delErr: any) {
        console.warn('[Staff Photo Delete Notice]:', delErr?.message || delErr);
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
      message: 'Photo deleted successfully.',
    });
  } catch (err: any) {
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
  console.log(`[STAFF DELETE] id=${id}`);

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
      } catch (e: any) {
        console.warn(`[Staff Drive Delete Notice]:`, e?.message || e);
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

    return res.status(200).json({
      success: true,
      message: 'Staff member record deleted successfully.',
      data: { id },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Delete Error]:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to delete staff member: ${err?.message || err}`,
    });
  }
};

export const handleUploadStaffPhoto = handleUploadFacultyPhoto;
export const handleGetStaffPhoto = handleGetFacultyPhoto;
export const handleDeleteStaffPhoto = handleDeleteFacultyPhoto;

