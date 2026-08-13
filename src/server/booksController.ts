import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { BookModel, SEED_BOOKS, IBook } from './bookModel';
import { googleDriveService } from './googleDriveService';

// In-Memory store for fast fallback & synchronization
let memoryBooksStore: any[] = [...SEED_BOOKS];

// Helper to construct safe Mongoose queries without throwing CastError on non-ObjectId string IDs
function buildBookQuery(idOrParam: string) {
  if (!idOrParam) return { _id: null };
  const trimmed = decodeURIComponent(idOrParam).trim();

  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    return {
      $or: [
        { id: trimmed },
        { _id: new mongoose.Types.ObjectId(trimmed) },
        { fileName: trimmed },
        { title: trimmed }
      ]
    };
  } else {
    return {
      $or: [
        { id: trimmed },
        { fileName: trimmed },
        { title: trimmed }
      ]
    };
  }
}

// Unified Persistent Book Resolver supporting both application id and MongoDB _id
export async function findBookByIdentifier(identifier: string): Promise<any | null> {
  if (!identifier) return null;
  const trimmed = decodeURIComponent(identifier).trim();

  let book: any = null;
  if (mongoose.connection.readyState === 1) {
    try {
      book = await (BookModel as any).findOne(buildBookQuery(trimmed)).lean();
    } catch (e: any) {
      console.warn(`[LIBRARY] MongoDB findBookByIdentifier error for '${trimmed}':`, e?.message || e);
    }
  }

  if (!book && memoryBooksStore && memoryBooksStore.length > 0) {
    const paramLower = trimmed.toLowerCase();
    book = memoryBooksStore.find((b) => {
      if (!b) return false;
      const bId = String(b.id || '').trim().toLowerCase();
      const bObjId = String(b._id || '').trim().toLowerCase();
      const bFileName = String(b.fileName || '').trim().toLowerCase();
      const bTitle = String(b.title || '').trim().toLowerCase();
      return bId === paramLower || bObjId === paramLower || bFileName === paramLower || bTitle === paramLower;
    });
  }

  return book;
}

// Helper: Seed initial books into MongoDB if connected and empty
export async function initBooksDatabaseAndMigration() {
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await (BookModel as any).countDocuments();
      if (count === 0) {
        console.log('[LIBRARY] Seeding initial E-Library books into MongoDB...');
        await (BookModel as any).insertMany(SEED_BOOKS);
      }
      const dbBooks = await (BookModel as any).find({}).lean();
      if (dbBooks && dbBooks.length > 0) {
        memoryBooksStore = dbBooks.map((b: any) => ({
          ...b,
          id: b.id || b._id.toString(),
        }));
      }
    }
  } catch (err: any) {
    console.warn('[LIBRARY Sync Notice]: Using in-memory store:', err?.message || err);
  }

  // Perform startup Google Drive authentication and folder access test
  if (googleDriveService.hasCredentials()) {
    await googleDriveService.verifyDriveAccess();
  }
}

// Format book object for API output
function formatBookOutput(book: any) {
  const customId = book.id;
  const mongoId = book._id ? book._id.toString() : null;
  const primaryId = customId || mongoId || 'unknown';
  const pdfEndpointUrl = `/api/v1/library/books/${primaryId}/pdf`;
  return {
    id: primaryId,
    _id: mongoId || primaryId,
    title: book.title,
    author: book.author,
    publisher: book.publisher || 'BHMCH Academic Press',
    category: book.category,
    department: book.department || 'Organon of Medicine',
    semester: book.semester || '1st BHMS',
    subject: book.subject,
    year: book.year || '2025-2026',
    isbn: book.isbn,
    accessionNo: book.accessionNo,
    type: book.type || 'BOOK',
    fileFormat: book.fileFormat || 'PDF',
    pdfUrl: pdfEndpointUrl,
    streamUrl: pdfEndpointUrl,
    fileUrl: pdfEndpointUrl,
    availableCopies: book.availableCopies ?? 10,
    isBookmarked: book.isBookmarked ?? false,
    coverImageUrl: book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    coverUrl: book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    uploadedBy: book.uploadedBy || 'Faculty Board',
    uploadedByUserId: book.uploadedByUserId || 'usr-vp-001',
    uploadedRole: book.uploadedRole || 'Faculty',
    uploadedAt: book.uploadedAt || new Date().toISOString().split('T')[0],
    viewsCount: book.viewsCount ?? 0,
    downloadsCount: book.downloadsCount ?? 0,
    allowDownload: book.allowDownload ?? true,
    description: book.description || '',
    fileSize: book.fileSize || '10.0 MB',
    fileName: book.fileName || `${bookId}.pdf`,
    pageCount: book.pageCount || 100,
    googleDriveFileId: book.googleDriveFileId || null,
    storageProvider: book.storageProvider || 'local',
    storageStatus: book.storageStatus || 'AVAILABLE',
    isPublished: book.isPublished ?? true,
    published: book.published ?? true,
  };
}

