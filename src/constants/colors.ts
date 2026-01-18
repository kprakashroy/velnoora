/**
 * Available product colors for the e-commerce application
 * Includes basic colors, fashion colors, patterns, and special finishes
 */
export const PRODUCT_COLORS = [
  // Basic colors
  'Black',
  'White',
  'Gray',
  'Navy',
  'Brown',
  'Beige',
  'Khaki',

  // Primary colors
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',

  // Fashion colors
  'Maroon',
  'Burgundy',
  'Olive',
  'Teal',
  'Turquoise',
  'Coral',

  // Metallic colors
  'Gold',
  'Silver',
  'Rose Gold',
  'Copper',
  'Bronze',

  // Fabric patterns
  'Denim',
  'Chambray',
  'Striped',
  'Polka Dot',
  'Floral',
  'Plaid',

  // Special finishes
  'Multicolor',
  'Neon',
  'Pastel',
  'Vintage',
  'Metallic',
] as const;

export type ProductColor = (typeof PRODUCT_COLORS)[number];

/**
 * Color mapping for visual representation
 * Maps color names to their hex values or CSS gradients
 */
export const COLOR_MAP: Record<ProductColor, string> = {
  // Basic colors
  Black: '#000000',
  White: '#FFFFFF',
  Gray: '#808080',
  Navy: '#000080',
  Brown: '#8B4513',
  Beige: '#F5F5DC',
  Khaki: '#F0E68C',

  // Primary colors
  Red: '#FF0000',
  Blue: '#0000FF',
  Green: '#008000',
  Yellow: '#FFFF00',
  Orange: '#FFA500',
  Purple: '#800080',
  Pink: '#FFC0CB',

  // Fashion colors
  Maroon: '#800000',
  Burgundy: '#800020',
  Olive: '#808000',
  Teal: '#008080',
  Turquoise: '#40E0D0',
  Coral: '#FF7F50',

  // Metallic colors
  Gold: '#FFD700',
  Silver: '#C0C0C0',
  'Rose Gold': '#E8B4B8',
  Copper: '#B87333',
  Bronze: '#CD7F32',

  // Fabric patterns
  Denim: '#1560BD',
  Chambray: '#4A90E2',
  Striped:
    'linear-gradient(45deg, #FF0000 25%, #0000FF 25%, #0000FF 50%, #FF0000 50%, #FF0000 75%, #0000FF 75%)',
  'Polka Dot': 'radial-gradient(circle, #FF0000 20%, #FFFFFF 20%)',
  Floral: 'linear-gradient(45deg, #FF69B4, #98FB98, #FFB6C1)',
  Plaid:
    'linear-gradient(45deg, #8B0000 25%, #FFFFFF 25%, #FFFFFF 50%, #8B0000 50%, #8B0000 75%, #FFFFFF 75%)',

  // Special finishes
  Multicolor: 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF, #FFFF00)',
  Neon: '#00FFFF',
  Pastel: '#FFB6C1',
  Vintage: '#D2B48C',
  Metallic: 'linear-gradient(45deg, #C0C0C0, #FFD700)',
} as const;

/**
 * Color categories for better organization
 */
export const COLOR_CATEGORIES = {
  BASIC: ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige', 'Khaki'] as const,
  PRIMARY: [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Pink',
  ] as const,
  FASHION: [
    'Maroon',
    'Burgundy',
    'Olive',
    'Teal',
    'Turquoise',
    'Coral',
  ] as const,
  METALLIC: ['Gold', 'Silver', 'Rose Gold', 'Copper', 'Bronze'] as const,
  PATTERNS: [
    'Denim',
    'Chambray',
    'Striped',
    'Polka Dot',
    'Floral',
    'Plaid',
  ] as const,
  SPECIAL: ['Multicolor', 'Neon', 'Pastel', 'Vintage', 'Metallic'] as const,
} as const;

/**
 * Reverse mapping: hex code to color name
 */
export const HEX_TO_COLOR_NAME: Record<string, string> = Object.entries(
  COLOR_MAP,
).reduce((acc, [name, hex]) => {
  acc[hex.toLowerCase()] = name;
  return acc;
}, {} as Record<string, string>);

/**
 * Get color name from hex code
 */
export function getColorNameFromHex(hexCode: string): string {
  const normalizedHex = hexCode.toLowerCase().trim();
  return HEX_TO_COLOR_NAME[normalizedHex] || hexCode;
}

/**
 * Get hex code from color name
 */
export function getHexFromColorName(colorName: string): string {
  return COLOR_MAP[colorName as ProductColor] || colorName;
}

/**
 * Check if a string is a hex color code
 */
export function isHexColor(value: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || /^rgb\(/.test(value) || /^linear-gradient/.test(value) || /^radial-gradient/.test(value);
}
