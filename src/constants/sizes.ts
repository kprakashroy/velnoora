/**
 * Available product sizes for the e-commerce application
 * Includes letter sizes, numeric sizes, dress sizes, and special sizes
 */
export const PRODUCT_SIZES = [
  // Letter sizes
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',

  // Numeric sizes (waist/inseam)
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',

  // Dress sizes
  '2',
  '4',
  '6',
  '8',
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '22',
  '24',

  // Special sizes
  'One Size',
  'Free Size',
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

/**
 * Size categories for better organization
 */
export const SIZE_CATEGORIES = {
  LETTER: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const,
  NUMERIC: [
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
  ] as const,
  DRESS: [
    '2',
    '4',
    '6',
    '8',
    '10',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
  ] as const,
  SPECIAL: ['One Size', 'Free Size'] as const,
} as const;
