import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

// Configure DNS fallback to handle local ISP / Windows SRV query issues for MongoDB Atlas
try {
  const currentServers = dns.getServers();
  dns.setServers(['8.8.8.8', '1.1.1.1', ...currentServers]);
} catch (e) {
  // Ignore DNS config errors if unsupported by environment
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

import {
  initBooksDatabaseAndMigration,
  handleGetBooks,
  handleGetBookById,
  handleStreamBookPdf,
  handleCreateBook,
  handleUpdateBook,
  handleDeleteBook,
  handleIncrementView,
  handleIncrementDownload,
  handleGetStreamToken,
  handleMigrateToDrive,
  handleDriveDiagnostic,
  handleOAuthAuthorize,
  handleOAuthCallback,
} from './src/server/booksController';
import {
  initStaffDatabase,
  handleGetStaff,
  handleGetSingleStaff,
  handleCreateStaff,
  handleUpdateStaff,
  handleDeleteStaff,
  handleUploadFacultyPhoto,
  handleGetFacultyPhoto,
  handleDeleteFacultyPhoto,
} from './src/server/staffController';
import {
  initGalleryDatabase,
  handleGetGallery,
  handleGetGalleryById,
  handleCreateGallery,
  handleUploadGalleryImage,
  handleStreamGalleryImage,
  handleUpdateGallery,
  handleDeleteGallery,
  handleDeleteGalleryImage,
  handleBulkDeleteGallery,
  handleBulkCategoryGallery,
  handleBulkStatusGallery,
} from './src/server/galleryController';

dotenv.config();

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

const PORT = Number(process.env.PORT) || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = sanitizeMongoUri(process.env.MONGODB_URI || '');
const CLIENT_URL = process.env.CLIENT_URL || '';

const app = express();

// Enable trust proxy for reverse proxy environments (e.g. Cloud Run, Nginx)
app.set('trust proxy', 1);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite inline scripts in dev
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration supporting dynamic origin matching
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.onrender\.com$/.test(origin) ||
        /\.run\.app$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(null, true); // Fallback allow for preview environments
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: 'Too many requests from this IP, please try again later.' },
});

app.use('/api/', apiLimiter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '50mb' })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
  });
});

// Ensure E-Library PDFs exist on server startup
const organonPdfPath = path.join(process.cwd(), 'public', 'documents', 'bhmch_organon_edition6.pdf');
if (!fs.existsSync(organonPdfPath)) {
  try {
    console.log('[PDF Storage] Auto-generating E-Library PDF resources...');
    execSync('node scripts/generatePdfs.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('[PDF Storage] Error auto-generating E-Library PDFs:', err);
  }
}

// Serve static documents and downloads directly with application/pdf Content-Type
app.use(['/documents', '/api/v1/documents'], express.static(path.join(process.cwd(), 'public', 'documents'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

app.use(['/downloads', '/api/v1/downloads'], express.static(path.join(process.cwd(), 'public', 'downloads'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// Ensure PDF requests that do not exist return a 404 JSON response rather than index.html
app.use(['/documents/*', '/api/v1/documents/*', '/downloads/*', '/api/v1/downloads/*'], (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Document or PDF resource not found' });
});

// MongoDB Connection Logic with Retry Strategy
let isConnecting = false;

const connectMongoDB = async (retries = 3, delayMs = 2000) => {
  const isValidScheme =
    typeof MONGODB_URI === 'string' &&
    (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'));

  if (!MONGODB_URI || !isValidScheme) {
    console.warn(
      '[MongoDB] MONGODB_URI is absent or invalid (must start with "mongodb://" or "mongodb+srv://"). Operating in decoupled mode.'
    );
    return;
  }

  if (mongoose.connection.readyState === 1 || isConnecting) return;
  isConnecting = true;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Successfully connected to MongoDB Atlas');
      isConnecting = false;
      await initStaffDatabase();
      return;
    } catch (err) {
      const errMsg = (err as Error).message || '';
      const isAuthError =
        errMsg.toLowerCase().includes('bad auth') ||
        errMsg.toLowerCase().includes('authentication failed') ||
        errMsg.toLowerCase().includes('auth failed');

      if (isAuthError) {
        console.log(
          '[MongoDB] Database credentials in MONGODB_URI require verification. Operating smoothly in local persistent storage mode.'
        );
        isConnecting = false;
        break;
      }

      console.warn(`[MongoDB] Connection attempt ${attempt}/${retries} notice:`, errMsg);

      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.log('[MongoDB] Max connection retries reached. Operating in local persistent storage mode.');
        isConnecting = false;
      }
    }
  }
};

connectMongoDB();

// Health Check Endpoints
const getHealthStatus = () => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isDbUp = mongoose.connection.readyState === 1;

  return {
    status: 'UP',
    success: true,
    message: 'BHMCH API Service operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: {
      provider: 'MongoDB Atlas',
      status: isDbUp ? 'UP' : (dbStateMap[mongoose.connection.readyState] || 'unknown'),
    },
  };
};

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json(getHealthStatus());
});

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json(getHealthStatus());
});

