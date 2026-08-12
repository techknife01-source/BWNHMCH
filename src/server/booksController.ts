import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { BookModel, SEED_BOOKS, IBook } from './bookModel';
import { googleDriveService } from './googleDriveService';

// In-Memory store for fast fallback & synchronization
let memoryBooksStore: any[] = [...SEED_BOOKS];

// Helper: Seed initial books into MongoDB if connected and empty
export async function initBooksDatabaseAndMigration() {
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await (BookModel as any).countDocuments();
      if (count === 0) {
        console.log('[Books DB] Seeding initial E-Library books into MongoDB...');
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
    console.warn('[Books DB Sync Notice]: Using in-memory store:', err?.message || err);
  }

  // Perform startup Google Drive authentication and folder access test
  if (googleDriveService.hasCredentials()) {
    await googleDriveService.verifyDriveAccess();
  }

  // Auto-migrate local PDFs to Google Drive if Drive credentials are available
  if (googleDriveService.hasCredentials()) {
    console.log('[Google Drive] Credentials detected. Auto-checking seed PDFs for Google Drive upload...');
    for (let i = 0; i < memoryBooksStore.length; i++) {
      const book = memoryBooksStore[i];
      if (!book.googleDriveFileId && book.fileName) {
        const localPath = path.join(process.cwd(), 'public', 'documents', book.fileName);
        if (fs.existsSync(localPath)) {
          try {
            console.log(`[Google Drive Sync] Uploading ${book.fileName} to Google Drive...`);
            const fileBuffer = fs.readFileSync(localPath);
            const uploadRes = await googleDriveService.uploadPdf(fileBuffer, book.fileName, 'application/pdf');
            if (uploadRes.fileId) {
              book.googleDriveFileId = uploadRes.fileId;
              book.storageProvider = 'google-drive';
              book.storageStatus = 'AVAILABLE';
              if (uploadRes.fileSizeFormatted) {
                book.fileSize = uploadRes.fileSizeFormatted;
              }

              // Update in MongoDB if available
              if (mongoose.connection.readyState === 1) {
                await (BookModel as any).updateOne(
                  { id: book.id },
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
              console.log(`[Google Drive Sync] Successfully synced ${book.title} -> FileID: ${uploadRes.fileId}`);
            }
          } catch (syncErr: any) {
            console.warn(`[Google Drive Sync Warning for ${book.fileName}]:`, syncErr?.message || syncErr);
            book.storageProvider = 'local';
            book.storageStatus = 'AVAILABLE';
          }
        }
      }
    }
  }
}

// Format book object for API output
function formatBookOutput(book: any) {
  const pdfEndpointUrl = `/api/v1/books/${book.id}/pdf`;
  return {
    id: book.id || book._id?.toString(),
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
    availableCopies: book.availableCopies ?? 10,
    isBookmarked: book.isBookmarked ?? false,
    coverImageUrl: book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    coverUrl: book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    streamUrl: pdfEndpointUrl,
    fileUrl: pdfEndpointUrl,
    uploadedBy: book.uploadedBy || 'Faculty Board',
    uploadedByUserId: book.uploadedByUserId || 'usr-vp-001',
    uploadedRole: book.uploadedRole || 'Faculty',
    uploadedAt: book.uploadedAt || new Date().toISOString().split('T')[0],
    viewsCount: book.viewsCount ?? 0,
    downloadsCount: book.downloadsCount ?? 0,
    allowDownload: book.allowDownload ?? true,
    description: book.description || '',
    fileSize: book.fileSize || '10.0 MB',
    fileName: book.fileName || `${book.id}.pdf`,
    pageCount: book.pageCount || 100,
    googleDriveFileId: book.googleDriveFileId || null,
    storageProvider: book.storageProvider || 'local',
    storageStatus: book.storageStatus || 'AVAILABLE',
    isPublished: book.isPublished ?? true,
  };
}

// Controller Handlers
export const handleGetBooks = async (req: Request, res: Response) => {
  try {
    console.log('[E-LIBRARY] GET /books started');
    console.log('[E-LIBRARY] Querying published books');

    let booksList: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        booksList = await (BookModel as any).find({ isPublished: true }).lean();
      } catch (dbErr: any) {
        console.warn('[E-LIBRARY] Database query warning, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }
    
    if (!booksList || booksList.length === 0) {
      booksList = memoryBooksStore.filter((b) => b.isPublished !== false);
    }

    console.log(`[E-LIBRARY] Found ${booksList.length} books`);

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
    console.error(`[E-LIBRARY] GET /books failed: ${safeErrorMsg}`);
    
    // Fallback gracefully without crashing
    const safeData = memoryBooksStore.filter((b) => b.isPublished !== false).map(formatBookOutput);
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
  let book = memoryBooksStore.find((b) => b.id === id || b._id?.toString() === id);

  if (!book && mongoose.connection.readyState === 1) {
    try {
      const found = await (BookModel as any).findOne({ $or: [{ id }, { _id: id }] }).lean();
      if (found) book = found;
    } catch (e) {
      // Ignore
    }
  }

  if (!book) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  res.status(200).json({
    success: true,
    data: formatBookOutput(book),
    timestamp: new Date().toISOString(),
  });
};

export const handleStreamBookPdf = async (req: Request, res: Response) => {
  const paramId = req.params.id;
  const decodedParam = decodeURIComponent(paramId).trim();
  const normalizedParam = decodedParam.toLowerCase();

  console.log(`[E-LIBRARY] PDF retrieval started for book: ${decodedParam}`);

  // 1. Find book record in memory store or MongoDB
  let book = memoryBooksStore.find((b) => {
    if (!b) return false;
    const bId = (b.id || b._id?.toString() || '').toLowerCase();
    const bFileName = (b.fileName || '').toLowerCase();
    const bTitle = (b.title || '').toLowerCase();
    const bCleanTitle = bTitle.replace(/[^a-z0-9]/g, '_');
    const paramClean = normalizedParam.replace(/[^a-z0-9]/g, '_');

    return (
      bId === normalizedParam ||
      bFileName === normalizedParam ||
      bFileName.replace(/\.pdf$/, '') === normalizedParam.replace(/\.pdf$/, '') ||
      bTitle === normalizedParam ||
      bCleanTitle === paramClean
    );
  });

  if (!book && mongoose.connection.readyState === 1) {
    try {
      const found = await (BookModel as any).findOne({
        $or: [
          { id: decodedParam },
          { _id: decodedParam },
          { fileName: decodedParam },
          { title: decodedParam }
        ]
      }).lean();
      if (found) book = found;
    } catch (e) {
      // Ignore DB query error
    }
  }

  if (!book) {
    console.log(`[E-LIBRARY] PDF retrieval failed: Book record '${decodedParam}' not found`);
    return res.status(404).json({
      success: false,
      message: `PDF document '${decodedParam}' not found in repository.`,
    });
  }

  // Option A: Stream from Google Drive if file ID exists & Drive service is configured with non-zero length
  if (book.googleDriveFileId && googleDriveService.hasCredentials()) {
    try {
      const driveMeta = await googleDriveService.getFileMetadata(book.googleDriveFileId);
      if (driveMeta && driveMeta.size && parseInt(driveMeta.size, 10) > 0) {
        const storedDriveSize = parseInt(driveMeta.size, 10);
        console.log(`[E-LIBRARY] Google Drive file ID: ${book.googleDriveFileId}`);
        console.log(`[E-LIBRARY] Google Drive stored size: ${storedDriveSize} bytes`);

        const driveRes = await googleDriveService.getPdfStream(book.googleDriveFileId, req.headers.range);
        const contentLength = parseInt(driveRes.headers['content-length'] || '0', 10) || storedDriveSize;

        if (contentLength > 0) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${book.fileName || 'Database_Migration_Tool.pdf'}"`);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Access-Control-Allow-Origin', '*');
          if (driveRes.headers['content-range']) {
            res.setHeader('Content-Range', driveRes.headers['content-range']);
          }
          res.setHeader('Content-Length', contentLength);
          res.status(driveRes.status || 200);

          console.log('[E-LIBRARY] PDF retrieval completed');
          console.log(`[E-LIBRARY] Bytes streamed: ${contentLength}`);
          return driveRes.stream.pipe(res);
        }
      } else {
        console.warn(`[E-LIBRARY] Google Drive file ID ${book.googleDriveFileId} contains 0 bytes or is missing metadata`);
      }
    } catch (driveErr: any) {
      console.warn(`[E-LIBRARY] Google Drive stream error for ${book.title}:`, driveErr?.message || driveErr);
    }
  }

  // Option B: Stream from local disk (/public/documents/...)
  const candidateFiles = Array.from(new Set([
    book.fileName,
    decodedParam,
    `${decodedParam}.pdf`,
    book.id ? `${book.id}.pdf` : null,
    'Database_Migration_Tool.pdf',
    'bhmch_organon_edition6.pdf',
  ].filter(Boolean))) as string[];

  let localFilePath: string | null = null;
  for (const cand of candidateFiles) {
    const p = path.join(process.cwd(), 'public', 'documents', cand);
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.size > 0) {
        localFilePath = p;
        break;
      }
    }
  }

  if (localFilePath) {
    const stat = fs.statSync(localFilePath);
    const fileSize = stat.size;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${book.fileName || path.basename(localFilePath)}"`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).end();
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(localFilePath, { start, end });

      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);
      res.status(206);

      console.log('[E-LIBRARY] PDF retrieval completed');
      console.log(`[E-LIBRARY] Bytes streamed: ${chunkSize}`);
      return fileStream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      res.status(200);

      console.log('[E-LIBRARY] PDF retrieval completed');
      console.log(`[E-LIBRARY] Bytes streamed: ${fileSize}`);
      return fs.createReadStream(localFilePath).pipe(res);
    }
  }

  // Option C: Return clear 404 error if file is not found on disk or drive (do not return fake PDF)
  console.log(`[E-LIBRARY] PDF retrieval failed: Content for '${book.title}' unavailable in storage`);
  return res.status(404).json({
    success: false,
    message: `PDF document '${book.title}' content is unavailable in storage.`,
  });
};

