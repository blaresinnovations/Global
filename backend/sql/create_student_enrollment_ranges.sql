-- Create table to store aggregated active enrollment ranges per student
CREATE TABLE IF NOT EXISTS student_enrollment_ranges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_student_range_student (student_id)
);
