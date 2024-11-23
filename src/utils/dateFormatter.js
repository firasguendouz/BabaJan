/**
 * Formats a date string into a readable format.
 * @param {string|Date} date - The date to format.
 * @param {object} options - Intl.DateTimeFormat options.
 * @returns {string} The formatted date.
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
  };
  
  /**
   * Formats a date into a short format (MM/DD/YYYY).
   * @param {string|Date} date - The date to format.
   * @returns {string} The formatted date.
   */
  export const formatShortDate = (date) =>
    formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
  
  /**
   * Formats a time string into a 12-hour format with AM/PM.
   * @param {string|Date} time - The time to format.
   * @returns {string} The formatted time.
   */
  export const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(time));
  };
  