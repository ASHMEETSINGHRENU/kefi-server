import express from 'express';
import { createEnquiry } from '../controllers/enquiryController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/enquiries - Submit custom outfit enquiry
router.post('/', submissionLimiter, createEnquiry);

export default router;
