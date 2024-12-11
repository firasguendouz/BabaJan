import { format, parseISO } from 'date-fns';

// Format a date to 'MM/dd/yyyy'
export const formatDate = (date) => {
  return format(parseISO(date), 'MM/dd/yyyy');
};

// Format date and time to 'MM/dd/yyyy HH:mm'
export const formatDateTime = (date) => {
  return format(parseISO(date), 'MM/dd/yyyy HH:mm');
};

// Calculate the time difference from now
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};