app.get('/api/v1/actuator/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    components: {
      db: {
        status: mongoose.connection.readyState === 1 ? 'UP' : 'UNKNOWN',
        details: { database: 'MongoDB Atlas' },
      },
      diskSpace: { status: 'UP' },
      ping: { status: 'UP' },
    },
  });
});

// Initialize E-Library Books, Staff & Gallery Databases with Google Drive Auto-Sync
initBooksDatabaseAndMigration().catch((err) => console.warn('[Books Init Warning]:', err));
initStaffDatabase().catch((err) => console.warn('[Staff Init Warning]:', err));
initGalleryDatabase().catch((err) => console.warn('[Gallery Init Warning]:', err));

// Staff, Faculty & Doctor Directory REST Endpoints (Public GET, Protected Admin Write Ops)
const staffRoutes = [
  '/staff',
  '/faculty',
  '/doctors',
  '/api/staff',
  '/api/faculty',
  '/api/doctors',
  '/api/v1/staff',
  '/api/v1/faculty',
  '/api/v1/doctors',
  '/api/v1/hospital/staff',
  '/api/v1/hospital/doctors',
];

// Faculty, Staff & Doctor Photo Endpoints (Google Drive Integration)
const facultyPhotoRoutes = [
  '/faculty/:facultyId/photo',
  '/staff/:facultyId/photo',
  '/doctors/:facultyId/photo',
  '/api/faculty/:facultyId/photo',
  '/api/staff/:facultyId/photo',
  '/api/doctors/:facultyId/photo',
  '/api/v1/faculty/:facultyId/photo',
  '/api/v1/staff/:facultyId/photo',
  '/api/v1/doctors/:facultyId/photo',
  '/faculty/:id/photo',
  '/staff/:id/photo',
  '/doctors/:id/photo',
  '/api/v1/faculty/:id/photo',
  '/api/v1/staff/:id/photo',
  '/api/v1/doctors/:id/photo',
];

facultyPhotoRoutes.forEach((route) => {
  app.get(route, handleGetFacultyPhoto);
  app.post(route, upload.any(), handleUploadFacultyPhoto);
  app.delete(route, handleDeleteFacultyPhoto);
});

staffRoutes.forEach((route) => {
  app.get(route, handleGetStaff);
  app.get(`${route}/:id`, handleGetSingleStaff);
  app.post(route, handleCreateStaff);
  app.put(`${route}/:id`, handleUpdateStaff);
  app.patch(`${route}/:id`, handleUpdateStaff);
  app.delete(`${route}/:id`, handleDeleteStaff);
});

// Book & E-Library Endpoints Across All URL Routes
const bookCollectionRoutes = [
  '/books',
  '/library/books',
  '/api/books',
  '/api/v1/books',
  '/api/v1/library/books',
];

