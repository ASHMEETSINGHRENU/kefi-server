export const validateEnquiryInput = (data) => {
  const errors = [];

  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.push('Please enter your full name (at least 2 characters).');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 8) {
    errors.push('Please enter a valid phone or WhatsApp number.');
  }

  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push('Please enter a valid email address.');
    }
  }

  const validCollections = ["Women's Wear", "Men's Wear", "Occasion Wear", "Bridal Couture", "Other / Couple Ensemble"];
  if (!data.collectionType || !validCollections.includes(data.collectionType)) {
    errors.push('Please select a valid collection.');
  }

  if (!data.outfitCategory || typeof data.outfitCategory !== 'string' || data.outfitCategory.trim().length === 0) {
    errors.push('Please select an outfit category.');
  }

  if (!data.occasion || typeof data.occasion !== 'string' || data.occasion.trim().length === 0) {
    errors.push('Please select or specify the occasion.');
  }

  if (!data.budgetRange || typeof data.budgetRange !== 'string' || data.budgetRange.trim().length === 0) {
    errors.push('Please choose a budget range.');
  }

  if (!data.requiredDate || typeof data.requiredDate !== 'string' || data.requiredDate.trim().length === 0) {
    errors.push('Please provide your required completion or occasion date.');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push('Please provide a brief description of your desired outfit (at least 10 characters).');
  }

  if (data.consentToContact !== true && data.consentToContact !== 'true') {
    errors.push('Consent to be contacted regarding your design request is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
