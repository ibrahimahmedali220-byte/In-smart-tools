/**
 * Centralized Currency and Number Formatter
 * Formats numbers in standard numbering system.
 * Example: 1000000 -> ₹10,00,000
 */

/**
 * Formats a number as Currency.
 * Defaults to 0 decimal places for clean display.
 */
export function formatINR(value: number, options?: { decimals?: number; showSymbol?: boolean }): string {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
    return options?.showSymbol !== false ? '₹0' : '0';
  }

  const decimals = options?.decimals ?? 0;
  const showSymbol = options?.showSymbol ?? true;

  // Use Intl.NumberFormat with formatted locale (en-IN)
  try {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return formatter.format(value);
  } catch {
    // Fallback if Intl is unavailable
    const rounded = Math.round(value);
    return (showSymbol ? '₹' : '') + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

/**
 * Formats large amounts into friendly compact denominations
 * Example: 1500000 -> "₹15 Lakh", 12500000 -> "₹1.25 Cr"
 */
export function formatINRCompact(value: number): string {
  if (isNaN(value) || !isFinite(value) || value === 0) return '₹0';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const lakh = abs / 100000;
    return `${sign}₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    return `${sign}₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }

  return formatINR(value);
}

/**
 * Safely parses a number from user text input, stripping currency symbols, commas, and invalid chars.
 */
export function parseNumberInput(input: string | number, fallback: number = 0): number {
  if (typeof input === 'number') {
    return isNaN(input) || !isFinite(input) ? fallback : input;
  }
  if (!input || typeof input !== 'string') return fallback;

  // Clean out currency symbol, commas, and spaces
  const clean = input.replace(/[₹,\s]/g, '').trim();
  const parsed = parseFloat(clean);
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
}
