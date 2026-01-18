// Currency symbols mapping
const CURRENCY_SYMBOLS: { [key: string]: string } = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'SEK': 'kr',
  'NOK': 'kr',
  'DKK': 'kr',
  'PLN': 'zł',
  'CZK': 'Kč',
  'HUF': 'Ft',
  'RUB': '₽',
  'BRL': 'R$',
  'MXN': '$',
  'KRW': '₩',
  'SGD': 'S$',
  'HKD': 'HK$',
  'NZD': 'NZ$',
  'ZAR': 'R',
  'TRY': '₺',
  'ILS': '₪',
  'AED': 'د.إ',
  'SAR': '﷼',
  'QAR': '﷼',
  'KWD': 'د.ك',
  'BHD': 'د.ب',
  'OMR': '﷼',
  'JOD': 'د.ا',
  'LBP': 'ل.ل',
  'EGP': '£',
  'MAD': 'د.م.',
  'TND': 'د.ت',
  'DZD': 'د.ج',
  'LYD': 'ل.د',
  'SDG': 'ج.س.',
  'ETB': 'ብር',
  'KES': 'KSh',
  'UGX': 'USh',
  'TZS': 'TSh',
  'ZMW': 'ZK',
  'BWP': 'P',
  'SZL': 'L',
  'LSL': 'L',
  'NAD': 'N$',
  'MUR': '₨',
  'SCR': '₨',
  'MVR': 'ރ',
  'LKR': '₨',
  'NPR': '₨',
  'BDT': '৳',
  'PKR': '₨',
  'AFN': '؋',
  'IRR': '﷼',
  'IQD': 'د.ع',
  'SYP': '£',
  'PAL': '₪',
};

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR', 'GBP')
 * @returns The currency symbol or the code itself if not found
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

/**
 * Format price with currency symbol
 * @param amount - The price amount
 * @param currency - The currency code
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: string, showDecimals: boolean = true): string {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = showDecimals ? amount.toFixed(2) : amount.toString();
  
  // For currencies that typically don't use decimals (like JPY, KRW)
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR'];
  if (noDecimalCurrencies.includes(currency)) {
    return `${symbol}${Math.round(amount)}`;
  }
  
  return `${symbol}${formattedAmount}`;
}

