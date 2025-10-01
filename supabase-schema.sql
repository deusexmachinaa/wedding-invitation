-- Guestbook table schema for Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  is_groom BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better performance
  INDEX idx_created_at (created_at DESC)
);

-- Enable Row Level Security (RLS)
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read guestbook entries
CREATE POLICY "Anyone can read guestbook"
  ON guestbook
  FOR SELECT
  TO public
  USING (true);

-- Policy: Anyone can insert guestbook entries
CREATE POLICY "Anyone can insert guestbook"
  ON guestbook
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Optional: Add a function to prevent spam (limit entries per IP)
-- This would require additional setup with Edge Functions

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at 
  ON guestbook(created_at DESC);

