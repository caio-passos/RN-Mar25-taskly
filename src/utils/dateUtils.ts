export const API_DATE_FORMAT = 'dd/MM/yyyy';

export function isValidDateString(dateStr: string, format = API_DATE_FORMAT): boolean {
  const trimmedDateStr = dateStr.trim();
  if (format === 'dd/MM/yyyy') {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(trimmedDateStr);
  }
  return false;
}

export function sanitizeDateString(dateStr: string): string {
  return dateStr.trim().replace(/\s+/g, '');
}

export function formatDateForAPI(date: Date | string): string {
  if (typeof date === 'string') {
    if (isValidDateString(date)) return date;
    date = new Date(date);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

export function parseAPIDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function sanitizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, ''); 
}
