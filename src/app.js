import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import enquiryRoutes from './routes/enquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://kefi-omega.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      // Allow exact match or Vercel preview deployments
      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/kefi-omega.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.onrender\.com$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience while maintaining structure
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Welcome root route
app.get('/', (req, res) => {
  res.json({
    brand: 'KEFI BY MUKTA',
    tagline: 'Your Style. Your Story. Your Kefi.',
    status: 'online',
    server: 'Render Production',
    apiDocumentation: {
      health: 'GET /api/health',
      enquiries: 'POST /api/enquiries',
      contact: 'POST /api/contact',
      products: {
        list: 'GET /api/products',
        create: 'POST /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id',
      },
      admin: {
        login: 'POST /api/admin/login',
        stats: 'GET /api/admin/stats',
        enquiries: 'GET /api/admin/enquiries',
        enquiryStatus: 'PATCH /api/admin/enquiries/:id/status',
        contacts: 'GET /api/admin/contacts',
        contactStatus: 'PATCH /api/admin/contacts/:id/status',
        customers: 'GET /api/admin/customers',
      },
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
