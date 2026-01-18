-- Create checkout_products table (cart/checkout items)
CREATE TABLE IF NOT EXISTS app.checkout_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app.user_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES app.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
    selected_size TEXT,
    selected_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE app.checkout_products ENABLE ROW LEVEL SECURITY;

-- Create policies for checkout_products
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own checkout products" ON app.checkout_products;
DROP POLICY IF EXISTS "Users can insert own checkout products" ON app.checkout_products;
DROP POLICY IF EXISTS "Users can update own checkout products" ON app.checkout_products;
DROP POLICY IF EXISTS "Users can delete own checkout products" ON app.checkout_products;

-- Users can view their own checkout products
CREATE POLICY "Users can view own checkout products" ON app.checkout_products
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own checkout products
CREATE POLICY "Users can insert own checkout products" ON app.checkout_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own checkout products
CREATE POLICY "Users can update own checkout products" ON app.checkout_products
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own checkout products
CREATE POLICY "Users can delete own checkout products" ON app.checkout_products
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_checkout_products_updated_at
    BEFORE UPDATE ON app.checkout_products
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_products_user_id ON app.checkout_products(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_products_product_id ON app.checkout_products(product_id);
CREATE INDEX IF NOT EXISTS idx_checkout_products_user_product ON app.checkout_products(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_checkout_products_created_at ON app.checkout_products(created_at);

-- Add comments to describe the table and columns
COMMENT ON TABLE app.checkout_products IS 'Stores products added to user checkout/cart';
COMMENT ON COLUMN app.checkout_products.id IS 'Unique identifier for the checkout product row';
COMMENT ON COLUMN app.checkout_products.user_id IS 'Reference to the user who added this product to checkout';
COMMENT ON COLUMN app.checkout_products.product_id IS 'Reference to the product added to checkout';
COMMENT ON COLUMN app.checkout_products.quantity IS 'Quantity of this product in checkout';
COMMENT ON COLUMN app.checkout_products.selected_size IS 'Size selected by user for this product';
COMMENT ON COLUMN app.checkout_products.selected_color IS 'Color selected by user for this product';
COMMENT ON COLUMN app.checkout_products.created_at IS 'Timestamp when product was added to checkout';
COMMENT ON COLUMN app.checkout_products.updated_at IS 'Timestamp when checkout product was last updated';

