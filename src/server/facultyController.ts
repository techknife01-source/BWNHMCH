import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { FacultyModel, SEED_FACULTY, IFaculty } from './facultyModel';
import { googleDriveService } from './googleDriveService';

// In-memory store for fallback and rapid sync
let memoryFacultyStore: any[] = JSON.parse(JSON.stringify(SEED_FACULTY));

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
  memoryFacultyStore.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  memoryFacultyStore.forEach((item, idx) => {
    item.displayOrder = idx + 1;
    item.slNo = idx + 1;
    item.empId = item.empId || `BHMC-T-${String(idx + 1).padStart(3, '0')}`;
  });

  if (mongoose.connection.readyState === 1) {
    try {
      const bulkOps = memoryFacultyStore.map((item) => ({
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
        await (FacultyModel as any).bulkWrite(bulkOps);
      }
    } catch (err: any) {
      console.warn('[Faculty DB Reindex Notice]:', err?.message || err);
    }
  }
}

// Helper: Seed initial faculty data idempotently into MongoDB Atlas faculty collection
export async function initFacultyDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      const seedIds = SEED_FACULTY.map((s) => s.id);
      await (FacultyModel as any).deleteMany({ id: { $nin: seedIds } });

      for (const seed of SEED_FACULTY) {
        const existing = await (FacultyModel as any).findOne({ id: seed.id });
        if (!existing) {
          await (FacultyModel as any).create(seed);
        }
      }

      const dbFaculty = await (FacultyModel as any).find({}).sort({ displayOrder: 1 }).lean();
      memoryFacultyStore = dbFaculty.map((f: any, idx: number) => ({
        ...f,
        id: f.id || (f._id ? String(f._id) : `fac-${idx + 1}`),
        slNo: idx + 1,
        displayOrder: f.displayOrder || idx + 1,
      }));
      console.log(`[Faculty DB Sync] Idempotent sync complete. Total in MongoDB 'faculty' collection: ${dbFaculty.length}`);
    } else {
      memoryFacultyStore = JSON.parse(JSON.stringify(SEED_FACULTY));
    }
    await reindexDisplayOrders();
  } catch (err: any) {
    console.warn('[Faculty DB Sync Notice]: Using memory store:', err?.message || err);
  }
}

