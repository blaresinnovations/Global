-- Migration: add start_date and end_date to courses
-- Run against your `global_gate` database. Backup before running.

-- MySQL / MariaDB
USE global_gate;
START TRANSACTION;
-- inspect table
SHOW COLUMNS FROM courses LIKE 'start_date';
-- Add columns if they do not exist
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS start_date DATE NULL,
  ADD COLUMN IF NOT EXISTS end_date DATE NULL;
COMMIT;

-- Verify
SELECT id, name, start_date, end_date FROM courses ORDER BY id DESC LIMIT 20;

-- PostgreSQL (psql):
-- BEGIN;
-- ALTER TABLE courses ADD COLUMN IF NOT EXISTS start_date DATE;
-- ALTER TABLE courses ADD COLUMN IF NOT EXISTS end_date DATE;
-- COMMIT;
-- SELECT id, name, start_date, end_date FROM courses ORDER BY id DESC LIMIT 20;

-- IMPORTANT: Some older MySQL versions do not support IF NOT EXISTS in ALTER TABLE column addition. Remove the IF NOT EXISTS if your MySQL doesn't support it, or wrap with conditional checks.