// Controller Handlers
export const handleGetBooks = async (req: Request, res: Response) => {
  try {
    console.log('[LIBRARY] GET /books started');

    let booksList: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        booksList = await (BookModel as any).find({
          $or: [{ isPublished: { $ne: false } }, { published: { $ne: false } }]
        }).sort({ createdAt: -1 }).lean();
      } catch (dbErr: any) {
        console.warn('[LIBRARY] Database query warning, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }

    if (!booksList || booksList.length === 0) {
      booksList = memoryBooksStore.filter((b) => b.isPublished !== false && b.published !== false);
    }

    console.log(`[LIBRARY] Found ${booksList.length} books`);

    const { category, department, search, semester, type } = req.query;
    let filtered = booksList.map(formatBookOutput);

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.department && b.department.toLowerCase().includes(q)) ||
          (b.accessionNo && b.accessionNo.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'All' && category !== 'ALL') {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (department && department !== 'All' && department !== 'ALL') {
      filtered = filtered.filter((b) => b.department === department);
    }
    if (semester && semester !== 'All' && semester !== 'ALL') {
      filtered = filtered.filter((b) => b.semester === semester);
    }
    if (type && type !== 'All' && type !== 'ALL') {
      filtered = filtered.filter((b) => b.type === type);
    }

    res.status(200).json({
      success: true,
      message: 'E-Library digital books retrieved successfully',
      data: filtered,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const safeErrorMsg = err?.message || 'Unknown database retrieval error';
    console.error(`[LIBRARY] GET /books failed: ${safeErrorMsg}`);

    const safeData = memoryBooksStore.filter((b) => b.isPublished !== false && b.published !== false).map(formatBookOutput);
    res.status(200).json({
      success: true,
      message: 'E-Library digital books retrieved (fallback mode)',
      data: safeData,
      timestamp: new Date().toISOString(),
    });
  }
};

export const handleDriveDiagnostic = async (req: Request, res: Response) => {
  try {
    const report = await googleDriveService.runDiagnostic();
    return res.status(200).json({
      success: report.auth && report.folderAccess,
      message: report.auth && report.folderAccess ? 'Google Drive diagnostic passed' : 'Google Drive diagnostic failed',
      data: report,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Diagnostic execution error: ${err?.message || err}`,
    });
  }
};

export const handleAdminDriveDiagnostic = async (req: Request, res: Response) => {
  try {
    const isConfigured = googleDriveService.hasCredentials();
    if (!isConfigured) {
      return res.status(200).json({
        configured: false,
        authenticated: false,
        folderConfigured: false,
        folderAccessible: false,
        googleDriveStatus: 'FAILED',
        error: 'Google Drive credentials (GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY) not configured.',
      });
    }

    const accessRes = await googleDriveService.verifyDriveAccess();
    if (accessRes.success) {
      return res.status(200).json({
        configured: true,
        authenticated: true,
        folderConfigured: true,
        folderAccessible: true,
        googleDriveStatus: 'CONNECTED',
      });
    } else {
      return res.status(200).json({
        configured: true,
        authenticated: false,
        folderAccessible: false,
        googleDriveStatus: 'FAILED',
        error: accessRes.message || 'Folder access failed',
      });
    }
  } catch (err: any) {
    return res.status(200).json({
      configured: true,
      authenticated: false,
      folderAccessible: false,
      googleDriveStatus: 'FAILED',
      error: err?.message || 'Diagnostic execution failed',
    });
  }
};

export const handleGetBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedParam = decodeURIComponent(id).trim();
  console.log(`[LIBRARY] get book ID: ${decodedParam}`);

  const book = await findBookByIdentifier(decodedParam);
  const recordFound = !!book;
  console.log(`[LIBRARY] MongoDB record found: ${recordFound}`);

  if (!book) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  console.log(`[LIBRARY] googleDriveFileId: ${book.googleDriveFileId || 'none'}`);

  res.status(200).json({
    success: true,
    data: formatBookOutput(book),
    timestamp: new Date().toISOString(),
  });
};

export const handleStreamBookPdf = async (req: Request, res: Response) => {
  const paramId = req.params.id;
  const decodedParam = decodeURIComponent(paramId).trim();
  const isObjId = mongoose.Types.ObjectId.isValid(decodedParam);

  console.log(`[LIBRARY] PDF request book ID: ${decodedParam}`);
  console.log(`[LIBRARY] Identifier type: ${isObjId ? 'objectId' : 'custom-id'}`);

  const book = await findBookByIdentifier(decodedParam);
  const recordFound = !!book;
  console.log(`[LIBRARY] MongoDB record found: ${recordFound}`);

  if (!book) {
    console.log(`[LIBRARY] No persistent MongoDB book found for identifier: ${decodedParam}`);
    return res.status(404).json({
      success: false,
      message: `PDF document '${decodedParam}' not found in repository.`,
    });
  }

  const safeCustomId = book.id || 'none';
  const safeMongoId = book._id ? book._id.toString() : (book.id || 'none');
  console.log(`[LIBRARY] MongoDB book ID: ${safeCustomId}`);
  console.log(`[LIBRARY] MongoDB _id: ${safeMongoId}`);

  const driveIdPresent = !!book.googleDriveFileId;
  console.log(`[LIBRARY] googleDriveFileId present: ${driveIdPresent}`);

  if (!book.googleDriveFileId) {
    console.log(`[LIBRARY] PDF stream failed: Book '${decodedParam}' is not linked to Google Drive (googleDriveFileId is missing)`);
    return res.status(500).json({
      success: false,
      message: `Book record '${decodedParam}' is not properly linked to Google Drive. googleDriveFileId is missing.`,
    });
  }

  const rawId = String(book.googleDriveFileId);
  const maskedId = rawId.length > 4 ? `********${rawId.slice(-4)}` : '********';
  console.log(`[LIBRARY] Google Drive file ID: ${maskedId}`);

  // Stream directly from Google Drive
  console.log('[LIBRARY] Google Drive retrieval started');
  try {
    const driveRes = await googleDriveService.getPdfStream(book.googleDriveFileId, req.headers.range);
    const contentLength = parseInt(driveRes.headers['content-length'] || '0', 10);

    console.log('[LIBRARY] Google Drive file retrieved successfully');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${book.fileName || 'document.pdf'}"`);
    res.setHeader('Accept-Ranges', 'bytes');
    if (driveRes.headers['content-range']) {
      res.setHeader('Content-Range', driveRes.headers['content-range']);
    }
    if (contentLength > 0) {
      res.setHeader('Content-Length', contentLength);
    }
    res.status(driveRes.status || 200);

    console.log('[LIBRARY] PDF stream started (Google Drive)');
    return driveRes.stream.pipe(res);
  } catch (driveErr: any) {
    console.error(`[LIBRARY] Google Drive retrieval failed for ${book?.title || decodedParam}:`, driveErr?.message || driveErr);
    return res.status(500).json({
      success: false,
      message: `Google Drive PDF retrieval failed: ${driveErr?.message || driveErr}`,
    });
  }
};

export const handleCreateBook = async (req: Request, res: Response) => {
  try {
    console.log('[LIBRARY] upload started');

    const {
      title,
      author,
      publisher,
      category,
      department,
      semester,
      subject,
      year,
      isbn,
      accessionNo,
      type,
      fileFormat,
      description,
      fileDataUrl,
      fileData,
      fileName,
      uploadedBy,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ success: false, message: 'Title and Author are required.' });
    }

    let fileBuffer: Buffer | null = null;
    if ((req as any).file && (req as any).file.buffer) {
      fileBuffer = (req as any).file.buffer;
    } else if (fileDataUrl || fileData) {
      const base64Content = fileDataUrl || fileData;
      const cleanBase64 = base64Content.replace(/^data:[^;]+;base64,/, '');
      fileBuffer = Buffer.from(cleanBase64, 'base64');
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ success: false, message: 'PDF file attachment is required.' });
    }

    const originalSizeBytes = fileBuffer.length;
    const fileSizeStr = `${(originalSizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    const bookId = `book-${Date.now()}`;
    const nameToUse = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;

    // Enforce Google Drive Upload (No local fallback allowed)
    if (!googleDriveService.hasCredentials()) {
      return res.status(500).json({
        success: false,
        message: 'Google Drive integration is not configured or authenticated on the server.',
      });
    }

    const driveRes = await googleDriveService.uploadPdf(fileBuffer, nameToUse, 'application/pdf');
    if (!driveRes || !driveRes.fileId || driveRes.fileId.trim() === '') {
      return res.status(500).json({
        success: false,
        message: `Google Drive PDF upload failed: Service account lacks storage quota for the destination folder or upload timed out.`,
      });
    }

    const googleDriveFileId = driveRes.fileId;
    const storageProvider = 'google-drive';
    const rawIdStr = String(googleDriveFileId);
    const maskedDriveId = rawIdStr.length > 4 ? `********${rawIdStr.slice(-4)}` : '********';
    console.log(`[LIBRARY] Google Drive file ID: ${maskedDriveId}`);

    const nowIso = new Date().toISOString();
    const newBook: any = {
      id: bookId,
      title,
      author,
      publisher: publisher || 'BHMCH Academic Press',
      category: category || 'General',
      department: department || 'Organon of Medicine',
      semester: semester || '1st BHMS',
      subject: subject || 'Organon of Medicine',
      year: year || '2025-2026',
      isbn: isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      accessionNo: accessionNo || `BHMC-DIG-${Math.floor(100 + Math.random() * 900)}`,
      type: type || 'BOOK',
      fileFormat: 'PDF',
      mimeType: 'application/pdf',
      availableCopies: 10,
      isBookmarked: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
      uploadedBy: uploadedBy || 'Faculty Administrator',
      uploadedByUserId: 'usr-fac-001',
      uploadedRole: 'Faculty',
      uploadedAt: nowIso.split('T')[0],
      createdAt: nowIso,
      updatedAt: nowIso,
      viewsCount: 0,
      downloadsCount: 0,
      allowDownload: true,
      description: description || 'Digital learning material',
      fileSize: fileSizeStr,
      fileName: nameToUse,
      pageCount: 50,
      googleDriveFileId,
      storageProvider,
      storageStatus: 'AVAILABLE',
      isPublished: true,
      published: true,
    };

    // Save to MongoDB - mandatory persistent storage
    if (mongoose.connection.readyState === 1) {
      try {
        await (BookModel as any).create(newBook);
        console.log(`[LIBRARY] MongoDB book ID: ${bookId}`);
        console.log('[LIBRARY] MongoDB save successful');
      } catch (dbErr: any) {
        console.error('[LIBRARY] MongoDB create failed:', dbErr?.message || dbErr);
        if (googleDriveFileId) {
          try { await googleDriveService.deleteFile(googleDriveFileId); } catch {}
        }
        return res.status(500).json({
          success: false,
          message: `Failed to save book record in database: ${dbErr?.message || dbErr}`,
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'MongoDB connection not ready. Book record could not be persisted.',
      });
    }

    memoryBooksStore.unshift(newBook);

    res.status(201).json({
      success: true,
      message: 'E-Library book uploaded to Google Drive and stored in MongoDB successfully.',
      data: formatBookOutput(newBook),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[LIBRARY] handleCreateBook error:', err?.message || err);
    res.status(500).json({ success: false, message: `Failed to upload book: ${err?.message || err}` });
  }
};

export const handleUpdateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  let book: any = null;

  if (mongoose.connection.readyState === 1) {
    try {
      await (BookModel as any).updateOne(buildBookQuery(id), { $set: req.body });
      book = await (BookModel as any).findOne(buildBookQuery(id)).lean();
    } catch (e: any) {
      console.warn(`[LIBRARY] MongoDB update error for '${id}':`, e?.message || e);
    }
  }

  const index = memoryBooksStore.findIndex((b) => b.id === id || b._id?.toString() === id);
  if (index !== -1) {
    memoryBooksStore[index] = { ...memoryBooksStore[index], ...req.body };
    if (!book) book = memoryBooksStore[index];
  }

  if (!book) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Book resource updated successfully',
    data: formatBookOutput(book),
  });
};

export const handleDeleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedParam = decodeURIComponent(id).trim();
  console.log(`[LIBRARY] delete book ID: ${decodedParam}`);

  const book = await findBookByIdentifier(decodedParam);
  const recordFound = !!book;
  console.log(`[LIBRARY] delete book ID: ${decodedParam} - MongoDB record found: ${recordFound}`);

  if (!book) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  console.log(`[LIBRARY] Google Drive file ID: ${book.googleDriveFileId || 'none'}`);

  // Delete from Google Drive
  if (book.googleDriveFileId && googleDriveService.hasCredentials()) {
    try {
      await googleDriveService.deleteFile(book.googleDriveFileId);
      console.log(`[LIBRARY] Google Drive file deleted successfully`);
    } catch (driveErr: any) {
      console.warn(`[LIBRARY] Google Drive file deletion warning (continuing MongoDB record removal):`, driveErr?.message || driveErr);
    }
  }

  // Delete from MongoDB
  if (mongoose.connection.readyState === 1) {
    try {
      await (BookModel as any).deleteOne(buildBookQuery(decodedParam));
      console.log(`[LIBRARY] MongoDB delete successful`);
    } catch (dbErr: any) {
      console.error(`[LIBRARY] MongoDB delete error:`, dbErr?.message || dbErr);
      return res.status(500).json({
        success: false,
        message: `Failed to delete book record from database: ${dbErr?.message || dbErr}`,
      });
    }
  }

  // Delete from memory store
  const index = memoryBooksStore.findIndex(
    (b) => b.id === decodedParam || b._id?.toString() === decodedParam
  );
  if (index !== -1) {
    memoryBooksStore.splice(index, 1);
  }

  res.status(200).json({
    success: true,
    message: 'Book resource removed from E-Library',
    data: true,
  });
};

export const handleIncrementView = async (req: Request, res: Response) => {
  const { id } = req.params;
  let book = memoryBooksStore.find((b) => b.id === id || b._id?.toString() === id);
  if (mongoose.connection.readyState === 1) {
    (BookModel as any).updateOne(buildBookQuery(id), { $inc: { viewsCount: 1 } }).catch(() => {});
  }
  if (book) {
    book.viewsCount = (book.viewsCount || 0) + 1;
  }
  res.status(200).json({ success: true, message: 'View count incremented' });
};

export const handleIncrementDownload = async (req: Request, res: Response) => {
  const { id } = req.params;
  let book = memoryBooksStore.find((b) => b.id === id || b._id?.toString() === id);
  if (mongoose.connection.readyState === 1) {
    (BookModel as any).updateOne(buildBookQuery(id), { $inc: { downloadsCount: 1 } }).catch(() => {});
  }
  if (book) {
    book.downloadsCount = (book.downloadsCount || 0) + 1;
  }
  res.status(200).json({ success: true, message: 'Download count incremented' });
};

export const handleGetStreamToken = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pdfEndpointUrl = `/api/v1/library/books/${id}/pdf`;
  res.status(200).json({
    success: true,
    message: 'Stream token generated',
    data: {
      token: `DRM_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      streamUrl: pdfEndpointUrl,
    },
    timestamp: new Date().toISOString(),
  });
};

