-- Create students table for registrations
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_number VARCHAR(20) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  email VARCHAR(255),
  dob DATE,
  gender VARCHAR(20),
  nic VARCHAR(100),
  address TEXT,
  occupation VARCHAR(255),
  course_id INT,
  photo_path VARCHAR(500),
  bank_slip_path VARCHAR(500),
  payment_method VARCHAR(50) DEFAULT 'bank',
  payment_status VARCHAR(50) DEFAULT 'pending',
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_students_nic (nic),
  UNIQUE KEY uq_students_student_number (student_number),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
