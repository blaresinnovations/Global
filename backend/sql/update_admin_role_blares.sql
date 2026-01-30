-- Migration: update admin role to 'super admin' for a given email
-- Run this against the `global_gate` database.

-- MySQL / MariaDB:
USE global_gate;
START TRANSACTION;
-- inspect current row
SELECT * FROM admins WHERE email = 'blares.technologies@gmail.com';
-- perform update
UPDATE admins
SET role = 'super admin'
WHERE email = 'blares.technologies@gmail.com';
COMMIT;

-- PostgreSQL:
-- Connect to the database first: psql -d global_gate
-- Then run:
-- SELECT * FROM admins WHERE email = 'blares.technologies@gmail.com';
-- UPDATE admins SET role = 'super admin' WHERE email = 'blares.technologies@gmail.com';

-- IMPORTANT: Take a backup or run inside a transaction where supported before applying to production.