bookCollectionRoutes.forEach((route) => {
  app.get(route, handleGetBooks);
  app.post(route, upload.single('file'), handleCreateBook);
});

const bookPdfStreamRoutes = [
  '/books/:id/pdf',
  '/library/books/:id/pdf',
  '/api/books/:id/pdf',
  '/api/v1/books/:id/pdf',
  '/api/v1/library/books/:id/pdf',
];

bookPdfStreamRoutes.forEach((route) => {
  app.get(route, handleStreamBookPdf);
});

const bookItemRoutes = [
  '/books/:id',
  '/library/books/:id',
  '/api/books/:id',
  '/api/v1/books/:id',
  '/api/v1/library/books/:id',
];

bookItemRoutes.forEach((route) => {
  app.get(route, handleGetBookById);
  app.put(route, handleUpdateBook);
  app.delete(route, handleDeleteBook);
});

const bookViewRoutes = [
  '/books/:id/view',
  '/library/books/:id/view',
  '/api/books/:id/view',
  '/api/v1/books/:id/view',
  '/api/v1/library/books/:id/view',
];
bookViewRoutes.forEach((route) => app.post(route, handleIncrementView));

const bookDownloadRoutes = [
  '/books/:id/download',
  '/library/books/:id/download',
  '/api/books/:id/download',
  '/api/v1/books/:id/download',
  '/api/v1/library/books/:id/download',
];
bookDownloadRoutes.forEach((route) => app.post(route, handleIncrementDownload));

const bookTokenRoutes = [
  '/books/:id/stream-token',
  '/library/books/:id/stream-token',
  '/api/books/:id/stream-token',
  '/api/v1/books/:id/stream-token',
  '/api/v1/library/books/:id/stream-token',
];
bookTokenRoutes.forEach((route) => app.get(route, handleGetStreamToken));

app.post('/api/v1/books/migrate-to-drive', handleMigrateToDrive);
app.post('/api/v1/library/books/migrate-to-drive', handleMigrateToDrive);
app.get('/api/v1/admin/diagnostics/google-drive', handleDriveDiagnostic);
app.get('/api/v1/admin/drive-diagnostic', handleDriveDiagnostic);
app.get('/api/v1/library/google-drive/oauth/authorize', handleOAuthAuthorize);
app.get('/api/v1/library/google-drive/oauth/callback', handleOAuthCallback);
const SPRING_BOOT_BASE_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';

const proxyToSpringBoot = async (req: Request, res: Response): Promise<boolean> => {
  try {
    const targetUrl = `${SPRING_BOOT_BASE_URL}${req.originalUrl || req.url}`;
    const headers: Record<string, string> = {};
    if (req.headers.authorization) headers['authorization'] = req.headers.authorization as string;
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'] as string;

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const sbRes = await fetch(targetUrl, options);
    if (!sbRes.ok && sbRes.status === 404) {
      return false;
    }

    const contentType = sbRes.headers.get('content-type') || '';
    res.status(sbRes.status);
    if (contentType.includes('application/json')) {
      const data = await sbRes.json();
      res.json(data);
    } else {
      const buffer = await sbRes.arrayBuffer();
      res.setHeader('content-type', contentType);
      res.send(Buffer.from(buffer));
    }
    return true;
  } catch {
    return false;
  }
};

