/*
  # Combined Migration: Contact Submissions, Users, Profiles

  This migration creates the following tables:
    - contact_submissions
    - users
    - profiles

  It sets up Row Level Security (RLS) and appropriate policies, as well as indexes and triggers for all three tables.
*/

-- 1. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  ip_address text,
  user_agent text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Function to send email via HTTP request (requires http extension)
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  response json;
BEGIN
  -- Replace with your email API endpoint and payload
  PERFORM http_post(
    'https://YOUR_EMAIL_API_ENDPOINT',
    json_build_object(
      'to', 'YOUR_EMAIL@example.com',
      'subject', 'New Contact Submission',
      'text', 'Name: ' || NEW.name || E'\nEmail: ' || NEW.email || E'\nMessage: ' || NEW.message
    )::text,
    'application/json'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to send email on new contact submission
CREATE TRIGGER trigger_notify_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();

-- Enable RLS on contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for admin/all authenticated users to read all contact submissions
CREATE POLICY "Admin can read all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for contact_submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_created 
  ON contact_submissions(ip_address, created_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON contact_submissions(status);

-- 2. Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text,
  avatar_url text
);

-- 3. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  username text UNIQUE,
  bio text,
  website text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users and profiles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Indexes for users and profiles
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- RLS Policies for users table
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own account"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for profiles table
CREATE POLICY "Anyone can read public profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create a profile when a user is created
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, LOWER(REPLACE(NEW.email, '@', '_at_')));
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically create profile when user is created
CREATE TRIGGER create_profile_on_user_creation
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();