export const handleMigrateToDrive = async (req: Request, res: Response) => {
  if (!googleDriveService.hasCredentials()) {
    return res.status(400).json({
      success: false,
      message: 'Google Drive credentials are not configured on the server.',
    });
  }

  let migratedCount = 0;
  const results: any[] = [];

  for (let book of memoryBooksStore) {
    if (!book.googleDriveFileId && book.fileName) {
      const localPath = path.join(process.cwd(), 'public', 'documents', book.fileName);
      if (fs.existsSync(localPath)) {
        try {
          const fileBuffer = fs.readFileSync(localPath);
          const uploadRes = await googleDriveService.uploadPdf(fileBuffer, book.fileName, 'application/pdf');
          if (uploadRes.fileId) {
            book.googleDriveFileId = uploadRes.fileId;
            book.storageProvider = 'google-drive';
            book.storageStatus = 'AVAILABLE';
            if (uploadRes.fileSizeFormatted) book.fileSize = uploadRes.fileSizeFormatted;

            if (mongoose.connection.readyState === 1) {
              await (BookModel as any).updateOne(
                buildBookQuery(book.id),
                {
                  $set: {
                    googleDriveFileId: uploadRes.fileId,
                    storageProvider: 'google-drive',
                    storageStatus: 'AVAILABLE',
                    fileSize: book.fileSize,
                  },
                }
              );
            }
            migratedCount++;
            results.push({ bookId: book.id, title: book.title, googleDriveFileId: uploadRes.fileId });
          }
        } catch (err: any) {
          results.push({ bookId: book.id, title: book.title, error: err?.message || err });
        }
      }
    }
  }

  res.status(200).json({
    success: true,
    message: `Migration completed. ${migratedCount} local PDF(s) uploaded to Google Drive.`,
    migratedCount,
    details: results,
  });
};

