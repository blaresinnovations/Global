const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const photoDir = path.join(__dirname, '..', 'StudentPhoto');
const slipDir = path.join(__dirname, '..', 'BankSlip');
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
if (!fs.existsSync(slipDir)) fs.mkdirSync(slipDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo') cb(null, photoDir);
    else if (file.fieldname === 'bank_slip') cb(null, slipDir);
    else cb(null, photoDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const nodemailer = require('nodemailer');
const { requireAuth } = require('../middleware/auth');

async function generateStudentNumber(conn) {
  try {
    const [rows] = await conn.execute("SELECT MAX(CAST(SUBSTRING(student_number, 3) AS UNSIGNED)) AS maxn FROM students");
    const maxn = rows && rows[0] && rows[0].maxn ? parseInt(rows[0].maxn, 10) : 0;
    const next = maxn + 1;
    return 'GG' + String(next).padStart(5, '0');
  } catch (e) {
    return 'GG' + String(Date.now()).slice(-5);
  }
}


async function recomputeEnrollmentRange(conn, studentId) {
  // ensure start_date/end_date columns exist
  const [cols] = await conn.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'student_courses'", [process.env.DB_NAME]);
  const colNames = Array.isArray(cols) ? cols.map(c => c.COLUMN_NAME) : [];
  if (!colNames.includes('start_date') || !colNames.includes('end_date')) return;

  // compute active approved enrollments (not expired)
  const [r] = await conn.execute(
    `SELECT MIN(start_date) as mn, MAX(end_date) as mx FROM student_courses
     WHERE student_id = ? AND payment_status = 'approved' AND start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= CURDATE()`
    , [studentId]
  );
  const mn = r && r[0] ? r[0].mn : null;
  const mx = r && r[0] ? r[0].mx : null;
  if (!mn || !mx) {
    // if range table doesn't exist, skip
    const [tbls] = await conn.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'student_enrollment_ranges'", [process.env.DB_NAME]);
    if (Array.isArray(tbls) && tbls.length) {
      await conn.execute('DELETE FROM student_enrollment_ranges WHERE student_id = ?', [studentId]);
    }
    return;
  }
  const [tbls2] = await conn.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'student_enrollment_ranges'", [process.env.DB_NAME]);
  if (!Array.isArray(tbls2) || !tbls2.length) return;
  const [exist] = await conn.execute('SELECT id FROM student_enrollment_ranges WHERE student_id = ?', [studentId]);
  if (exist && exist[0]) {
    await conn.execute('UPDATE student_enrollment_ranges SET start_date = ?, end_date = ? WHERE student_id = ?', [mn, mx, studentId]);
  } else {
    await conn.execute('INSERT INTO student_enrollment_ranges (student_id, start_date, end_date) VALUES (?, ?, ?)', [studentId, mn, mx]);
  }
}

async function hasColumn(conn, table, column) {
  const [rows] = await conn.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?", [process.env.DB_NAME, table, column]);
  return Array.isArray(rows) && rows.length > 0;
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });
}

