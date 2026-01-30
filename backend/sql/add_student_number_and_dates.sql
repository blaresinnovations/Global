-- Add student_number to students and start/end dates to student_courses if missing
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_number VARCHAR(20) DEFAULT NULL;
ALTER TABLE student_courses ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE student_courses ADD COLUMN IF NOT EXISTS end_date DATE;
