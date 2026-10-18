import { Contact } from '../models/Contact.js';
import { validateContactInput } from '../validators/contactValidator.js';
import { getDBStatus } from '../config/db.js';

export let inMemoryContacts = [
  {
    _id: 'msg_2001',
    name: 'Kavita Singhania',
    phone: '+91 91234 56780',
    email: 'kavita.s@example.com',
    subject: 'Bridal trousseau styling appointment',
    message: 'Hello Mukta, I would like to book an in-person studio visit at your Parasia atelier for my wedding in February 2027.',
    status: 'New',
    createdAt: new Date('2026-10-15T15:20:00Z').toISOString(),
  },
  {
    _id: 'msg_2002',
    name: 'Deepak Patel',
    phone: '+91 98980 12345',
    email: 'deepak.p@example.com',
    subject: 'International shipping query to London',
    message: 'Can you deliver a customised wedding sherwani and matching stoles to London within 4 weeks?',
    status: 'Read',
    createdAt: new Date('2026-10-16T11:00:00Z').toISOString(),
  },
];

export const createContact = async (req, res, next) => {
  try {
    const { isValid, errors } = validateContactInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Please review and complete all required fields.',
        errors,
      });
    }

    const { name, phone, email, subject, message } = req.body;

    const contactPayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'New',
    };

    let savedContact = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      savedContact = await Contact.create(contactPayload);
    } else {
      const fallbackRecord = {
        _id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        ...contactPayload,
        createdAt: new Date().toISOString(),
      };
      inMemoryContacts.push(fallbackRecord);
      savedContact = fallbackRecord;
      console.log(`[Contact] Stored in local repository (${inMemoryContacts.length} total entries).`);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to KEFI BY MUKTA. We have received your message and will respond shortly.',
      referenceId: savedContact._id,
    });
  } catch (error) {
    next(error);
  }
};
