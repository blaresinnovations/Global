-- Add missing columns to student_courses table for card payment support
ALTER TABLE student_courses 
ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(50) DEFAULT 'full' AFTER payment_status,
ADD COLUMN IF NOT EXISTS order_id VARCHAR(100) AFTER payment_plan;

-- Add index for order_id for faster lookups
ALTER TABLE student_courses 
ADD INDEX IF NOT EXISTS idx_order_id (order_id);
