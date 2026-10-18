import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Enquiry } from './models/Enquiry.js';
import { Contact } from './models/Contact.js';
import { initialProducts } from './controllers/productController.js';
import { inMemoryEnquiries } from './controllers/enquiryController.js';
import { inMemoryContacts } from './controllers/contactController.js';

const seedAtlas = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in environment.');
    process.exit(1);
  }

  console.log('[Seed] Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log(`[Seed] Connected to: ${mongoose.connection.host} / DB: ${mongoose.connection.name}`);

    // Seed Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      console.log(`[Seed] Seeding ${initialProducts.length} initial products...`);
      const sanitizedProducts = initialProducts.map(({ _id, ...rest }) => rest);
      await Product.insertMany(sanitizedProducts);
      console.log(`[Seed] Products seeded successfully.`);
    } else {
      console.log(`[Seed] Products collection already contains ${prodCount} documents.`);
    }

    // Seed Enquiries
    const enqCount = await Enquiry.countDocuments();
    if (enqCount === 0) {
      console.log(`[Seed] Seeding ${inMemoryEnquiries.length} sample custom enquiries...`);
      const sanitizedEnquiries = inMemoryEnquiries.map(({ _id, ...rest }) => rest);
      await Enquiry.insertMany(sanitizedEnquiries);
      console.log(`[Seed] Enquiries seeded successfully.`);
    } else {
      console.log(`[Seed] Enquiries collection already contains ${enqCount} documents.`);
    }

    // Seed Contacts
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      console.log(`[Seed] Seeding ${inMemoryContacts.length} initial contact messages...`);
      const sanitizedContacts = inMemoryContacts.map(({ _id, ...rest }) => rest);
      await Contact.insertMany(sanitizedContacts);
      console.log(`[Seed] Contacts seeded successfully.`);
    } else {
      console.log(`[Seed] Contacts collection already contains ${contactCount} documents.`);
    }

    const finalProds = await Product.countDocuments();
    const finalEnqs = await Enquiry.countDocuments();
    const finalContacts = await Contact.countDocuments();

    console.log('\n--- Atlas Verification Summary ---');
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Total Products: ${finalProds}`);
    console.log(`Total Enquiries: ${finalEnqs}`);
    console.log(`Total Contacts: ${finalContacts}`);
    console.log('----------------------------------\n');

    await mongoose.disconnect();
    console.log('[Seed] Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedAtlas();
