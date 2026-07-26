import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateStr?: string | Date, formatPattern = 'dd MMM yyyy'): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(date) ? format(date, formatPattern) : 'N/A';
  } catch {
    return 'N/A';
  }
};

export const formatDateTime = (dateStr?: string | Date): string => {
  return formatDate(dateStr, 'dd MMM yyyy, hh:mm a');
};
