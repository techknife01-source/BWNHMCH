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

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || '';
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
const connectMongoDB = async (retries = 5, delayMs = 3000) => {
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
      console.error(`[MongoDB] Connection attempt ${attempt}/${retries} failed:`, (err as Error).message);
      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('[MongoDB] Max connection retries reached.');
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

// API Routes Placeholder / Proxy Handler
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health' || req.path === '/actuator/health') return next();
  res.status(200).json({
    message: 'BWNHMCH API Service operational',
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