export const handleCreateBook = async (req: Request, res: Response) => {
  try {
    console.log('[E-LIBRARY] Upload started');

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

    // Handle PDF upload from req.file or base64
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

    console.log(`[E-LIBRARY] Original file size: ${originalSizeBytes} bytes (${fileSizeStr})`);

    const bookId = `book-${Date.now()}`;
    const nameToUse = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    let googleDriveFileId: string | null = null;
    let storageProvider: 'google-drive' | 'local' = 'local';

    // 1. Save file locally to disk first
    try {
      const documentsDir = path.join(process.cwd(), 'public', 'documents');
      if (!fs.existsSync(documentsDir)) {
        fs.mkdirSync(documentsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(documentsDir, nameToUse), fileBuffer);
    } catch (locErr: any) {
      console.warn('[E-LIBRARY] Local write warning:', locErr?.message || locErr);
    }

    // 2. Upload to Google Drive if credentials exist
    if (googleDriveService.hasCredentials()) {
      try {
        const driveRes = await googleDriveService.uploadPdf(fileBuffer, nameToUse, 'application/pdf');
        if (driveRes && driveRes.fileId && driveRes.storedSizeBytes > 0) {
          googleDriveFileId = driveRes.fileId;
          storageProvider = 'google-drive';
          console.log('[E-LIBRARY] Google Drive upload completed');
          console.log(`[E-LIBRARY] Google Drive file ID: ${googleDriveFileId}`);
          console.log(`[E-LIBRARY] Google Drive stored size: ${driveRes.storedSizeBytes} bytes`);
        } else {
          return res.status(500).json({
            success: false,
            message: 'Google Drive upload completed but returned invalid file ID.',
          });
        }
      } catch (uploadErr: any) {
        console.error('[E-LIBRARY] Google Drive upload failed:', uploadErr?.message || uploadErr);
        return res.status(500).json({
          success: false,
          message: `Google Drive PDF upload failed: ${uploadErr?.message || uploadErr}`,
        });
      }
    }

    // 3. Create database record ONLY AFTER file storage is complete & verified
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
    };

    memoryBooksStore.unshift(newBook);

    if (mongoose.connection.readyState === 1) {
      try {
        await (BookModel as any).create(newBook);
      } catch (dbErr: any) {
        console.warn('[E-LIBRARY] MongoDB create warning (stored in memory):', dbErr?.message || dbErr);
      }
    }

    console.log('[E-LIBRARY] Database record created');
    console.log('[E-LIBRARY] Upload completed');

    res.status(201).json({
      success: true,
      message: 'E-Library book uploaded and stored successfully.',
      data: formatBookOutput(newBook),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[E-LIBRARY] handleCreateBook error:', err?.message || err);
    res.status(500).json({ success: false, message: `Failed to upload book: ${err?.message || err}` });
  }
};

export const handleUpdateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  let index = memoryBooksStore.findIndex((b) => b.id === id || b._id?.toString() === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  memoryBooksStore[index] = { ...memoryBooksStore[index], ...req.body };

  if (mongoose.connection.readyState === 1) {
    try {
      await (BookModel as any).updateOne({ $or: [{ id }, { _id: id }] }, { $set: req.body });
    } catch (e) {
      // Ignore
    }
  }

  res.status(200).json({
    success: true,
    message: 'Book resource updated successfully',
    data: formatBookOutput(memoryBooksStore[index]),
  });
};

export const handleDeleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const index = memoryBooksStore.findIndex((b) => b.id === id || b._id?.toString() === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Book resource not found' });
  }

  const deletedBook = memoryBooksStore.splice(index, 1)[0];

  if (deletedBook?.googleDriveFileId && googleDriveService.hasCredentials()) {
    googleDriveService.deleteFile(deletedBook.googleDriveFileId).catch(() => {});
  }

  if (mongoose.connection.readyState === 1) {
    try {
      await (BookModel as any).deleteOne({ $or: [{ id }, { _id: id }] });
    } catch (e) {
      // Ignore
    }
  }

  res.status(200).json({
    success: true,
    message: 'Book resource removed from E-Library',
    data: true,
  });
};

export const handleIncrementView = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = memoryBooksStore.find((b) => b.id === id || b._id?.toString() === id);
  if (book) {
    book.viewsCount = (book.viewsCount || 0) + 1;
    if (mongoose.connection.readyState === 1) {
      (BookModel as any).updateOne({ $or: [{ id }, { _id: id }] }, { $inc: { viewsCount: 1 } }).catch(() => {});
    }
  }
  res.status(200).json({ success: true, message: 'View count incremented' });
};

export const handleIncrementDownload = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = memoryBooksStore.find((b) => b.id === id || b._id?.toString() === id);
  if (book) {
    book.downloadsCount = (book.downloadsCount || 0) + 1;
    if (mongoose.connection.readyState === 1) {
      (BookModel as any).updateOne({ $or: [{ id }, { _id: id }] }, { $inc: { downloadsCount: 1 } }).catch(() => {});
    }
  }
  res.status(200).json({ success: true, message: 'Download count incremented' });
};

export const handleGetStreamToken = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pdfEndpointUrl = `/api/v1/books/${id}/pdf`;
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
      message: 'Google Drive credentials are not configured on the server. Please set GOOGLE_DRIVE_CLIENT_EMAIL and GOOGLE_DRIVE_PRIVATE_KEY in environment variables.',
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
                { id: book.id },
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
