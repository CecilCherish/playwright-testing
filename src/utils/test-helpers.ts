/**
 * Utility functions for test assertions, price parsing, and data calculations.
 */

export function parsePrice(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    throw new Error(`Unable to parse price from string: "${priceText}"`);
  }
  return parsed;
}

export function calculateTax(subtotal: number, rate = 0.08): number {
  return Math.round(subtotal * rate * 100) / 100;
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function isSortedAscending(arr: string[] | number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

export function isSortedDescending(arr: string[] | number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
}

