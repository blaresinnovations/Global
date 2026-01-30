-- Add password reset columns to admin, lecturer_auth, and students tables

-- For admins table
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL AFTER password_hash;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL AFTER reset_token;

-- For lecturer_auth table
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE lecturer_auth ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;

-- For students table  
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME DEFAULT NULL;
