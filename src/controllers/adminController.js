import { Enquiry } from '../models/Enquiry.js';
import { Contact } from '../models/Contact.js';
import { Product } from '../models/Product.js';
import { getDBStatus } from '../config/db.js';
import { inMemoryEnquiries } from './enquiryController.js';
import { inMemoryContacts } from './contactController.js';
import { inMemoryProducts } from './productController.js';

// Preconfigured admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@kefi.com',
  password: 'admin123',
  name: 'Mukta',
  role: 'Master Admin / Founder',
  studio: 'Parasia Atelier, Madhya Pradesh',
};

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both admin email and password.',
      });
    }

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password.trim() === ADMIN_CREDENTIALS.password
    ) {
      // Create a lightweight session token
      const token = 'kefi_admin_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      return res.json({
        success: true,
        message: 'Admin authentication successful. Welcome, Mukta.',
        token,
        admin: {
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: ADMIN_CREDENTIALS.role,
          studio: ADMIN_CREDENTIALS.studio,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials. Please check your email and password.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    let totalProducts = 0;
    let activeProducts = 0;
    let totalEnquiries = 0;
    let activeEnquiries = 0;
    let totalMessages = 0;
    let newMessages = 0;

    if (dbStatus.connected) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(initialProducts.map(({ _id, ...rest }) => rest));
      }
      totalProducts = await Product.countDocuments();
      activeProducts = await Product.countDocuments({ status: 'Active' });
      totalEnquiries = await Enquiry.countDocuments();
      activeEnquiries = await Enquiry.countDocuments({ status: { $in: ['Received', 'Consultation Scheduled', 'In Production'] } });
      totalMessages = await Contact.countDocuments();
      newMessages = await Contact.countDocuments({ status: 'New' });
    } else {
      totalProducts = inMemoryProducts.length;
      activeProducts = inMemoryProducts.filter((p) => p.status === 'Active').length;
      totalEnquiries = inMemoryEnquiries.length;
      activeEnquiries = inMemoryEnquiries.filter((e) => ['Received', 'Consultation Scheduled', 'In Production'].includes(e.status)).length;
      totalMessages = inMemoryContacts.length;
      newMessages = inMemoryContacts.filter((c) => c.status === 'New').length;
    }

    return res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalEnquiries,
        activeEnquiries,
        totalMessages,
        newMessages,
        totalCustomers: totalEnquiries + totalMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/enquiries
export const getAdminEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { outfitCategory: { $regex: search, $options: 'i' } },
        ];
      }
      const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: enquiries.length, enquiries });
    }

    let list = [...inMemoryEnquiries];
    if (status && status !== 'All') {
      list = list.filter((e) => e.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(s) ||
          e.phone.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s) ||
          e.outfitCategory.toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, count: list.length, enquiries: list });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/enquiries/:id/status
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Received',
      'Consultation Scheduled',
      'Fabric Sourced',
      'Pattern Making',
      'In Production',
      'Fitting Scheduled',
      'Completed',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry status value' });
    }

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const updated = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Enquiry record not found' });
      }
      return res.json({ success: true, message: 'Enquiry status updated successfully', enquiry: updated });
    }

    const enq = inMemoryEnquiries.find((e) => e._id === id);
    if (!enq) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }
    enq.status = status;
    enq.updatedAt = new Date().toISOString();

    return res.json({ success: true, message: 'Enquiry status updated successfully', enquiry: enq });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/enquiries/:id
export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await Enquiry.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Enquiry deleted successfully.' });
    }

    const idx = inMemoryEnquiries.findIndex((e) => e._id === id);
    if (idx !== -1) {
      inMemoryEnquiries.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/contacts
export const getAdminContacts = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: contacts.length, contacts });
    }

    const contacts = [...inMemoryContacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/contacts/:id/status
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, contact: updated });
    }

    const msg = inMemoryContacts.find((c) => c._id === id);
    if (msg) {
      msg.status = status;
    }
    return res.json({ success: true, contact: msg });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/customers
export const getAdminCustomers = async (req, res, next) => {
  try {
    // Generate customer directory from enquiries and contact queries
    const customerMap = new Map();

    const dbStatus = getDBStatus();
    let enquiriesList = [];
    let contactsList = [];

    if (dbStatus.connected) {
      enquiriesList = await Enquiry.find().lean();
      contactsList = await Contact.find().lean();
    } else {
      enquiriesList = inMemoryEnquiries;
      contactsList = inMemoryContacts;
    }

    enquiriesList.forEach((e) => {
      const key = (e.phone || e.email || e.fullName).toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: 'cust_' + Math.abs(key.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
          fullName: e.fullName,
          phone: e.phone,
          email: e.email || 'N/A',
          city: e.shippingCity || 'Parasia / MP',
          totalEnquiries: 1,
          latestOccasion: e.occasion,
          latestStatus: e.status,
          lastActive: e.createdAt,
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalEnquiries += 1;
        if (new Date(e.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = e.createdAt;
          existing.latestOccasion = e.occasion;
          existing.latestStatus = e.status;
        }
      }
    });

    contactsList.forEach((c) => {
      const key = (c.phone || c.email || c.name).toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: 'cust_' + Math.abs(key.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
          fullName: c.name,
          phone: c.phone,
          email: c.email || 'N/A',
          city: 'Client Enquiry',
          totalEnquiries: 0,
          latestOccasion: c.subject,
          latestStatus: 'Contact Message',
          lastActive: c.createdAt,
        });
      }
    });

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastActive) - new Date(a.lastActive)
    );

    return res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};
