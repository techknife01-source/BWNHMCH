import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GalleryModel, IGalleryItem } from './galleryModel';
import { googleDriveService } from './googleDriveService';

// Initial gallery items array (Empty by default for production Google Drive backing)
const INITIAL_GALLERY_SEED: any[] = [];

let memoryGalleryStore: any[] = [];

export async function initGalleryDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      // Purge obsolete Unsplash mock records that do not contain a valid Google Drive file ID
      await GalleryModel.deleteMany({
        $or: [
          { id: { $in: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'] } },
          { imageUrl: { $regex: /unsplash\.com/i } },
          { 'image.driveFileId': { $exists: false } },
          { 'image.driveFileId': '' },
          { 'image.driveFileId': null },
        ],
      });

      const dbGallery = await (GalleryModel as any).find({}).sort({ displayOrder: 1 }).lean();
      if (dbGallery) {
        memoryGalleryStore = dbGallery.map((g: any) => ({
          ...g,
          id: g.id || g._id.toString(),
        }));
      }
    }
  } catch (err: any) {
    console.warn('[Gallery DB Sync Notice]: Using memory store:', err?.message || err);
  }
}

// Helper to format gallery output URL
function formatGalleryOutput(g: any) {
  if (!g) return null;
  const galId = g.id || g._id?.toString();
  let imageUrl = g.image?.driveFileId
    ? `/api/v1/gallery/${galId}/image?v=${g.image.driveFileId}`
    : (g.imageUrl || '');

  if (imageUrl.startsWith('blob:')) {
    imageUrl = g.image?.driveFileId
      ? `/api/v1/gallery/${galId}/image?v=${g.image.driveFileId}`
      : '';
  }

  return {
    id: galId,
    title: g.title || 'Campus Photograph',
    description: g.description || '',
    category: g.category || 'Hospital & OPD',
    imageUrl,
    uploadDate: g.uploadDate || new Date().toISOString(),
    uploader: g.uploader || 'Authorized Admin',
    status: g.status || 'PUBLISHED',
    displayOrder: g.displayOrder || 1,
    isFeatured: Boolean(g.isFeatured),
    image: g.image || null,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  };
}

// Check authorization header
function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers.authorization;
  return Boolean(authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 10);
}

// GET /api/v1/gallery - Fetch all gallery items
export const handleGetGallery = async (req: Request, res: Response) => {
  try {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const dbItems = await (GalleryModel as any).find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
        if (dbItems && dbItems.length > 0) {
          list = dbItems;
        } else {
          list = memoryGalleryStore;
        }
      } catch (dbErr: any) {
        list = memoryGalleryStore;
      }
    } else {
      list = memoryGalleryStore;
    }

    const { category, search, status } = req.query;
    if (category && category !== 'All' && category !== 'ALL') {
      list = list.filter((i) => i && i.category === category);
    }
    if (status && status !== 'ALL') {
      list = list.filter((i) => i && i.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (i) =>
          i &&
          (i.title?.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q) ||
            i.category?.toLowerCase().includes(q) ||
            i.uploader?.toLowerCase().includes(q))
      );
    }

    const formattedList = list.map((g) => formatGalleryOutput(g)).filter(Boolean);

    return res.status(200).json({
      success: true,
      data: formattedList,
      total: formattedList.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Gallery Controller] handleGetGallery error:', err?.message || err);
    const fallback = memoryGalleryStore.map((g) => formatGalleryOutput(g)).filter(Boolean);
    return res.status(200).json({
      success: true,
      data: fallback,
      total: fallback.length,
      timestamp: new Date().toISOString(),
    });
  }
};

// GET /api/v1/gallery/:id - Fetch single gallery item
export const handleGetGalleryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let item: any = null;
    if (mongoose.connection.readyState === 1) {
      item = await (GalleryModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      }).lean();
    }
    if (!item) {
      item = memoryGalleryStore.find((g) => g.id === id);
    }
    if (!item) {
      return res.status(404).json({ success: false, message: `Gallery item '${id}' not found.` });
    }
    return res.status(200).json({ success: true, data: formatGalleryOutput(item) });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: `Error fetching gallery item: ${err?.message || err}` });
  }
};

