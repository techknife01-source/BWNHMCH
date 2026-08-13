import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StaffModel, SEED_STAFF, IStaff } from './staffModel';

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
      const count = await (StaffModel as any).countDocuments();
      if (count === 0) {
        console.log('[Staff DB] Seeding initial 44 staff records into MongoDB...');
        await (StaffModel as any).insertMany(SEED_STAFF);
      } else {
        // Ensure Prof. (Dr.) Pronab Bhattacharjee is present at displayOrder 2
        const pronab = await (StaffModel as any).findOne({
          name: { $regex: /Pronab Bhattacharjee/i },
        });

        if (!pronab) {
          console.log('[Staff DB] Adding Prof. (Dr.) Pronab Bhattacharjee at displayOrder 2...');
          // Shift existing records with displayOrder >= 2 up by 1
          await (StaffModel as any).updateMany(
            { displayOrder: { $gte: 2 } },
            { $inc: { displayOrder: 1, slNo: 1 } }
          );

          const pronabDoc = {
            id: 'hs-002-v',
            slNo: 2,
            empId: 'SL-02',
            name: 'Prof. (Dr.) Pronab Bhattacharjee',
            roleCategory: 'MEDICAL_STAFF',
            department: 'ADMINISTRATION / ACADEMIC SECTION',
            designation: 'VICE PRINCIPAL / ACADEMIC IN-CHARGE',
            category: 'MEDICAL STAFF',
            displayOrder: 2,
            status: 'ACTIVE',
          };
          await (StaffModel as any).create(pronabDoc);
        } else {
          // Normalize fields if already present
          pronab.department = 'ADMINISTRATION / ACADEMIC SECTION';
          pronab.designation = 'VICE PRINCIPAL / ACADEMIC IN-CHARGE';
          pronab.category = 'MEDICAL STAFF';
          pronab.roleCategory = 'MEDICAL_STAFF';
          await pronab.save();
        }
      }

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

  // Ensure initial memory store is properly ordered and indexed
  await reindexDisplayOrders();
}

// Format staff output for REST API
function formatStaffOutput(s: any, index: number) {
  return {
    id: s.id || s._id?.toString(),
    slNo: index + 1,
    empId: s.empId || `SL-${String(index + 1).padStart(2, '0')}`,
    name: s.name,
    roleCategory: s.roleCategory || 'OFFICE_STAFF',
    department: s.department,
    designation: s.designation,
    category: s.category || 'STAFF',
    displayOrder: s.displayOrder || index + 1,
    qualification: s.qualification || '',
    contactNumber: s.contactNumber || '',
    email: s.email || '',
    photoUrl: s.photoUrl || '',
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
      const dbStaff = await (StaffModel as any).find({}).sort({ displayOrder: 1 }).lean();
      if (dbStaff && dbStaff.length > 0) {
        list = dbStaff;
      } else {
        list = memoryStaffStore;
      }
    } else {
      list = memoryStaffStore;
    }

    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const { category, department, roleCategory, search, status } = req.query;
    if (category && category !== 'ALL') {
      list = list.filter((s) => s.category?.toUpperCase() === String(category).toUpperCase());
    }
    if (roleCategory && roleCategory !== 'ALL') {
      list = list.filter((s) => s.roleCategory === roleCategory);
    }
    if (department && department !== 'ALL') {
      list = list.filter((s) => s.department === department);
    }
    if (status && status !== 'ALL') {
      list = list.filter((s) => s.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.department?.toLowerCase().includes(q) ||
          s.designation?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    const formattedList = list.map((s, idx) => formatStaffOutput(s, idx));

    res.status(200).json({
      success: true,
      data: formattedList,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleGetStaff error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to fetch staff directory: ${err?.message || err}`,
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

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Staff name is mandatory.' });
  }
  if (!department || !department.trim()) {
    return res.status(400).json({ success: false, message: 'Department is mandatory.' });
  }
  if (!designation || !designation.trim()) {
    return res.status(400).json({ success: false, message: 'Designation is mandatory.' });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ success: false, message: 'Category is mandatory.' });
  }

  try {
    const targetOrder = displayOrder ? parseInt(String(displayOrder), 10) : memoryStaffStore.length + 1;

    // Shift memory store items if inserted at specific displayOrder
    memoryStaffStore.forEach((item) => {
      if (item.displayOrder >= targetOrder) {
        item.displayOrder += 1;
      }
    });

    const newId = `hs-${Date.now()}`;
    const newStaff: any = {
      id: newId,
      slNo: targetOrder,
      empId: `SL-${String(targetOrder).padStart(2, '0')}`,
      name: name.trim(),
      department: department.trim(),
      designation: designation.trim(),
      category: category.trim(),
      roleCategory: roleCategory || 'OFFICE_STAFF',
      displayOrder: targetOrder,
      qualification: qualification || '',
      contactNumber: contactNumber || '',
      email: email || '',
      photoUrl: photoUrl || '',
      availability: availability || 'AVAILABLE',
      status: status || 'ACTIVE',
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
    let staffIdx = memoryStaffStore.findIndex((s) => s.id === id);
    if (staffIdx === -1) {
      if (mongoose.connection.readyState === 1) {
        const dbDoc = await (StaffModel as any).findOne({ id });
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

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).updateOne({ id }, { $set: updates });
    }

    const updatedIndex = memoryStaffStore.findIndex((s) => s.id === id);
    const output = formatStaffOutput(
      memoryStaffStore[updatedIndex] || { id, ...updates },
      updatedIndex >= 0 ? updatedIndex : 0
    );

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

// PROTECTED DELETE /api/v1/staff/:id - Requires Admin Authorization
export const handleDeleteStaff = async (req: Request, res: Response) => {
  if (!checkAdminAuthHeader(req)) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Admin authorization token missing or invalid.',
    });
  }

  const { id } = req.params;

  try {
    const initialLen = memoryStaffStore.length;
    memoryStaffStore = memoryStaffStore.filter((s) => s.id !== id);

    if (memoryStaffStore.length === initialLen && mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: `Staff record with ID '${id}' not found.` });
    }

    await reindexDisplayOrders();

    if (mongoose.connection.readyState === 1) {
      await (StaffModel as any).deleteOne({ id });
    }

    res.status(200).json({
      success: true,
      message: 'Staff member record deleted successfully.',
      data: { id },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Staff Controller] handleDeleteStaff error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to delete staff record: ${err?.message || err}`,
    });
  }
};
