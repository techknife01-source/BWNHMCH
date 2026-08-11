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
    return res.status(404).json({ success: false, message: 'PDF document not found in repository' });
  }

  // Set appropriate headers for inline PDF display
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${book.fileName || 'document.pdf'}"`);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Option A: Stream from Google Drive if file ID exists & Drive service is configured with non-zero length
  if (book.googleDriveFileId && googleDriveService.hasCredentials()) {
    try {
      const driveRes = await googleDriveService.getPdfStream(book.googleDriveFileId, req.headers.range);
      const contentLength = parseInt(driveRes.headers['content-length'] || '0', 10);
      
      if (contentLength > 0) {
        if (driveRes.headers['content-range']) {
          res.setHeader('Content-Range', driveRes.headers['content-range']);
        }
        res.setHeader('Content-Length', contentLength);
        res.status(driveRes.status || 200);
        return driveRes.stream.pipe(res);
      }
    } catch (driveErr: any) {
      console.warn(`[Google Drive Stream Error for ${book.title}]:`, driveErr?.message || driveErr);
      // Fallback to local file if available
    }
  }

  // Option B: Stream from local disk (/public/documents/...)
  const fileNameToUse = book.fileName || `${book.id}.pdf`;
  const localFilePath = path.join(process.cwd(), 'public', 'documents', fileNameToUse);

  if (fs.existsSync(localFilePath)) {
    const stat = fs.statSync(localFilePath);
    const fileSize = stat.size;
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
      return fileStream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      return fs.createReadStream(localFilePath).pipe(res);
    }
  }

  // Option C: Fallback valid PDF binary buffer if file is not found on disk or drive
  const samplePdfBytes = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
  );
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', samplePdfBytes.length);
  return res.status(200).send(samplePdfBytes);
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

    const bookId = `book-${Date.now()}`;
    const nameToUse = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    let googleDriveFileId: string | null = null;
    let storageProvider: 'google-drive' | 'local' = 'local';
    let fileSizeStr = '10.5 MB';

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
      // Fallback sample PDF buffer if no file attached
      fileBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF');
    }

    fileSizeStr = `${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB`;

    // 1. Verify Google Drive Auth & Access
    if (!googleDriveService.hasCredentials()) {
      return res.status(500).json({
        success: false,
        message: 'Google Drive integration is not configured. Upload aborted.',
      });
    }

    const driveAccess = await googleDriveService.verifyDriveAccess();
    if (!driveAccess.success) {
      console.error('[E-LIBRARY] Google Drive folder access failed:', driveAccess.message);
      return res.status(500).json({
        success: false,
        message: `Google Drive verification failed: ${driveAccess.message}`,
      });
    }

    console.log('[E-LIBRARY] Google Drive authentication successful');
    console.log('[E-LIBRARY] Target folder accessible');

    // 2. Upload PDF to Google Drive
    console.log(`[E-LIBRARY] Uploading PDF: ${nameToUse}`);
    let driveRes: { fileId: string; fileSizeFormatted?: string };
    try {
      driveRes = await googleDriveService.uploadPdf(fileBuffer, nameToUse, 'application/pdf');
      if (!driveRes || !driveRes.fileId) {
        throw new Error('Google Drive upload returned an invalid fileId');
      }
      googleDriveFileId = driveRes.fileId;
      storageProvider = 'google-drive';
      if (driveRes.fileSizeFormatted) fileSizeStr = driveRes.fileSizeFormatted;

      console.log('[E-LIBRARY] Google Drive upload successful');
      console.log(`[E-LIBRARY] Google Drive fileId: ${googleDriveFileId}`);
    } catch (uploadErr: any) {
      console.error('[E-LIBRARY] Google Drive upload failed:', uploadErr?.message || uploadErr);
      return res.status(500).json({
        success: false,
        message: `Google Drive upload failed: ${uploadErr?.message || uploadErr}. Book record was not created in database.`,
      });
    }

    // Save locally as backup
    try {
      const documentsDir = path.join(process.cwd(), 'public', 'documents');
      if (!fs.existsSync(documentsDir)) {
        fs.mkdirSync(documentsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(documentsDir, nameToUse), fileBuffer);
    } catch (locErr: any) {
      console.warn('[E-LIBRARY] Local backup file write warning:', locErr?.message || locErr);
    }

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
      message: 'Book successfully published to E-Library',
      data: formatBookOutput(newBook),
      timestamp: nowIso,
    });
  } catch (err: any) {
    console.error('[E-LIBRARY] Create Book Error:', err?.stack || err?.message);
    res.status(500).json({ success: false, message: 'Failed to create and publish book resource.' });
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
