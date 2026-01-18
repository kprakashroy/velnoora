/**
 * Product categories for the e-commerce application
 * Used in product creation and filtering
 */
export const PRODUCT_CATEGORIES = [
  'T-Shirts',
  'Jeans',
  'Dresses',
  'Shirts',
  'Pants',
  'Shorts',
  'Skirts',
  'Jackets',
  'Coats',
  'Sweaters',
  'Hoodies',
  'Sweatshirts',
  'Tank Tops',
  'Blouses',
  'Suits',
  'Activewear',
  'Swimwear',
  'Underwear',
  'Socks',
  'Accessories',
  'Shoes',
  'Bags',
  'Jewelry',
  'Other',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
