-- Create products table
CREATE TABLE IF NOT EXISTS app.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT,
    main_image_url TEXT,
    images TEXT[] DEFAULT '{}',
    available_sizes TEXT[] DEFAULT '{}',
    available_colors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE app.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Products are viewable by everyone" ON app.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON app.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON app.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON app.products;

-- Everyone can view products (public access for e-commerce)
CREATE POLICY "Products are viewable by everyone" ON app.products
    FOR SELECT USING (true);

-- Only authenticated users can insert products (you can restrict this further to admin role)
CREATE POLICY "Authenticated users can insert products" ON app.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update products (you can restrict this further to admin role)
CREATE POLICY "Authenticated users can update products" ON app.products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete products (you can restrict this further to admin role)
CREATE POLICY "Authenticated users can delete products" ON app.products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_products_updated_at
    BEFORE UPDATE ON app.products
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON app.products(name);
CREATE INDEX IF NOT EXISTS idx_products_amount ON app.products(amount);
CREATE INDEX IF NOT EXISTS idx_products_currency ON app.products(currency);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON app.products(created_at);

-- Add comments to describe the table and columns
COMMENT ON TABLE app.products IS 'Stores product information for the e-commerce platform';
COMMENT ON COLUMN app.products.id IS 'Unique identifier for the product';
COMMENT ON COLUMN app.products.name IS 'Product name';
COMMENT ON COLUMN app.products.amount IS 'Product price';
COMMENT ON COLUMN app.products.currency IS 'Currency code (e.g., USD, EUR, GBP)';
COMMENT ON COLUMN app.products.description IS 'Detailed product description';
COMMENT ON COLUMN app.products.main_image_url IS 'URL of the main product image';
COMMENT ON COLUMN app.products.images IS 'Array of additional product image URLs';
COMMENT ON COLUMN app.products.available_sizes IS 'Array of available sizes (e.g., S, M, L, XL)';
COMMENT ON COLUMN app.products.available_colors IS 'Array of available colors';