// Format faculty output for REST API
function formatFacultyOutput(f: any, index: number) {
  if (!f) return null;
  const facultyId = f.id || f._id?.toString() || `fac-${index + 1}`;
  let photoUrl = f.photo?.driveFileId
    ? `/api/v1/faculty/${facultyId}/photo?v=${f.photo.driveFileId}`
    : (f.photoUrl || '');

  if (photoUrl.startsWith('blob:')) {
    photoUrl = f.photo?.driveFileId
      ? `/api/v1/faculty/${facultyId}/photo?v=${f.photo.driveFileId}`
      : '';
  }

  return {
    id: facultyId,
    facultyId: f.empId || `BHMC-T-${String(index + 1).padStart(3, '0')}`,
    slNo: index + 1,
    empId: f.empId || `BHMC-T-${String(index + 1).padStart(3, '0')}`,
    name: f.name || f.facultyName || 'Faculty Member',
    facultyName: f.name || f.facultyName || 'Faculty Member',
    department: f.department || f.departmentName || 'Academic Department',
    departmentName: f.department || f.departmentName || 'Academic Department',
    departmentId: f.departmentId || 'org',
    designation: f.designation || 'Faculty',
    category: f.category || 'ACADEMIC FACULTY',
    displayOrder: f.displayOrder || index + 1,
    qualification: f.qualification || '',
    contactNumber: f.contactNumber || f.phone || '',
    phone: f.contactNumber || f.phone || '',
    email: f.email || '',
    photoUrl,
    photo: f.photo || null,
    registrationNumber: f.registrationNumber || f.registrationNo || '',
    registrationNo: f.registrationNumber || f.registrationNo || '',
    joiningDate: f.joiningDate || f.dateOfJoining || '',
    promotionDate: f.promotionDate || '',
    experienceYears: f.experienceYears !== undefined && f.experienceYears !== null ? String(f.experienceYears) : '',
    specialization: f.specialization || '',
    biography: f.biography || f.bio || '',
    status: f.status || 'ACTIVE',
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

// PUBLIC GET /api/v1/faculty - Fetch all academic faculty members
export const handleGetFaculty = async (req: Request, res: Response) => {
  try {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const dbFaculty = await (FacultyModel as any).find({}).sort({ displayOrder: 1 }).lean();
        if (dbFaculty && dbFaculty.length > 0) {
          list = dbFaculty;
        } else {
          list = memoryFacultyStore;
        }
      } catch (dbErr: any) {
        console.warn('[Faculty DB Query Fallback]: Using memory store:', dbErr?.message || dbErr);
        list = memoryFacultyStore;
      }
    } else {
      list = memoryFacultyStore;
    }

    if (!Array.isArray(list)) {
      list = memoryFacultyStore;
    }

    list.sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0));

    const { department, departmentId, search, status } = req.query;
    if (departmentId && departmentId !== 'ALL') {
      list = list.filter((f) => f && f.departmentId === departmentId);
    }
    if (department && department !== 'ALL') {
      list = list.filter((f) => f && f.department === department);
    }
    if (status && status !== 'ALL') {
      list = list.filter((f) => f && (f.status || 'ACTIVE').toUpperCase() === String(status).toUpperCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (f) =>
          f &&
          (f.name?.toLowerCase().includes(q) ||
            f.department?.toLowerCase().includes(q) ||
            f.designation?.toLowerCase().includes(q) ||
            f.empId?.toLowerCase().includes(q) ||
            f.specialization?.toLowerCase().includes(q))
      );
    }

    const formattedList = list.map((f, idx) => formatFacultyOutput(f, idx)).filter(Boolean);

    return res.status(200).json({
      success: true,
      message: 'Faculty directory retrieved successfully',
      data: formattedList,
      total: formattedList.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Faculty Controller] handleGetFaculty error:', err?.message || err);
    const fallbackList = memoryFacultyStore.map((f, idx) => formatFacultyOutput(f, idx)).filter(Boolean);
    return res.status(200).json({
      success: true,
      data: fallbackList,
      message: `Recovered faculty directory gracefully: ${err?.message || err}`,
      timestamp: new Date().toISOString(),
    });
  }
};

