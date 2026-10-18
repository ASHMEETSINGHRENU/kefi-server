import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone or WhatsApp number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    collectionType: {
      type: String,
      required: [true, 'Collection selection is required'],
      enum: ["Women's Wear", "Men's Wear", "Occasion Wear", "Bridal Couture", "Other / Couple Ensemble"],
    },
    outfitCategory: {
      type: String,
      required: [true, 'Outfit category is required'],
      trim: true,
    },
    occasion: {
      type: String,
      required: [true, 'Occasion is required'],
      trim: true,
    },
    preferredStyle: {
      type: String,
      trim: true,
      default: '',
    },
    preferredColours: {
      type: String,
      trim: true,
      default: '',
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      trim: true,
    },
    requiredDate: {
      type: String,
      required: [true, 'Event or required date is required'],
      trim: true,
    },
    measurementsNotes: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description of desired outfit is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    referenceImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    shippingCity: {
      type: String,
      trim: true,
      default: '',
    },
    shippingCountry: {
      type: String,
      trim: true,
      default: 'India',
    },
    consentToContact: {
      type: Boolean,
      required: [true, 'Consent to be contacted is required'],
      default: true,
    },
    status: {
      type: String,
      enum: [
        'Received',
        'Consultation Scheduled',
        'In Discussion',
        'Design In Progress',
        'Fabric Sourced',
        'Pattern Making',
        'In Production',
        'Fitting Scheduled',
        'Completed',
        'Cancelled',
        'Archived',
      ],
      default: 'Received',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
