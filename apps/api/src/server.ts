import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';
import { prisma, seedDatabase } from '@revenueshield/database';

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
