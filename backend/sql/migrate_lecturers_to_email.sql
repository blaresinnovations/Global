-- Migration: add `email` column, preserve existing `nic` values, then remove `nic` and `description`
-- Run on your MySQL server connected to the `global_gate` database.

-- 1) Add nullable email column
ALTER TABLE lecturers
  ADD COLUMN email VARCHAR(255) NULL;

-- 2) Copy existing NIC values into email where present
UPDATE lecturers
  SET email = nic
  WHERE nic IS NOT NULL AND (email IS NULL OR email = '');

-- 3) Drop old columns (description may already be absent in newer DDL)
ALTER TABLE lecturers
  DROP COLUMN nic,
  DROP COLUMN description;

-- 4) Make email NOT NULL if you want to enforce it (optional)
ALTER TABLE lecturers
  MODIFY COLUMN email VARCHAR(255) NOT NULL;

-- Note: DDL statements may cause implicit commits; review and run in a safe maintenance window.