// POST /api/v1/gallery - Create gallery metadata
export const handleCreateGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const { items, title, imageUrl, category, description, uploader, status } = req.body;
    const itemsToAdd = Array.isArray(items) ? items : [{ title, imageUrl, category, description, uploader, status }];
    const createdItems: any[] = [];

    for (let idx = 0; idx < itemsToAdd.length; idx++) {
      const item = itemsToAdd[idx];
      if (!item.title && !item.imageUrl) continue;

      const newId = `gal-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      let cleanUrl = item.imageUrl || '';
      if (cleanUrl.startsWith('blob:')) cleanUrl = '';

      const docPayload = {
        id: newId,
        title: item.title || 'Campus Photograph',
        description: item.description || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL campus photograph.',
        category: item.category || 'Hospital & OPD',
        imageUrl: cleanUrl,
        uploadDate: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        uploader: item.uploader || uploader || 'Authorized Admin',
        status: item.status || 'PUBLISHED',
        displayOrder: (memoryGalleryStore.length || 0) + idx + 1,
        isFeatured: item.isFeatured ?? false,
        image: item.image || null,
      };

      if (mongoose.connection.readyState === 1) {
        const created = await GalleryModel.create(docPayload);
        createdItems.push(formatGalleryOutput(created.toObject()));
      } else {
        memoryGalleryStore.unshift(docPayload);
        createdItems.push(formatGalleryOutput(docPayload));
      }
    }

    return res.status(201).json({
      success: true,
      data: createdItems.length === 1 ? createdItems[0] : createdItems,
      message: `${createdItems.length} gallery item(s) published successfully.`,
    });
  } catch (err: any) {
    console.error('[Gallery Controller] handleCreateGallery error:', err?.message || err);
    return res.status(500).json({ success: false, message: `Failed to create gallery item: ${err?.message || err}` });
  }
};

// POST /api/v1/gallery/upload OR /api/v1/gallery/:id/image - Upload image to Google Drive & save MongoDB metadata
export const handleUploadGalleryImage = async (req: Request, res: Response) => {
  console.log('[GALLERY UPLOAD] START');
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required. Admin authorization token missing or invalid.' });
  }

  const file = req.file || (req.files && Array.isArray(req.files) ? (req.files as Express.Multer.File[])[0] : null);
  if (!file) {
    console.log('[GALLERY UPLOAD] ERROR: No image file uploaded.');
    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  }

  console.log(`[GALLERY UPLOAD] FILE: ${file.originalname}`);
  console.log(`[GALLERY UPLOAD] MIME: ${file.mimetype}`);
  console.log(`[GALLERY UPLOAD] SIZE: ${file.size}`);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ success: false, message: `Invalid image type '${file.mimetype}'. Allowed: JPEG, PNG, WEBP, GIF, SVG` });
  }

  if (file.size > 15 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: 'Image size exceeds maximum limit of 15MB.' });
  }

  const galleryId = req.params.id || req.params.galleryId || `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const title = req.body.title || file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Campus Gallery Photo';
  const description = req.body.description || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL campus photograph.';
  const category = req.body.category || 'Hospital & OPD';
  const uploader = req.body.uploader || 'Authorized Admin';
  const status = req.body.status || 'PUBLISHED';
  const displayOrder = parseInt(req.body.displayOrder) || (memoryGalleryStore.length + 1);
  const isFeatured = req.body.isFeatured === true || req.body.isFeatured === 'true';

  try {
    console.log('[GALLERY UPLOAD] DRIVE UPLOAD START');
    const cleanFileName = `gallery-${galleryId}-${Date.now()}.${file.mimetype.split('/')[1] || 'jpg'}`;
    const driveRes = await googleDriveService.uploadPdf(file.buffer, cleanFileName, file.mimetype);

    if (!driveRes || !driveRes.fileId) {
      console.log(`[GALLERY UPLOAD] DRIVE ERROR: ${driveRes?.error || 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        message: 'Gallery photo upload failed',
        error: driveRes?.error || 'Google Drive service returned null fileId',
      });
    }

    const driveFileId = driveRes.fileId;
    console.log(`[GALLERY UPLOAD] DRIVE FILE ID: ${driveFileId}`);

    const imageMetadata = {
      driveFileId,
      fileName: cleanFileName,
      mimeType: file.mimetype,
    };
    const imageUrl = `/api/v1/gallery/${galleryId}/image?v=${driveFileId}`;

    console.log('[GALLERY UPLOAD] MONGODB SAVE START');
    let savedItem: any = null;
    const itemData = {
      id: galleryId,
      title,
      description,
      category,
      imageUrl,
      image: imageMetadata,
      uploadDate: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      uploader,
      status,
      displayOrder,
      isFeatured,
    };

    if (mongoose.connection.readyState === 1) {
      let existing = await (GalleryModel as any).findOne({
        $or: [{ id: galleryId }, { _id: mongoose.Types.ObjectId.isValid(galleryId) ? galleryId : null }],
      });

      if (existing) {
        existing.image = imageMetadata;
        existing.imageUrl = imageUrl;
        if (req.body.title) existing.title = title;
        if (req.body.description) existing.description = description;
        if (req.body.category) existing.category = category;
        if (req.body.status) existing.status = status;
        if (req.body.displayOrder) existing.displayOrder = displayOrder;
        if (req.body.isFeatured !== undefined) existing.isFeatured = isFeatured;
        savedItem = await existing.save();
      } else {
        const docToCreate: any = { ...itemData };
        if (mongoose.Types.ObjectId.isValid(galleryId)) {
          docToCreate._id = galleryId;
        }
        savedItem = await (GalleryModel as any).create(docToCreate);
      }
      console.log('[GALLERY UPLOAD] MONGODB SAVE SUCCESS');
    }

    const idx = memoryGalleryStore.findIndex((g) => g.id === galleryId);
    if (idx !== -1) {
      memoryGalleryStore[idx] = { ...memoryGalleryStore[idx], ...itemData };
      if (!savedItem) savedItem = memoryGalleryStore[idx];
    } else {
      memoryGalleryStore.unshift(itemData);
      if (!savedItem) savedItem = itemData;
    }
    console.log('[GALLERY UPLOAD] MEMORY STORE SYNCED');

    console.log('[GALLERY UPLOAD] COMPLETE');
    const output = formatGalleryOutput(savedItem?.toObject ? savedItem.toObject() : savedItem);

    return res.status(200).json({
      success: true,
      data: output,
      url: imageUrl,
      fileName: cleanFileName,
      fileSize: file.size,
      message: 'Gallery image uploaded to Google Drive & saved to MongoDB Atlas successfully.',
    });
  } catch (err: any) {
    console.error('[GALLERY UPLOAD] DRIVE ERROR:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: 'Gallery photo upload failed',
      error: err?.message || String(err),
    });
  }
};

// GET /api/v1/gallery/:id/image (Public streaming endpoint)
export const handleStreamGalleryImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`[GALLERY IMAGE] galleryId=${id}`);
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');

  try {
    let driveFileId: string | null = null;
    let mimeType = 'image/jpeg';
    let fileName = '';

    if (mongoose.connection.readyState === 1) {
      const qv = req.query.v as string;
      const item = await (GalleryModel as any).findOne({
        $or: [
          { id },
          { customId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          { imageUrl: { $regex: id } },
          { 'image.driveFileId': qv },
          { 'image.driveFileId': id },
        ].filter(Boolean),
      }).lean();
      if (item && item.image?.driveFileId) {
        driveFileId = item.image.driveFileId;
        mimeType = item.image.mimeType || 'image/jpeg';
        fileName = item.image.fileName || '';
      }
    }

    if (!driveFileId) {
      const memItem = memoryGalleryStore.find((g) => g.id === id);
      if (memItem && memItem.image?.driveFileId) {
        driveFileId = memItem.image.driveFileId;
        mimeType = memItem.image.mimeType || 'image/jpeg';
        fileName = memItem.image.fileName || '';
      }
    }

    if (!driveFileId) {
      // Check query param fallback
      const qDriveId = req.query.v as string;
      if (qDriveId && qDriveId.length > 10) {
        driveFileId = qDriveId;
      }
    }

    if (!driveFileId) {
      console.log(`[GALLERY IMAGE 404] No Google Drive image attached to gallery ID '${id}'.`);
      return res.status(404).json({ success: false, message: `No Google Drive image attached to gallery ID '${id}'.` });
    }

    console.log(`[GALLERY IMAGE] driveFileId=${driveFileId}, mimeType=${mimeType}`);
    const driveStreamObj = await googleDriveService.getPdfStream(driveFileId, req.headers.range);
    if (!driveStreamObj || !driveStreamObj.stream) {
      console.warn(`[GALLERY IMAGE 404] File ${driveFileId} not found in Google Drive.`);
      return res.status(404).json({ success: false, message: `Image file '${driveFileId}' not found in Google Drive.` });
    }

    const finalMime = driveStreamObj.mimeType || mimeType;
    res.setHeader('Content-Type', finalMime);
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    if (driveStreamObj.size) {
      res.setHeader('Content-Length', driveStreamObj.size.toString());
    }
    if (fileName || driveStreamObj.name) {
      res.setHeader('Content-Disposition', `inline; filename="${fileName || driveStreamObj.name}"`);
    }

    return driveStreamObj.stream.pipe(res);
  } catch (err: any) {
    console.error(`[GALLERY IMAGE ERROR] Exception streaming image '${id}':`, err?.message || err);
    return res.status(404).json({ success: false, message: `Failed to stream image: ${err?.message || err}` });
  }
};

// PUT /api/v1/gallery/:id - Update gallery metadata
export const handleUpdateGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const { id } = req.params;
  try {
    let updatedItem: any = null;
    if (mongoose.connection.readyState === 1) {
      updatedItem = await (GalleryModel as any).findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: req.body },
        { returnDocument: 'after', new: true }
      ).lean();
    }

    if (!updatedItem) {
      const idx = memoryGalleryStore.findIndex((g) => g.id === id);
      if (idx !== -1) {
        memoryGalleryStore[idx] = { ...memoryGalleryStore[idx], ...req.body };
        updatedItem = memoryGalleryStore[idx];
      }
    }

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: `Gallery item '${id}' not found.` });
    }

    return res.status(200).json({
      success: true,
      data: formatGalleryOutput(updatedItem),
      message: 'Gallery item metadata updated successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: `Failed to update gallery item: ${err?.message || err}` });
  }
};

// DELETE /api/v1/gallery/:id/image - Delete photo binary from Google Drive & clear image metadata from MongoDB
export const handleDeleteGalleryImage = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const { id } = req.params;
  console.log(`[GALLERY PHOTO DELETE] Mongo gallery ID = ${id}`);
  try {
    let driveFileId: string | null = null;

    if (mongoose.connection.readyState === 1) {
      const item = await (GalleryModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
      if (item) {
        driveFileId = item.image?.driveFileId || null;
        console.log(`[GALLERY PHOTO DELETE] Google Drive file ID = ${driveFileId || 'NONE'}`);
        await (GalleryModel as any).updateOne(
          { _id: item._id },
          { $set: { imageUrl: '' }, $unset: { image: 1 } }
        );
        console.log(`[GALLERY PHOTO DELETE] MongoDB image metadata cleared`);
      }
    }

    const memIdx = memoryGalleryStore.findIndex((g) => g.id === id);
    if (memIdx !== -1) {
      if (!driveFileId) driveFileId = memoryGalleryStore[memIdx].image?.driveFileId || null;
      memoryGalleryStore[memIdx].image = null;
      memoryGalleryStore[memIdx].imageUrl = '';
    }

    if (driveFileId) {
      console.log(`[GALLERY PHOTO DELETE] Deleting Google Drive file '${driveFileId}'...`);
      try {
        await googleDriveService.deleteFile(driveFileId);
        console.log(`[GALLERY PHOTO DELETE] Google Drive file deleted successfully`);
      } catch (delErr: any) {
        console.warn(`[GALLERY PHOTO DELETE] Drive notice:`, delErr?.message || delErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Photo for gallery item '${id}' deleted successfully from Google Drive & MongoDB Atlas.`,
    });
  } catch (err: any) {
    console.error(`[GALLERY PHOTO DELETE] Error:`, err?.message || err);
    return res.status(500).json({ success: false, message: `Failed to delete gallery image: ${err?.message || err}` });
  }
};