// PUBLIC GET /api/v1/faculty/:id - Fetch single faculty member by ID
export const handleGetSingleFaculty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let facultyDoc: any = null;

    if (mongoose.connection.readyState === 1) {
      facultyDoc = await (FacultyModel as any).findOne({
        $or: [
          { id: { $regex: new RegExp(`^${id}$`, 'i') } },
          { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        ],
      }).lean();
    }

    if (!facultyDoc) {
      const q = String(id).toLowerCase().trim();
      facultyDoc = memoryFacultyStore.find(
        (f) =>
          String(f.id).toLowerCase() === q ||
          String(f.empId).toLowerCase() === q ||
          String(f._id).toLowerCase() === q
      );
    }

    if (!facultyDoc) {
      return res.status(404).json({
        success: false,
        message: `Faculty member with ID '${id}' not found.`,
      });
    }

    const output = formatFacultyOutput(facultyDoc, 0);

    return res.status(200).json({
      success: true,
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Faculty Controller] handleGetSingleFaculty error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch faculty member: ${err?.message || err}`,
    });
  }
};

// PROTECTED POST /api/v1/faculty - Create new faculty record
export const handleCreateFaculty = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const {
    name,
    facultyName,
    department,
    departmentName,
    departmentId,
    designation,
    displayOrder,
    status,
    qualification,
    specialization,
    contactNumber,
    phone,
    email,
    registrationNumber,
    registrationNo,
    joiningDate,
    promotionDate,
    experienceYears,
    biography,
    photoUrl,
  } = req.body;

  const finalName = name || facultyName;
  const finalDept = department || departmentName;

  if (!finalName || !String(finalName).trim()) {
    return res.status(400).json({ success: false, message: 'Faculty name is mandatory.' });
  }
  if (!finalDept || !String(finalDept).trim()) {
    return res.status(400).json({ success: false, message: 'Department is mandatory.' });
  }
  if (!designation || !String(designation).trim()) {
    return res.status(400).json({ success: false, message: 'Designation is mandatory.' });
  }

  try {
    const targetOrder = displayOrder ? parseInt(String(displayOrder), 10) : memoryFacultyStore.length + 1;

    memoryFacultyStore.forEach((item) => {
      if (item.displayOrder >= targetOrder) {
        item.displayOrder += 1;
      }
    });

    const normStatus = String(status || 'ACTIVE').trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const newId = `fac-${Date.now()}`;
    const newFaculty: any = {
      id: newId,
      slNo: targetOrder,
      empId: `BHMC-T-${String(targetOrder).padStart(3, '0')}`,
      name: finalName.trim(),
      department: finalDept.trim(),
      departmentId: departmentId || 'org',
      designation: designation.trim(),
      category: 'ACADEMIC FACULTY',
      displayOrder: targetOrder,
      qualification: qualification || '',
      specialization: specialization || '',
      contactNumber: contactNumber || phone || '',
      phone: contactNumber || phone || '',
      email: email || '',
      registrationNumber: registrationNumber || registrationNo || '',
      joiningDate: joiningDate || '',
      promotionDate: promotionDate || '',
      experienceYears: experienceYears !== undefined ? String(experienceYears) : '',
      biography: biography || '',
      photoUrl: photoUrl || '',
      status: normStatus,
    };

    memoryFacultyStore.push(newFaculty);
    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (FacultyModel as any).create(newFaculty);
    }

    const createdIndex = memoryFacultyStore.findIndex((f) => f.id === newId);
    const output = formatFacultyOutput(newFaculty, createdIndex >= 0 ? createdIndex : 0);

    return res.status(201).json({
      success: true,
      message: 'Faculty member record created successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Faculty Controller] handleCreateFaculty error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to create faculty record: ${err?.message || err}`,
    });
  }
};

