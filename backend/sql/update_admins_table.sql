-- Add username column and update role enum for admins table
ALTER TABLE admins 
ADD COLUMN username VARCHAR(255) UNIQUE AFTER email,
MODIFY COLUMN role ENUM('Super Admin','Admin','Staff') NOT NULL DEFAULT 'Staff';

-- Create an index for username for faster lookups
CREATE INDEX idx_admins_username ON admins(username);