// DELETE /api/v1/gallery/:id - Delete gallery document & Google Drive image
export const handleDeleteGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const { id } = req.params;
  console.log(`[GALLERY DELETE] Mongo gallery ID = ${id}`);
  try {
    let driveFileId: string | null = null;

    if (mongoose.connection.readyState === 1) {
      const item = await (GalleryModel as any).findOne({
        $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
      if (item) {
        driveFileId = item.image?.driveFileId || null;
        console.log(`[GALLERY DELETE] Google Drive file ID = ${driveFileId || 'NONE'}`);
        console.log(`[GALLERY DELETE] Deleting MongoDB record...`);
        await (GalleryModel as any).deleteOne({ _id: item._id });
        console.log(`[GALLERY DELETE] MongoDB deletion successful`);
      }
    }

    const memIdx = memoryGalleryStore.findIndex((g) => g.id === id);
    if (memIdx !== -1) {
      if (!driveFileId) driveFileId = memoryGalleryStore[memIdx].image?.driveFileId || null;
      memoryGalleryStore.splice(memIdx, 1);
    }

    if (driveFileId) {
      console.log(`[GALLERY DELETE] Deleting Google Drive file...`);
      await googleDriveService.deleteFile(driveFileId);
      console.log(`[GALLERY DELETE] Google Drive deletion successful`);
    }

    return res.status(200).json({
      success: true,
      message: `Gallery photo ID '${id}' deleted successfully from MongoDB Atlas & Google Drive.`,
    });
  } catch (err: any) {
    console.error(`[GALLERY DELETE] Error deleting photo '${id}':`, err?.message || err);
    return res.status(500).json({ success: false, message: `Failed to delete gallery item: ${err?.message || err}` });
  }
};

// Bulk action handlers
export const handleBulkDeleteGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'No gallery item IDs provided.' });
  }

  for (const id of ids) {
    if (mongoose.connection.readyState === 1) {
      const item = await (GalleryModel as any).findOne({ $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] });
      if (item) {
        if (item.image?.driveFileId) await googleDriveService.deleteFile(item.image.driveFileId);
        await (GalleryModel as any).deleteOne({ _id: item._id });
      }
    }
    const idx = memoryGalleryStore.findIndex((g) => g.id === id);
    if (idx !== -1) {
      if (memoryGalleryStore[idx].image?.driveFileId) await googleDriveService.deleteFile(memoryGalleryStore[idx].image.driveFileId);
      memoryGalleryStore.splice(idx, 1);
    }
  }

  return res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} gallery item(s).` });
};

export const handleBulkCategoryGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const { ids, category } = req.body;
  if (!Array.isArray(ids) || !category) {
    return res.status(400).json({ success: false, message: 'IDs and category are required.' });
  }
  if (mongoose.connection.readyState === 1) {
    await (GalleryModel as any).updateMany({ id: { $in: ids } }, { $set: { category } });
  }
  memoryGalleryStore.forEach((g) => {
    if (ids.includes(g.id)) g.category = category;
  });
  return res.status(200).json({ success: true, message: `Updated category for ${ids.length} gallery item(s).` });
};

export const handleBulkStatusGallery = async (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || !status) {
    return res.status(400).json({ success: false, message: 'IDs and status are required.' });
  }
  if (mongoose.connection.readyState === 1) {
    await (GalleryModel as any).updateMany({ id: { $in: ids } }, { $set: { status } });
  }
  memoryGalleryStore.forEach((g) => {
    if (ids.includes(g.id)) g.status = status;
  });
  return res.status(200).json({ success: true, message: `Updated status for ${ids.length} gallery item(s).` });
};
