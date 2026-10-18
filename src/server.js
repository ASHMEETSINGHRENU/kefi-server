import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Start server after attempting DB connection
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[KEFI Server] Running on http://localhost:${PORT}`);
    console.log(`[KEFI Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