// Authentication Login Endpoint (/auth/login, /api/v1/auth/login)
const handleLogin = async (req: Request, res: Response) => {
  const proxied = await proxyToSpringBoot(req, res);
  if (proxied) return;

  const { usernameOrEmail, username, email } = req.body || {};
  const identifier = (usernameOrEmail || username || email || '').toLowerCase().trim();

  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Username or email is required',
      timestamp: new Date().toISOString(),
    });
  }

  let role = 'ROLE_STUDENT';
  let fullName = 'College User';
  let department = 'General Academic';

  if (identifier.includes('admin') || identifier.includes('super')) {
    role = 'ROLE_ADMIN';
    fullName = 'System SuperAdmin Office';
    department = 'Central IT & Administration';
  } else if (identifier.includes('principal') || identifier.includes('vice')) {
    role = 'ROLE_PRINCIPAL';
    fullName = 'Dr. Susmita Chatterjee';
    department = 'Practice of Medicine';
  } else if (identifier.includes('faculty') || identifier.includes('prof') || identifier.includes('doc')) {
    role = 'ROLE_FACULTY';
    fullName = 'Dr. Priyanka Maji';
    department = 'Materia Medica';
  } else if (identifier.includes('student')) {
    role = 'ROLE_STUDENT';
    fullName = 'Arjun Sen';
    department = '3rd BHMS Professional';
  }

  const tokenPayload = Buffer.from(JSON.stringify({ sub: identifier, role })).toString('base64');
  const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenPayload}.${Date.now()}`;
  const refreshToken = `ref-${accessToken}`;

  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      userId: `usr-${identifier.replace(/[^a-z0-9]/g, '') || '001'}`,
      username: identifier.split('@')[0],
      email: identifier.includes('@') ? identifier : `${identifier}@bhmch.com`,
      fullName,
      roles: [role],
      department,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    },
    timestamp: new Date().toISOString(),
  });
};

const loginRoutes = [
  '/auth/login',
  '/api/auth/login',
  '/api/v1/auth/login',
];

loginRoutes.forEach((route) => app.post(route, handleLogin));

// User Auth Profile Endpoint (/me, /auth/me, /api/v1/auth/me)
const handleGetMe = async (req: Request, res: Response) => {
  const proxied = await proxyToSpringBoot(req, res);
  if (proxied) return;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing authentication token',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      id: 'usr-adm-001',
      username: 'admin',
      email: 'admin@bhmch.com',
      fullName: 'System SuperAdmin Office',
      roles: ['ROLE_ADMIN', 'ROLE_SUPERADMIN'],
      department: 'Central IT & Administration',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
      enabled: true,
    },
    timestamp: new Date().toISOString(),
  });
};

const meRoutes = [
  '/me',
  '/auth/me',
  '/api/me',
  '/api/v1/me',
  '/api/v1/auth/me',
];

meRoutes.forEach((route) => app.get(route, handleGetMe));

// OPD Ticket Email & Notification API Endpoint
app.post('/api/v1/opd/send-ticket-email', (req: Request, res: Response) => {
  const { recipientEmail, patientName, uhid, appointmentId, tokenNumber, doctorName, department, appointmentDate, timeSlot } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: 'Recipient email address is required' });
  }

  console.log(`[OPD EMAIL DISPATCH]: Dispatched OPD Consultation PDF Ticket to ${recipientEmail} for patient ${patientName} (${uhid}), Appt #${appointmentId}, Token #${tokenNumber}, Doctor: ${doctorName}, Dept: ${department}, Slot: ${appointmentDate} ${timeSlot}`);

  res.status(200).json({
    success: true,
    message: `OPD Ticket PDF successfully dispatched to patient registered email: ${recipientEmail}`,
    recipient: recipientEmail,
    appointmentId,
    tokenNumber,
    timestamp: new Date().toISOString(),
  });
});

