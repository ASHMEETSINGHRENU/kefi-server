import express from 'express';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

// GET /api/health - System health check
router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  
  res.status(200).json({
    status: 'ok',
    service: 'KEFI BY MUKTA API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbStatus.connected,
      mode: dbStatus.connected ? 'mongodb' : 'in-memory-fallback',
      readyState: dbStatus.readyState,
    },
  });
});

export default router;
