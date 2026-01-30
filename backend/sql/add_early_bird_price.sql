-- Add early bird offer price to courses table
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS early_bird_price DECIMAL(10, 2) NULL;

-- If your MySQL version doesn't support IF NOT EXISTS for ALTER, run this individually:
-- ALTER TABLE courses ADD COLUMN early_bird_price DECIMAL(10, 2) NULL;
