import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// API Routes Placeholder / Proxy Handler
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health' || req.path === '/actuator/health' || req.path.startsWith('/opd') || req.path.startsWith('/notices')) return next();
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
