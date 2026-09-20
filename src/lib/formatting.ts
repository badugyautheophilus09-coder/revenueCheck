export const CURRENCIES = {
  'GH₵': 'GHS',
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '₦': 'NGN'
} as const;

export type CurrencySymbol = keyof typeof CURRENCIES;

export function formatCurrency(amount: number, currency: string = 'GH₵'): string {
  if (isNaN(amount) || amount === 0) {
    return `${currency} 0.00`;
  }
  
  // Format with commas and 2 decimal places
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${currency} ${formatted}`;
}

export function formatNumber(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return '0';
  }
  
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

export function formatDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long'
  });
}

export function formatShortDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short'
  });
}

export function formatWeekRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} – ${end}`;
}

export function parseCurrencyInput(value: string): number {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  if (cleaned === '' || cleaned === '.') {
    return 0;
  }
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function isValidRevenueInput(value: string): boolean {
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  if (cleaned === '' || cleaned === '.') {
    return true; // Empty or just decimal point is valid (will be treated as 0)
  }
  
  const parsed = parseFloat(cleaned);
  
  // Check if it's a valid non-negative number
  if (isNaN(parsed) || parsed < 0) {
    return false;
  }
  
  // Check for multiple decimal points
  const decimalPoints = (cleaned.match(/\./g) || []).length;
  if (decimalPoints > 1) {
    return false;
  }
  
  return true;
}

export function formatRevenueInput(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  if (cleaned === '' || cleaned === '.') {
    return cleaned;
  }
  
  const parts = cleaned.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Reconstruct with decimal part if exists
  if (decimalPart) {
    return `${formattedInteger}.${decimalPart}`;
  }
  
  return formattedInteger;
}