// PROTECTED PUT/PATCH /api/v1/faculty/:id - Update existing faculty record
export const handleUpdateFaculty = async (req: Request, res: Response) => {
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
    let facIdx = memoryFacultyStore.findIndex(
      (f) =>
        String(f.id).toLowerCase() === q ||
        String(f.empId).toLowerCase() === q ||
        String(f._id).toLowerCase() === q
    );

    if (facIdx === -1) {
      if (mongoose.connection.readyState === 1) {
        const dbDoc = await (FacultyModel as any).findOne({
          $or: [
            { id: id },
            { id: { $regex: new RegExp(`^${id}$`, 'i') } },
            { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          ],
        }).lean();
        if (!dbDoc) {
          return res.status(404).json({ success: false, message: `Faculty record with ID '${id}' not found.` });
        }
      } else {
        return res.status(404).json({ success: false, message: `Faculty record with ID '${id}' not found.` });
      }
    }

    if (updates.status !== undefined) {
      updates.status = String(updates.status).trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    if (facIdx !== -1) {
      const current = memoryFacultyStore[facIdx];
      memoryFacultyStore[facIdx] = {
        ...current,
        ...updates,
        name: updates.name ? updates.name.trim() : (updates.facultyName ? updates.facultyName.trim() : current.name),
        department: updates.department ? updates.department.trim() : (updates.departmentName ? updates.departmentName.trim() : current.department),
        designation: updates.designation ? updates.designation.trim() : current.designation,
      };
    }

    if (mongoose.connection.readyState === 1) {
      await (FacultyModel as any).updateOne(
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

    const updatedDoc = memoryFacultyStore.find((f) => String(f.id).toLowerCase() === q || String(f.empId).toLowerCase() === q) || updates;
    const output = formatFacultyOutput(updatedDoc, facIdx >= 0 ? facIdx : 0);

    return res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully.',
      data: output,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Faculty Controller] handleUpdateFaculty error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to update faculty member: ${err?.message || err}`,
    });
  }
};

// PROTECTED POST /api/v1/faculty/:id/photo - Upload photo for a faculty member
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
      console.warn('[Faculty Photo Drive Upload Notice]:', driveErr?.message || driveErr);
    }

    const photoMeta = {
      driveFileId: driveRes?.id || `local-${Date.now()}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
    const photoUrl = driveRes?.webContentLink || driveRes?.webViewLink || '';

    const updates = { photo: photoMeta, photoUrl };

    if (mongoose.connection.readyState === 1) {
      await (FacultyModel as any).updateOne(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updates }
      );
    }

    const idx = memoryFacultyStore.findIndex((f) => f.id === id);
    if (idx !== -1) {
      memoryFacultyStore[idx].photo = photoMeta;
      memoryFacultyStore[idx].photoUrl = photoUrl;
    }

    return res.status(200).json({
      success: true,
      message: 'Faculty photo uploaded successfully.',
      data: { id, photo: photoMeta, photoUrl },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Photo upload failed.' });
  }
};

// PUBLIC GET /api/v1/faculty/:id/photo - Stream faculty photo
export const handleGetFacultyPhoto = async (req: Request, res: Response) => {
  const id = req.params.facultyId || req.params.id;
  try {
    let facultyDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      facultyDoc = await (FacultyModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      }).lean();
    }
    if (!facultyDoc) {
      facultyDoc = memoryFacultyStore.find((f) => f.id === id);
    }

    const driveFileId = facultyDoc?.photo?.driveFileId;
    if (driveFileId) {
      try {
        const stream = await googleDriveService.getFileStream(driveFileId);
        res.setHeader('Content-Type', facultyDoc.photo.mimeType || 'image/jpeg');
        return stream.pipe(res);
      } catch (err: any) {
        console.warn(`[Faculty Photo Stream Notice]:`, err?.message || err);
      }
    }

    if (facultyDoc?.photoUrl && facultyDoc.photoUrl.startsWith('http')) {
      return res.redirect(facultyDoc.photoUrl);
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

// PROTECTED DELETE /api/v1/faculty/:id/photo - Delete photo
export const handleDeleteFacultyPhoto = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const id = req.params.facultyId || req.params.id;

  try {
    let facultyDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      facultyDoc = await (FacultyModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!facultyDoc) {
      facultyDoc = memoryFacultyStore.find((f) => f.id === id);
    }
    if (!facultyDoc) {
      return res.status(404).json({ success: false, message: `Faculty record with ID '${id}' not found.` });
    }

    const driveFileId = facultyDoc.photo?.driveFileId;
    if (driveFileId) {
      try {
        await googleDriveService.deleteFile(driveFileId);
      } catch (delErr: any) {
        console.warn('[Faculty Photo Delete Notice]:', delErr?.message || delErr);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await (FacultyModel as any).updateOne(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $unset: { photo: 1 }, $set: { photoUrl: '' } }
      );
    }
    const memIdx = memoryFacultyStore.findIndex((f) => f.id === id);
    if (memIdx !== -1) {
      memoryFacultyStore[memIdx].photo = null;
      memoryFacultyStore[memIdx].photoUrl = '';
    }

    return res.status(200).json({
      success: true,
      message: 'Faculty photo deleted successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: `Failed to delete photo: ${err?.message || err}` });
  }
};

// PROTECTED DELETE /api/v1/faculty/:id - Delete faculty record
export const handleDeleteFaculty = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;

  try {
    let targetDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      targetDoc = await (FacultyModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }
    if (!targetDoc) {
      targetDoc = memoryFacultyStore.find((f) => f.id === id);
    }

    if (targetDoc?.photo?.driveFileId) {
      try {
        await googleDriveService.deleteFile(targetDoc.photo.driveFileId);
      } catch (e: any) {
        console.warn(`[Faculty Drive Delete Notice]:`, e?.message || e);
      }
    }

    const initialLen = memoryFacultyStore.length;
    memoryFacultyStore = memoryFacultyStore.filter((f) => f.id !== id);

    if (memoryFacultyStore.length === initialLen && mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: `Faculty record with ID '${id}' not found.` });
    }

    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (FacultyModel as any).deleteOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Faculty member record deleted successfully.',
      data: { id },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Faculty Delete Error]:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: `Failed to delete faculty member: ${err?.message || err}`,
    });
  }
};
