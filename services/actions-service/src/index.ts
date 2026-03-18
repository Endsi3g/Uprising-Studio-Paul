import express from 'express';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

import clientRoutes from './routes/clients';
import projectRoutes from './routes/projects';
import invoiceRoutes from './routes/invoices';
import activityRoutes from './routes/activities';
import briefingRoutes from './routes/briefings';
import ollamaRoutes from './routes/ollama';
import healthRoutes from './routes/health';

dotenv.config({ path: '../../.env' });

// ─── Sentry ─────────────────────────────────────────────────
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5,
  });
  console.log('✅ Sentry initialisé');
}

const app = express();
const PORT = process.env.ACTIONS_PORT || 4000;

// ─── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS simple (en dev)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/briefings', briefingRoutes);
app.use('/api/ollama', ollamaRoutes);

// ─── Error handler ──────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error:', err.message);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
});

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Actions Service démarré sur le port ${PORT}`);
  console.log(`📊 API disponible: http://localhost:${PORT}/api/health`);
});

export default app;
