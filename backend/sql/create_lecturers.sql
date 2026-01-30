-- Create lecturers table and mapping table for global_gate database

CREATE TABLE IF NOT EXISTS lecturers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32) DEFAULT NULL,
  photo_path VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lecturer_courses (
  lecturer_id INT UNSIGNED NOT NULL,
  course_id INT NOT NULL,
  PRIMARY KEY (lecturer_id, course_id),
  CONSTRAINT fk_lecturer FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
  CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: ensure courses table exists (if your existing schema already has it, skip)
--
-- CREATE TABLE IF NOT EXISTS courses (
--   id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   duration VARCHAR(128) DEFAULT NULL,
--   description TEXT DEFAULT NULL,
--   banner_path VARCHAR(255) DEFAULT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
