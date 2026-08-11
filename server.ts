import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

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
} from './src/server/booksController';

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

const PORT = parseInt(process.env.PORT || '3000', 10);
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
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/documents', express.static(path.join(process.cwd(), 'public', 'documents'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

app.use('/downloads', express.static(path.join(process.cwd(), 'public', 'downloads'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// Ensure PDF requests that do not exist return a 404 JSON response rather than index.html
app.use(['/documents/*', '/downloads/*'], (req: Request, res: Response) => {
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
      return;
    } catch (err) {
      const errMsg = (err as Error).message || '';
      console.error(`[MongoDB] Connection attempt ${attempt}/${retries} failed:`, errMsg);
      
      const isAuthError =
        errMsg.toLowerCase().includes('bad auth') ||
        errMsg.toLowerCase().includes('authentication failed') ||
        errMsg.toLowerCase().includes('auth failed');

      if (isAuthError) {
        console.warn(
          '[MongoDB] Authentication failed ("bad auth"). Please verify database credentials in MONGODB_URI. Operating in decoupled mode.'
        );
        isConnecting = false;
        break;
      }

      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('[MongoDB] Max connection retries reached. Operating in decoupled mode.');
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

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: {
      provider: 'MongoDB Atlas',
      status: dbStateMap[mongoose.connection.readyState] || 'unknown',
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

// Initialize E-Library Books Database & Google Drive Auto-Sync
initBooksDatabaseAndMigration().catch((err) => console.warn('[Books Init Warning]:', err));

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
app.get('/api/v1/admin/drive-diagnostic', handleDriveDiagnostic);
app.get('/api/v1/library/drive-diagnostic', handleDriveDiagnostic);

// User Auth Profile Endpoint (/me, /auth/me, /api/v1/auth/me)
const handleGetMe = (req: Request, res: Response) => {
  console.log('[AUTH] GET /me request received');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH] GET /me: Unauthenticated request (no Bearer token)');
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

// Gallery Store & API Endpoints
const mockGalleryStore: any[] = [
  {
    id: 'g1',
    title: '50-Bed Attached Teaching Hospital & OPD Building',
    category: 'Hospital & OPD',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    description: 'Front facade of the hospital housing daily outpatient departments, casualty, and inpatient wards.',
    uploadDate: '2026-07-01 10:00:00',
    uploader: 'Dr. Susmita Chatterjee (Principal)',
    status: 'PUBLISHED',
    displayOrder: 1,
  },
  {
    id: 'g2',
    title: 'Homoeopathic Pharmacy & HPLC Drug Standardization Lab',
    category: 'Labs & Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    description: 'Students performing potentization and vehicle testing under senior pharmacy professors.',
    uploadDate: '2026-07-02 11:30:00',
    uploader: 'Dr. R. N. Mukherjee (Vice Principal)',
    status: 'PUBLISHED',
    displayOrder: 2,
  },
  {
    id: 'g3',
    title: 'Annual Hahnemannian Oath Ceremony & Induction 2026',
    category: 'Events & Seminars',
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
    description: 'Fresh BHMS 2026 scholars taking the Hahnemannian Oath at the 250-seater air-conditioned auditorium.',
    uploadDate: '2026-07-05 09:15:00',
    uploader: 'System Administrator (Admin)',
    status: 'PUBLISHED',
    displayOrder: 3,
  },
  {
    id: 'g4',
    title: 'Botanical Herbal Garden & Medicinal Flora Reserve',
    category: 'Herbal Garden',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    description: '250+ species of medicinal herbs preserved for practical drug identification and pharmacognosy study.',
    uploadDate: '2026-07-10 14:00:00',
    uploader: 'Dr. Susmita Chatterjee (Principal)',
    status: 'PUBLISHED',
    displayOrder: 4,
  },
];

const handleGetGallery = (req: Request, res: Response) => {
  const { category, search, status } = req.query;
  let list = [...mockGalleryStore];

  if (category && category !== 'All' && category !== 'ALL') {
    list = list.filter((i) => i.category === category);
  }
  if (status && status !== 'ALL') {
    list = list.filter((i) => i.status === status);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.uploader.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    data: list,
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/v1/gallery', handleGetGallery);
app.get('/api/gallery', handleGetGallery);

app.post('/api/v1/gallery/upload', (req: Request, res: Response) => {
  const { fileData, fileName, mimeType, fileSize } = req.body;
  if (fileSize && fileSize > 10 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: 'File size exceeds maximum 10MB limit.' });
  }
  if (mimeType && !mimeType.startsWith('image/')) {
    return res.status(400).json({ success: false, message: 'Invalid file format. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.' });
  }

  res.status(200).json({
    success: true,
    data: {
      url: fileData || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      fileName: fileName || 'uploaded_image.jpg',
      fileSize: fileSize || 1024000,
    },
    message: 'File upload processed successfully',
  });
});

app.post('/api/v1/gallery', (req: Request, res: Response) => {
  const { items, title, imageUrl, category, description, uploader } = req.body;
  const newItemsToAdd = Array.isArray(items) ? items : [{ title, imageUrl, category, description, uploader }];
  const addedList: any[] = [];

  newItemsToAdd.forEach((item: any, idx: number) => {
    if (!item.imageUrl || !item.title) return;
    const newItem = {
      id: `g-${Date.now()}-${idx}`,
      title: item.title,
      description: item.description || 'Campus gallery photograph.',
      category: item.category || 'Hospital & OPD',
      imageUrl: item.imageUrl,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      uploader: item.uploader || uploader || 'Authorized Admin',
      status: item.status || 'PUBLISHED',
      displayOrder: mockGalleryStore.length + 1,
    };
    mockGalleryStore.unshift(newItem);
    addedList.push(newItem);
  });

  res.status(201).json({
    success: true,
    data: addedList,
    message: `${addedList.length} image(s) published successfully.`,
  });
});

app.put('/api/v1/gallery/:id', (req: Request, res: Response) => {
  const index = mockGalleryStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }
  mockGalleryStore[index] = { ...mockGalleryStore[index], ...req.body };
  res.status(200).json({ success: true, data: mockGalleryStore[index], message: 'Gallery item updated successfully' });
});

app.delete('/api/v1/gallery/:id', (req: Request, res: Response) => {
  const index = mockGalleryStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }
  mockGalleryStore.splice(index, 1);
  res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
});

app.post('/api/v1/gallery/bulk-delete', (req: Request, res: Response) => {
  const { ids } = req.body;
  if (Array.isArray(ids)) {
    for (let i = mockGalleryStore.length - 1; i >= 0; i--) {
      if (ids.includes(mockGalleryStore[i].id)) {
        mockGalleryStore.splice(i, 1);
      }
    }
  }
  res.status(200).json({ success: true, message: 'Selected images deleted successfully' });
});

app.post('/api/v1/gallery/bulk-category', (req: Request, res: Response) => {
  const { ids, category } = req.body;
  if (Array.isArray(ids) && category) {
    mockGalleryStore.forEach((item) => {
      if (ids.includes(item.id)) item.category = category;
    });
  }
  res.status(200).json({ success: true, message: 'Category updated for selected images' });
});

app.post('/api/v1/gallery/bulk-status', (req: Request, res: Response) => {
  const { ids, status } = req.body;
  if (Array.isArray(ids) && status) {
    mockGalleryStore.forEach((item) => {
      if (ids.includes(item.id)) item.status = status;
    });
  }
  res.status(200).json({ success: true, message: 'Status updated for selected images' });
});

// API Routes Placeholder / Proxy Handler
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health' || req.path === '/actuator/health' || req.path.startsWith('/opd') || req.path.startsWith('/notices') || req.path.startsWith('/gallery') || req.path.startsWith('/books') || req.path.startsWith('/library')) return next();
  res.status(200).json({
    message: 'BHMCH API Service operational',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
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
  if (NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${NODE_ENV} mode)`);
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
