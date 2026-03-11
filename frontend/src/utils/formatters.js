/**
 * Format a number as Indian Rupees currency string.
 * e.g. 1234567 → "₹12,34,567"
 */
export const formatCurrency = (value) => {
  if (value == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a decimal as a percentage string.
 * e.g. 12.34 → "12.34%"
 */
export const formatPercent = (value, decimals = 2) => {
  if (value == null) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format an ISO date string or Date object to a readable date.
 * e.g. "2025-03-15T10:00:00Z" → "15 Mar 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Truncate a long string to a given max length with ellipsis.
 */
export const truncate = (str, max = 120) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};
