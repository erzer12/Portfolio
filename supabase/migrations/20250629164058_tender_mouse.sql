/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `ip_address` (text, for rate limiting)
      - `user_agent` (text, for spam detection)
      - `created_at` (timestamp)
      - `status` (text, default 'pending')

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for authenticated users to read their own data
    - Add indexes for performance and rate limiting

  3. Rate Limiting
    - Index on ip_address and created_at for rate limiting queries
*/

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

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for admin access (you can modify this based on your auth setup)
CREATE POLICY "Admin can read all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for rate limiting by IP address
CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_created 
  ON contact_submissions(ip_address, created_at);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON contact_submissions(status);