router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'bank_slip', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, mobile, email, dob, gender, nic, address, occupation, courseId, payment_method, payment_status } = req.body;

    const photoPath = req.files && req.files.photo && req.files.photo[0] ? `/StudentPhoto/${req.files.photo[0].filename}` : null;
    const bankSlipPath = req.files && req.files.bank_slip && req.files.bank_slip[0] ? `/BankSlip/${req.files.bank_slip[0].filename}` : null;

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    // Ensure NIC is unique
    if (nic) {
      const [existing] = await conn.execute('SELECT id FROM students WHERE nic = ?', [nic]);
      if (existing && existing[0]) { await conn.end(); return res.status(400).json({ error: 'NIC already exists' }); }
    }

    // Insert student record (handle schema differences if migrations not applied)
    const canHaveStudentNumber = await hasColumn(conn, 'students', 'student_number');
    let insertId;
    try {
      // Insert without student_number first; assign student_number derived from auto-increment id to avoid race conditions
      const [result] = await conn.execute(
        'INSERT INTO students (name, mobile, email, dob, gender, nic, address, occupation, photo_path, bank_slip_path, payment_method, payment_status, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name || null, mobile || null, email || null, dob || null, gender || null, nic || null, address || null, occupation || null, photoPath, bankSlipPath, payment_method || null, payment_status || null, 'approved']
      );
      insertId = result.insertId;

      // If student_number column exists, set it to GG + zero-padded id (GG00001 style)
      if (await hasColumn(conn, 'students', 'student_number')) {
        const sn = `GG${String(insertId).padStart(5, '0')}`;
        try {
          await conn.execute('UPDATE students SET student_number = ? WHERE id = ?', [sn, insertId]);
        } catch (uerr) { console.error('Failed to update student_number', uerr); }
      }
    } catch (ie) {
      console.error('Insert student fallback error', ie);
      await conn.end();
      return res.status(500).json({ error: 'Database error' });
    }

    // If a courseId was provided during registration, create an entry in student_courses
    if (courseId) {
      let pstatus = 'pending';
      if (payment_method === 'card' || payment_method === 'free') pstatus = 'approved';
      const start_date = req.body.start_date || null;
      const end_date = req.body.end_date || null;
      const hasDates = await hasColumn(conn, 'student_courses', 'start_date') && await hasColumn(conn, 'student_courses', 'end_date');
      try {
        if (hasDates) {
          await conn.execute(
            'INSERT INTO student_courses (student_id, course_id, start_date, end_date, bank_slip_path, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [insertId, courseId, start_date, end_date, bankSlipPath, payment_method || null, pstatus]
          );
        } else {
          await conn.execute(
            'INSERT INTO student_courses (student_id, course_id, bank_slip_path, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)',
            [insertId, courseId, bankSlipPath, payment_method || null, pstatus]
          );
        }
        if (pstatus === 'approved') {
          await recomputeEnrollmentRange(conn, insertId);
        }
      } catch (ce) {
        console.error('Insert student_course error', ce);
        // don't fail the whole registration if course insert fails; continue
      }
    }

    // send welcome email with credentials immediately (username=email, password=nic)
    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Global Gate - Registration Complete',
        text: `Hello ${name || ''},\n\nYour account has been created successfully.\n\nUsername: ${email}\nPassword: ${nic}\n\nYou can now login to the student portal.\n\nRegards,\nGlobal Gate`,
      });
    } catch (mailErr) {
      console.error('Mail send error (on register)', mailErr);
    }

    await conn.end();

    res.json({ id: insertId, photo_path: photoPath, bank_slip_path: bankSlipPath });
  } catch (err) {
    console.error('Student register error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// List students, optional ?status=pending|approved|declined or ?nic=NIC
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const nic = req.query.nic;
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    let q = 'SELECT s.*, c.name as course_name FROM students s LEFT JOIN courses c ON s.course_id = c.id';
    const params = [];
    const where = [];
    if (status) { where.push('s.status = ?'); params.push(status); }
    if (nic) { where.push('s.nic = ?'); params.push(nic); }
    if (where.length) q += ' WHERE ' + where.join(' AND ');
    q += ' ORDER BY s.created_at DESC';
    const [rows] = await conn.execute(q, params);

    // assign missing student_number values (retroactive) using id-based format GG00001
    try {
      for (const r of rows) {
        if (!r.student_number) {
          const sn = `GG${String(r.id).padStart(5, '0')}`;
          try { await conn.execute('UPDATE students SET student_number = ? WHERE id = ?', [sn, r.id]); } catch(e){ console.error('Assign student_number error', e); }
          r.student_number = sn;
        }
      }
    } catch (e) {
      console.error('Assign student_number error', e);
    }

    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Students list error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Approve student: sets status=approved and sends email with credentials (admin only)
router.put('/:id/approve', requireAuth('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT email, nic, name FROM students WHERE id = ?', [id]);
    if (!rows || !rows[0]) { await conn.end(); return res.status(404).json({ error: 'Not found' }); }
    const student = rows[0];
    await conn.execute('UPDATE students SET status = ? WHERE id = ?', ['approved', id]);
    await conn.end();

    // send email
    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: student.email,
        subject: 'Registration Approved - Global Gate',
        text: `Hello ${student.name || ''},\n\nYour registration has been approved.\n\nUsername: ${student.email}\nPassword: ${student.nic}\n\nPlease login to the portal to continue.`,
      });
    } catch (mailErr) {
      console.error('Mail send error', mailErr);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Approve error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Decline student: set status=declined and send email with comment (admin only)
router.put('/:id/decline', requireAuth('admin'), async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT email, name FROM students WHERE id = ?', [id]);
    if (!rows || !rows[0]) { await conn.end(); return res.status(404).json({ error: 'Not found' }); }
    const student = rows[0];
    await conn.execute('UPDATE students SET status = ? WHERE id = ?', ['declined', id]);
    await conn.end();

    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: student.email,
        subject: 'Registration Declined - Global Gate',
        text: `Hello ${student.name || ''},\n\nYour registration has been declined.\nReason: ${comment || 'Not specified'}\n\nIf you have questions, please contact support.`,
      });
    } catch (mailErr) {
      console.error('Mail send error', mailErr);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Decline error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete student (admin only)
router.delete('/:id', requireAuth('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT photo_path, bank_slip_path FROM students WHERE id = ?', [id]);
    const r = rows && rows[0] ? rows[0] : null;
    await conn.execute('DELETE FROM students WHERE id = ?', [id]);
    await conn.end();

    // remove files
    if (r) {
      try { if (r.photo_path) fs.unlinkSync(path.join(__dirname, '..', r.photo_path.replace(/^[/\\]+/, ''))); } catch (e) {}
      try { if (r.bank_slip_path) fs.unlinkSync(path.join(__dirname, '..', r.bank_slip_path.replace(/^[/\\]+/, ''))); } catch (e) {}
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete student error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get student info by id (safe fields)
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT id, name, email, nic, mobile, course_id, payment_method, payment_status, photo_path, bank_slip_path, status FROM students WHERE id = ?', [id]);
    await conn.end();
    if (!rows || !rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get student error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create or submit a payment request for a student (student uploads bank slip or card payment)
router.post('/:id/payment', upload.single('bank_slip'), async (req, res) => {
  const id = req.params.id; // student id
  try {
    const { courseId, payment_method } = req.body;
    const bankSlipPath = req.file ? `/BankSlip/${req.file.filename}` : null;

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    let payment_status = 'pending';
    if (payment_method === 'card' || payment_method === 'free') payment_status = 'approved';

    const start_date = req.body.start_date || null;
    const end_date = req.body.end_date || null;
    const hasDates = await hasColumn(conn, 'student_courses', 'start_date') && await hasColumn(conn, 'student_courses', 'end_date');

    // insert a record into student_courses so student can have multiple enrollments
    try {
      if (hasDates) {
        await conn.execute('INSERT INTO student_courses (student_id, course_id, start_date, end_date, bank_slip_path, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, courseId || null, start_date, end_date, bankSlipPath, payment_method || null, payment_status]);
      } else {
        await conn.execute('INSERT INTO student_courses (student_id, course_id, bank_slip_path, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)', [id, courseId || null, bankSlipPath, payment_method || null, payment_status]);
      }
    } catch (ie) {
      console.error('Insert payment/student_course error', ie);
      await conn.end();
      return res.status(500).json({ error: 'Database error' });
    }

    if (payment_status === 'approved') {
      try { await recomputeEnrollmentRange(conn, id); } catch (e) { console.error('Recompute error', e); }
    }

    // if card payment, send confirmation email
    if (payment_method === 'card') {
      const [rows] = await conn.execute('SELECT email, name FROM students WHERE id = ?', [id]);
      const student = rows && rows[0] ? rows[0] : null;
      if (student) {
        try {
          const transporter = getTransport();
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: student.email,
            subject: 'Payment Received - Global Gate',
            text: `Hello ${student.name || ''},\n\nYour payment has been received and your enrollment for the course is confirmed.\n\nRegards,\nGlobal Gate`,
          });
        } catch (e) { console.error('Mail send error (payment card)', e); }
      }
    }

    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Payment submit error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: list pending payment requests
router.get('/payments/list', requireAuth('admin'), async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute(`
      SELECT sc.id, s.id as student_id, s.name, s.email, s.nic, s.mobile, sc.bank_slip_path, sc.payment_method, sc.payment_status, sc.course_id, c.name as course_name, c.banner_path, c.fee
      FROM student_courses sc
      JOIN students s ON sc.student_id = s.id
      LEFT JOIN courses c ON sc.course_id = c.id
      WHERE sc.payment_status = ?
      ORDER BY sc.created_at DESC
    `, ['pending']);
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Payments list error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: approve payment request
router.put('/payments/:id/approve', requireAuth('admin'), async (req, res) => {
  const scId = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT s.email, s.name, sc.student_id FROM student_courses sc JOIN students s ON sc.student_id = s.id WHERE sc.id = ?', [scId]);
    if (!rows || !rows[0]) { await conn.end(); return res.status(404).json({ error: 'Not found' }); }
    const student = rows[0];
    await conn.execute('UPDATE student_courses SET payment_status = ? WHERE id = ?', ['approved', scId]);
    // recompute enrollment range for this student
    try { await recomputeEnrollmentRange(conn, student.student_id); } catch (e) { console.error('Recompute error', e); }
    await conn.end();

    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: student.email,
        subject: 'Payment Approved - Global Gate',
        text: `Hello ${student.name || ''},\n\nYour payment has been approved. You are now enrolled for the course.\n\nRegards,\nGlobal Gate`,
      });
      res.json({ ok: true });
    } catch (mailErr) { 
      console.error('Mail send error (payment approve)', mailErr);
      res.status(500).json({ error: 'Failed to send approval email: ' + mailErr.message });
    }
  } catch (err) {
    console.error('Payment approve error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: decline payment request
router.put('/payments/:id/decline', requireAuth('admin'), async (req, res) => {
  const scId = req.params.id;
  const { comment } = req.body;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT s.email, s.name FROM student_courses sc JOIN students s ON sc.student_id = s.id WHERE sc.id = ?', [scId]);
    if (!rows || !rows[0]) { await conn.end(); return res.status(404).json({ error: 'Not found' }); }
    const student = rows[0];
    await conn.execute('UPDATE student_courses SET payment_status = ? WHERE id = ?', ['declined', scId]);
    await conn.end();

    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: student.email,
        subject: 'Payment Declined - Global Gate',
        text: `Hello ${student.name || ''},\n\nYour payment request has been declined.\nReason: ${comment || 'Not specified'}\n\nYou may resubmit the payment request from your student panel.\n\nRegards,\nGlobal Gate`,
      });
      res.json({ ok: true });
    } catch (mailErr) { 
      console.error('Mail send error (payment decline)', mailErr);
      res.status(500).json({ error: 'Failed to send decline email: ' + mailErr.message });
    }
  } catch (err) {
    console.error('Payment decline error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: remove assigned course(s) from a student
// If body.courseId provided, only that enrollment is removed; otherwise all enrollments are removed.
router.delete('/:id/course', requireAuth('admin'), async (req, res) => {
  const id = req.params.id; // student id
  const { courseId } = req.body || {};
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    const [rows] = await conn.execute('SELECT email, name FROM students WHERE id = ?', [id]);
    if (!rows || !rows[0]) { await conn.end(); return res.status(404).json({ error: 'Not found' }); }
    const student = rows[0];

    if (courseId) {
      await conn.execute('DELETE FROM student_courses WHERE student_id = ? AND course_id = ?', [id, courseId]);
    } else {
      await conn.execute('DELETE FROM student_courses WHERE student_id = ?', [id]);
    }

    await conn.end();

    try {
      const transporter = getTransport();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: student.email,
        subject: 'Course Removed - Global Gate',
        text: `Hello ${student.name || ''},\n\nAn administrator has removed your course enrollment(s). If this was unexpected please contact support.\n\nRegards,\nGlobal Gate`,
      });
    } catch (mailErr) { console.error('Mail send error (remove course)', mailErr); }

    res.json({ ok: true });
  } catch (err) {
    console.error('Remove course error', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Get courses for a student (include lecturers and lessons)
router.get('/:id/courses', async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    // Find approved enrollments for this student from student_courses
    const [srows] = await conn.execute('SELECT sc.id, sc.course_id FROM student_courses sc WHERE sc.student_id = ? AND sc.payment_status = ?', [id, 'approved']);
    if (!srows || srows.length === 0) { await conn.end(); return res.json({ courses: [] }); }

    const coursesOut = [];
    for (const row of srows) {
      const courseId = row.course_id;
      const [courses] = await conn.execute('SELECT id, name, duration, description, banner_path, fee FROM courses WHERE id = ?', [courseId]);
      if (!courses || !courses[0]) continue;
      const course = courses[0];

      // lecturers assigned to this course
      const [lects] = await conn.execute(
        `SELECT l.id, l.name, l.email, l.phone, l.photo_path
         FROM lecturers l
         JOIN lecturer_courses lc ON lc.lecturer_id = l.id
         WHERE lc.course_id = ?`, [courseId]
      );

      // lessons for this course (include meeting_link)
      const [lessons] = await conn.execute(
        'SELECT id, lecturer_id, topic, start_time, end_time, meeting_link FROM lessons WHERE course_id = ? ORDER BY start_time ASC', [courseId]
      );

      coursesOut.push({ ...course, lecturers: lects || [], lessons: lessons || [] });
    }

    await conn.end();
    res.json({ courses: coursesOut });
  } catch (err) {
    console.error('Student courses error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all enrollments for a student (includes pending and approved payment_status)
router.get('/:id/enrollments', async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    const [rows] = await conn.execute(`
      SELECT sc.id, sc.course_id, sc.payment_status, sc.payment_method, sc.bank_slip_path, sc.created_at,
             c.name as course_name, c.duration, c.fee, c.banner_path
      FROM student_courses sc
      LEFT JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ?
      ORDER BY sc.created_at DESC
    `, [id]);

    await conn.end();
    res.json({ enrollments: Array.isArray(rows) ? rows : [] });
  } catch (err) {
    console.error('Student enrollments error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
