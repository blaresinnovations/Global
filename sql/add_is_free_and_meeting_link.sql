-- Migration: add is_free to courses and meeting_link to lessons
ALTER TABLE IF EXISTS courses
  ADD COLUMN IF NOT EXISTS is_free TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE IF EXISTS lessons
  ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(512) DEFAULT NULL;
