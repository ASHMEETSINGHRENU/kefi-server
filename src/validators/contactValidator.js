export const validateContactInput = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Please enter your name.');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 8) {
    errors.push('Please enter a valid phone number.');
  }

  if (data.email && typeof data.email === 'string' && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push('Please enter a valid email address.');
    }
  }

  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length < 2) {
    errors.push('Please enter a subject.');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Please enter a message (at least 10 characters).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
