import express from 'express';
import { createContact } from '../controllers/contactController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/contact - Submit general message
router.post('/', submissionLimiter, createContact);

export default router;
