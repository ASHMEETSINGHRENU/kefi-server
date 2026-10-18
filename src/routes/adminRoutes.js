import express from 'express';
import {
  adminLogin,
  getAdminStats,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getAdminContacts,
  updateContactStatus,
  getAdminCustomers,
} from '../controllers/adminController.js';

const router = express.Router();

// Public auth endpoint
router.post('/login', adminLogin);

// Protected admin endpoints
router.get('/stats', getAdminStats);
router.get('/enquiries', getAdminEnquiries);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.delete('/enquiries/:id', deleteEnquiry);

router.get('/contacts', getAdminContacts);
router.patch('/contacts/:id/status', updateContactStatus);

router.get('/customers', getAdminCustomers);

export default router;