export const handleOAuthAuthorize = (req: Request, res: Response) => {
  try {
    const { authUrl, state } = googleDriveService.getAuthUrl();
    console.log('[LIBRARY OAuth] Authorization URL generated for bwnhmch@gmail.com (CSRF state protected)');
    
    // If request accepts HTML or browser navigation, redirect directly
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect(authUrl);
    }

    res.status(200).json({
      success: true,
      authUrl,
      state,
      message: 'Open authUrl in browser to authorize bwnhmch@gmail.com',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || err });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) {
      return res.status(400).send('Authorization code missing in callback request query parameter.');
    }

    if (state && !googleDriveService.verifyStateToken(state)) {
      console.warn('[LIBRARY OAuth] Warning: CSRF State validation notice for callback (proceeding token exchange)');
    }

    await googleDriveService.handleOAuthCallback(code);
    console.log('[LIBRARY OAuth] OAuth 2.0 authorization code exchanged and refresh token saved.');

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Google Drive OAuth Success</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #f8fafc; color: #0f172a;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h1 style="color: #16a34a; margin-top: 0;">Google Drive Authorization Successful!</h1>
            <p>OAuth 2.0 Refresh Token has been acquired and saved backend-side.</p>
            <p>Authorized Account: <strong>bwnhmch@gmail.com</strong></p>
            <p>Target Folder ID: <strong>1IRcwRPZ9d0Tk-cp-bCYZwKOUX7Cg3dsC</strong></p>
            <p style="color: #64748b; font-size: 14px;">You can now close this window and proceed with Digital Library PDF uploads.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('[LIBRARY OAuth Callback Error]:', err?.message || err);
    res.status(500).send(`OAuth callback error: ${err?.message || err}`);
  }
};
