-- Add payment_plan column to student_courses to record chosen plan (monthly, 3-month, full)
ALTER TABLE student_courses ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(50) DEFAULT 'full';
