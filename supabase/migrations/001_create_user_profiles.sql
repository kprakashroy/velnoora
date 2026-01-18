-- Create app schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS app;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS app.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE app.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user profiles
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON app.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON app.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON app.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON app.user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON app.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON app.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON app.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON app.user_profiles
    FOR DELETE USING (auth.uid() = id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION app.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO app.user_profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION app.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON app.user_profiles
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON app.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON app.user_profiles(created_at);

