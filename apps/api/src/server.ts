import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { router } from './routes/index.js';
import { prisma, seedDatabase } from '@revenueshield/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/agents/activity')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // API Routes
  app.use('/api', router);

  // Serve Frontend SPA in production or if web/dist exists
  const webDistCandidates = [
    path.resolve(__dirname, '../../web/dist'),
    path.resolve(__dirname, '../../../apps/web/dist'),
    path.resolve(process.cwd(), 'apps/web/dist'),
    path.resolve(process.cwd(), 'web/dist'),
  ];
  const webDistPath = webDistCandidates.find(p => fs.existsSync(p));

  if (webDistPath) {
    app.use(express.static(webDistPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(webDistPath, 'index.html'));
    });
  }

  // Auto-seed on start if database is empty
  async function initializeDatabase() {
    try {
      const merchant = await prisma.merchant.findFirst();
      if (!merchant) {
        console.log('Database empty on startup. Auto-seeding initial fintech merchant data...');
        await seedDatabase();
      }
    } catch (err) {
      console.warn('Database initialization note:', err);
    }
  }

  initializeDatabase();

  return app;
}
