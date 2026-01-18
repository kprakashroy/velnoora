-- Add admin column to user_profiles table
ALTER TABLE app.user_profiles 
ADD COLUMN IF NOT EXISTS admin BOOLEAN DEFAULT false;

-- Add index for admin column for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON app.user_profiles(admin);

-- Update products policies to only allow admin users to insert, update, and delete
DROP POLICY IF EXISTS "Authenticated users can insert products" ON app.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON app.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON app.products;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION app.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM app.user_profiles
        WHERE id = auth.uid() AND admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admin users can insert products
CREATE POLICY "Only admins can insert products" ON app.products
    FOR INSERT WITH CHECK (app.is_admin());

-- Only admin users can update products
CREATE POLICY "Only admins can update products" ON app.products
    FOR UPDATE USING (app.is_admin());

-- Only admin users can delete products
CREATE POLICY "Only admins can delete products" ON app.products
    FOR DELETE USING (app.is_admin());

-- Add comment
COMMENT ON COLUMN app.user_profiles.admin IS 'Indicates if user has admin privileges (can manage products)';