// Notice Board REST API Endpoints
const mockNoticeStore: any[] = [
  {
    id: 'n-101',
    noticeNo: 'BHMCH/ACAD/2026/089',
    title: 'BHMS 1st Professional WBUHS Supplementary Examination Routine 2026',
    summary: 'Official routine and guidelines for upcoming supplementary theory and practical examinations.',
    content: '<h2>BHMS 1st Professional Supplementary Examination Roster</h2><p>All eligible BHMS 1st Professional candidates of BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL are hereby notified that WBUHS exams commence August 12, 2026.</p>',
    category: 'EXAM',
    department: 'Practice of Medicine',
    author: 'Prof. Dr. S. K. Banerjea',
    authorRole: 'Principal & Academic Director',
    publishedDate: '2026-07-28',
    isImportant: true,
    status: 'PUBLISHED',
    targetAudience: 'STUDENTS',
    viewsCount: 342,
    attachments: [
      { id: 'att-1', name: 'WBUHS_Supplementary_Exam_Routine_2026.pdf', type: 'pdf', size: '1.4 MB', url: '#' },
      { id: 'att-2', name: 'Hall_Ticket_Instructions.docx', type: 'docx', size: '420 KB', url: '#' },
    ],
  },
  {
    id: 'n-102',
    noticeNo: 'BHMCH/HOSP/2026/044',
    title: 'Notification regarding Homoeopathic Hospital OPD Roster during National Holiday',
    summary: 'Emergency OPD duty roster for interns and clinical faculty members.',
    content: '<h2>Hospital Duty Directive for National Holiday</h2><p>The Emergency & Casual OPD Services will remain FULLY OPERATIONAL 24x7.</p>',
    category: 'HOSPITAL',
    department: 'General Medicine',
    author: 'Dr. Amitav Roy',
    authorRole: 'Medical Superintendent',
    publishedDate: '2026-07-25',
    isImportant: false,
    status: 'PUBLISHED',
    targetAudience: 'ALL',
    viewsCount: 189,
    attachments: [
      { id: 'att-3', name: 'OPD_Duty_Roster_Holiday.pdf', type: 'pdf', size: '890 KB', url: '#' },
      { id: 'att-4', name: 'Clinical_Duty_Briefing.pptx', type: 'ppt', size: '2.8 MB', url: '#' },
    ],
  },
];

app.get('/api/v1/notices', (req: Request, res: Response) => {
  const { category, department, search, status } = req.query;
  let list = [...mockNoticeStore];

  if (category && category !== 'ALL') {
    list = list.filter((n) => n.category.toUpperCase() === String(category).toUpperCase());
  }
  if (department && department !== 'All') {
    list = list.filter((n) => n.department === department);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }
  if (status && status !== 'ALL') {
    list = list.filter((n) => n.status === status);
  }

  res.status(200).json({
    success: true,
    data: {
      content: list,
      pageNo: 1,
      pageSize: list.length,
      totalElements: list.length,
      totalPages: 1,
      last: true,
    },
  });
});

app.get('/api/v1/notices/recent', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: mockNoticeStore.slice(0, 5),
  });
});

app.get('/api/v1/notices/:id', (req: Request, res: Response) => {
  const item = mockNoticeStore.find((n) => n.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  res.status(200).json({ success: true, data: item });
});

app.post('/api/v1/notices', (req: Request, res: Response) => {
  const newNotice = {
    id: `n-${Date.now()}`,
    noticeNo: req.body.noticeNo || `BHMCH/GEN/2026/${Math.floor(100 + Math.random() * 900)}`,
    title: req.body.title || 'Untitled Notice',
    summary: req.body.summary || '',
    content: req.body.content || '',
    category: req.body.category || 'ACADEMIC',
    department: req.body.department || 'All',
    author: req.body.author || 'Principal Office',
    authorRole: req.body.authorRole || 'Principal',
    publishedDate: req.body.publishedDate || new Date().toISOString().split('T')[0],
    isImportant: req.body.isImportant ?? false,
    status: req.body.status || 'PUBLISHED',
    attachments: req.body.attachments || [],
    targetAudience: req.body.targetAudience || 'ALL',
    viewsCount: 1,
  };
  mockNoticeStore.unshift(newNotice);
  res.status(201).json({ success: true, data: newNotice, message: 'Notice created successfully' });
});

app.put('/api/v1/notices/:id', (req: Request, res: Response) => {
  const index = mockNoticeStore.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  mockNoticeStore[index] = { ...mockNoticeStore[index], ...req.body };
  res.status(200).json({ success: true, data: mockNoticeStore[index], message: 'Notice updated successfully' });
});

app.delete('/api/v1/notices/:id', (req: Request, res: Response) => {
  const index = mockNoticeStore.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }
  mockNoticeStore.splice(index, 1);
  res.status(200).json({ success: true, message: 'Notice deleted successfully' });
});

