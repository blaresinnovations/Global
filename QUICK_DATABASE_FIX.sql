-- Quick fix for student_courses table - add missing payment columns
-- Run this if migrations don't work

ALTER TABLE student_courses 
ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(50) DEFAULT 'full' AFTER payment_status;

ALTER TABLE student_courses 
ADD COLUMN IF NOT EXISTS order_id VARCHAR(100) AFTER payment_plan;

-- Optional: Add index for performance
ALTER TABLE student_courses 
ADD INDEX IF NOT EXISTS idx_order_id (order_id);

-- Verify the changes
DESC student_courses;
