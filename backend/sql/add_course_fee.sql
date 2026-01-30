-- Add fee column to courses table
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) NOT NULL DEFAULT 0;