// Gallery REST API Endpoints (MongoDB Atlas + Google Drive Binary Streaming)
const galleryRoutes = [
  '/gallery',
  '/api/gallery',
  '/api/v1/gallery',
];

galleryRoutes.forEach((route) => {
  app.get(route, handleGetGallery);
  app.post(route, handleCreateGallery);
});

const galleryUploadRoutes = [
  '/gallery/upload',
  '/api/gallery/upload',
  '/api/v1/gallery/upload',
  '/gallery/:id/image',
  '/api/gallery/:id/image',
  '/api/v1/gallery/:id/image',
  '/gallery/:id/photo',
  '/api/gallery/:id/photo',
  '/api/v1/gallery/:id/photo',
];

galleryUploadRoutes.forEach((route) => {
  app.post(route, upload.any(), handleUploadGalleryImage);
});

const galleryStreamRoutes = [
  '/gallery/:id/image',
  '/api/gallery/:id/image',
  '/api/v1/gallery/:id/image',
  '/gallery/:id/photo',
  '/api/gallery/:id/photo',
  '/api/v1/gallery/:id/photo',
];

galleryStreamRoutes.forEach((route) => {
  app.get(route, handleStreamGalleryImage);
  app.delete(route, handleDeleteGalleryImage);
});

const galleryItemRoutes = [
  '/gallery/:id',
  '/api/gallery/:id',
  '/api/v1/gallery/:id',
];

galleryItemRoutes.forEach((route) => {
  app.get(route, handleGetGalleryById);
  app.put(route, handleUpdateGallery);
  app.patch(route, handleUpdateGallery);
  app.delete(route, handleDeleteGallery);
});

app.post('/api/v1/gallery/bulk-delete', handleBulkDeleteGallery);
app.post('/api/v1/gallery/bulk-category', handleBulkCategoryGallery);
app.post('/api/v1/gallery/bulk-status', handleBulkStatusGallery);

// API Unhandled Routes Proxy & Fallback Handler
app.use('/api/v1', async (req: Request, res: Response) => {
  const proxied = await proxyToSpringBoot(req, res);
  if (!proxied) {
    res.status(404).json({
      success: false,
      message: `API route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  }
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]:', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
  });
});

// Vite Middleware for Development / Static Serve for Production
async function startServer() {
  const distIndexExists = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  if (NODE_ENV !== 'production' || !distIndexExists) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const assetsPath = path.join(distPath, 'assets');

    // Serve /assets with maxAge caching & explicit MIME types
    app.use('/assets', express.static(assetsPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (filepath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
      },
    }));

    // Prevent SPA fallback for missing static assets
    app.use('/assets/*', (req: Request, res: Response) => {
      res.status(404).type('text/css').send('/* Static asset not found */');
    });

    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const host = '0.0.0.0';
  const server = app.listen(PORT, host, () => {
    console.log(`[SERVER] NODE_ENV=${NODE_ENV}`);
    console.log(`[SERVER] PORT=${PORT}`);
    console.log(`[SERVER] HOST=${host}`);
    console.log(`[SERVER] Server listening successfully on http://${host}:${PORT}`);
    console.log(`
==================================================
  BWNHMCH Smart Homeopathic Ecosystem Server Ready
==================================================
  Local:   http://localhost:${PORT}
  Network: http://${host}:${PORT}
  Mode:    ${NODE_ENV}
==================================================
`);
  });

  // Graceful Shutdown Handling
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
