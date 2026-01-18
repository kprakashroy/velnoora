-- Add category column to products table
ALTER TABLE app.products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add index for category column for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON app.products(category);

-- Add comment
COMMENT ON COLUMN app.products.category IS 'Product category (e.g., T-Shirts, Jeans, Dresses, etc.)';

-- Update existing products with a default category if needed
-- You can uncomment and modify this if you want to set a default category for existing products
-- UPDATE app.products SET category = 'General' WHERE category IS NULL;
