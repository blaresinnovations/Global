-- Add status column to students table
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS `status` VARCHAR(30) NOT NULL DEFAULT 'pending';
