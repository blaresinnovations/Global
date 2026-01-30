-- Add seminar flag and meeting link to courses table
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS is_seminar TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(1024) NULL;

-- If your MySQL version doesn't support IF NOT EXISTS for ALTER, run these individually only when columns don't exist:
-- ALTER TABLE courses ADD COLUMN is_seminar TINYINT(1) NOT NULL DEFAULT 0;
-- ALTER TABLE courses ADD COLUMN meeting_link VARCHAR(1024) NULL;
