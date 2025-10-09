-- Gallery Images table for Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL, -- Storage에 저장된 파일 경로
  alt TEXT NOT NULL DEFAULT '웨딩 사진',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read visible gallery images
CREATE POLICY "Anyone can read visible gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (is_visible = true);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_display_order 
  ON gallery_images(display_order ASC, created_at DESC);

-- Create an index for visibility
CREATE INDEX IF NOT EXISTS idx_gallery_visible 
  ON gallery_images(is_visible);

-- Sample data insertion (실제 이미지 업로드 후 경로 수정 필요)
INSERT INTO gallery_images (storage_path, alt, display_order) VALUES
  ('photo1.jpg', '웨딩 사진 1', 1),
  ('photo2.jpg', '웨딩 사진 2', 2),
  ('photo3.jpg', '웨딩 사진 3', 3),
  ('photo4.jpg', '웨딩 사진 4', 4);

