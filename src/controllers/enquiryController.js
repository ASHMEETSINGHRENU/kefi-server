import { Enquiry } from '../models/Enquiry.js';
import { validateEnquiryInput } from '../validators/enquiryValidator.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback repository in case MongoDB is offline during local run
export let inMemoryEnquiries = [
  {
    _id: 'enq_1001',
    fullName: 'Ananya Sharma',
    phone: '+91 98234 56789',
    email: 'ananya.sharma@example.com',
    collectionType: "Women's Wear",
    outfitCategory: 'Bridal Lehenga',
    occasion: 'Wedding Day Reception',
    preferredStyle: 'Traditional Zardozi with modern pastel tones',
    preferredColours: 'Rose Gold and Dusty Blush',
    budgetRange: '₹60,000 – ₹1,00,000',
    requiredDate: '2026-12-15',
    measurementsNotes: 'Blouse 36, Waist 30, Height 5ft 6in with heels',
    description: 'Looking for a regal hand-embroidered lehenga with lightweight flair and double dupatta for winter evening reception.',
    referenceImageUrl: 'https://shobitam.com/cdn/shop/files/KF-29Pink_4.jpg?v=1740989894&width=1800',
    shippingCity: 'Indore',
    shippingCountry: 'India',
    consentToContact: true,
    status: 'Consultation Scheduled',
    createdAt: new Date('2026-10-14T10:30:00Z').toISOString(),
    updatedAt: new Date('2026-10-15T14:20:00Z').toISOString(),
  },
  {
    _id: 'enq_1002',
    fullName: 'Rohan Mehra',
    phone: '+91 97112 34567',
    email: 'rohan.mehra@example.com',
    collectionType: "Men's Wear",
    outfitCategory: 'Bandhgala Suit',
    occasion: 'Brother’s Sangeet',
    preferredStyle: 'Minimalist luxury silk with bespoke buttons',
    preferredColours: 'Charcoal & Antique Brass',
    budgetRange: '₹35,000 – ₹60,000',
    requiredDate: '2026-11-20',
    measurementsNotes: 'Chest 40, Shoulder 18.5, Sleeve 25',
    description: 'Need a sharp tailored bandhgala with subtle tonal hand-embroidery along collar and cuffs.',
    referenceImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT559tSwVGGK-dTqcihccqlg-9WRFeiMgKv3ybetqp23g&s=10',
    shippingCity: 'Bhopal',
    shippingCountry: 'India',
    consentToContact: true,
    status: 'In Production',
    createdAt: new Date('2026-10-15T09:15:00Z').toISOString(),
    updatedAt: new Date('2026-10-16T11:45:00Z').toISOString(),
  },
  {
    _id: 'enq_1003',
    fullName: 'Pooja Verma',
    phone: '+91 94250 88990',
    email: 'pooja.verma@example.com',
    collectionType: 'Occasion Wear',
    outfitCategory: 'Festive Anarkali',
    occasion: 'Diwali & Family Reunion',
    preferredStyle: 'Flared Georgette with fine gota-patti',
    preferredColours: 'Blush Pink & Peach',
    budgetRange: '₹20,000 – ₹35,000',
    requiredDate: '2026-11-05',
    measurementsNotes: 'Standard Medium with 4 inch comfort margin',
    description: 'Festive floor length suit with scalloped dupatta and lightweight sleeves.',
    referenceImageUrl: 'https://media.gettyimages.com/id/1774538452/photo/woman-looking-through-sieve-during-karva-chauth-ceremony.jpg?s=612x612&w=0&k=20&c=D3uohkQ1QHRXTLkNxSg2_1ahicAfky3GcPKOSgeXAog=',
    shippingCity: 'Chhindwara',
    shippingCountry: 'India',
    consentToContact: true,
    status: 'Received',
    createdAt: new Date('2026-10-16T16:00:00Z').toISOString(),
    updatedAt: new Date('2026-10-16T16:00:00Z').toISOString(),
  },
];

export const createEnquiry = async (req, res, next) => {
  try {
    const { isValid, errors } = validateEnquiryInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Please review and complete all required fields.',
        errors,
      });
    }

    const {
      fullName,
      phone,
      email,
      collectionType,
      outfitCategory,
      occasion,
      preferredStyle,
      preferredColours,
      budgetRange,
      requiredDate,
      measurementsNotes,
      description,
      referenceImageUrl,
      shippingCity,
      shippingCountry,
      consentToContact,
    } = req.body;

    const enquiryPayload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      collectionType,
      outfitCategory: outfitCategory.trim(),
      occasion: occasion.trim(),
      preferredStyle: preferredStyle ? preferredStyle.trim() : '',
      preferredColours: preferredColours ? preferredColours.trim() : '',
      budgetRange: budgetRange.trim(),
      requiredDate: requiredDate.trim(),
      measurementsNotes: measurementsNotes ? measurementsNotes.trim() : '',
      description: description.trim(),
      referenceImageUrl: referenceImageUrl ? referenceImageUrl.trim() : '',
      shippingCity: shippingCity ? shippingCity.trim() : '',
      shippingCountry: shippingCountry ? shippingCountry.trim() : 'India',
      consentToContact: Boolean(consentToContact),
      status: 'Received',
    };

    let savedEnquiry = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      savedEnquiry = await Enquiry.create(enquiryPayload);
    } else {
      // In-memory fallback
      const fallbackRecord = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        ...enquiryPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryEnquiries.push(fallbackRecord);
      savedEnquiry = fallbackRecord;
      console.log(`[Enquiry] Stored in local repository (${inMemoryEnquiries.length} total entries).`);
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for sharing your vision with KEFI BY MUKTA. Your enquiry has been received. We'll be in touch to discuss your design requirements.",
      referenceId: savedEnquiry._id,
    });
  } catch (error) {
    next(error);
  }
};
