import { format, isValid, parseISO } from 'date-fns';

/**
 * Safely parse and format a date string.
 * @param {string | Date} date - The date to format.
 * @param {string} dateFormat - The desired date format.
 * @returns {string} Formatted date or 'Invalid Date'.
 */
const safeFormatDate = (date, dateFormat) => {
  try {
    // Check if the date exists and is valid
    if (!date) {
      return 'N/A';
    }
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      console.warn('Invalid date passed to safeFormatDate:', date);
      return 'Invalid Date';
    }
    return format(parsedDate, dateFormat);
  } catch (error) {
    console.warn('Error formatting date:', error.message);
    return 'Invalid Date';
  }
};

/**
 * Format a date to 'MM/dd/yyyy'.
 * @param {string | Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date) => {
  return safeFormatDate(date, 'MM/dd/yyyy');
};

/**
 * Format a date and time to 'MM/dd/yyyy HH:mm'.
 * @param {string | Date} date - The date to format.
 * @returns {string} Formatted date-time string.
 */
export const formatDateTime = (date) => {
  return safeFormatDate(date, 'MM/dd/yyyy HH:mm');
};

/**
 * Calculate how much time has passed since the given date.
 * @param {string | Date} date - The date to compare with the current time.
 * @returns {string} A human-readable time difference (e.g., '2 hours ago').
 */
export const timeAgo = (date) => {
  if (!date) return 'N/A';

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.warn('Invalid date passed to timeAgo:', date);
      return 'Invalid Date';
    }

    const seconds = Math.floor((new Date() - parsedDate) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  } catch (error) {
    console.warn('Error in timeAgo:', error.message);
    return 'Invalid Date';
  }
};
