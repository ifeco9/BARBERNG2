import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

// Format Nigerian phone numbers
export const formatNigerianPhoneNumber = (phoneNumber) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber, 'NG');
    return parsed.formatInternational();
  } catch (error) {
    return phoneNumber;
  }
};

// Validate Nigerian phone numbers
export const validateNigerianPhoneNumber = (phoneNumber) => {
  try {
    return isValidPhoneNumber(phoneNumber, 'NG');
  } catch (error) {
    return false;
  }
};

// Format for display (e.g., +234 812 345 6789)
export const formatPhoneForDisplay = (phoneNumber) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber, 'NG');
    return parsed.formatInternational();
  } catch (error) {
    return phoneNumber;
  }
};

// Format for API calls (e.g., +2348123456789)
export const formatPhoneForAPI = (phoneNumber) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber, 'NG');
    return parsed.format('E.164');
  } catch (error) {
    return phoneNumber;
  }
};