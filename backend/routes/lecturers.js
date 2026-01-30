const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { requireAuth } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'LecturerImage');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type'));
  }
});

// Create lecturer (admin only)
router.post('/', requireAuth('admin'), (req, res) => {
  upload.single('photo')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' });
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const { name, email, phone, courses } = req.body;
    if (!name || !email) {
      if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(400).json({ error: 'Missing required fields (name, email)' });
    }

    const photoPath = req.file ? `/LecturerImage/${req.file.filename}` : null;

    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'global_gate'
      });

      const [result] = await conn.execute(
        'INSERT INTO lecturers (name, email, phone, photo_path) VALUES (?, ?, ?, ?)',
        [name, email, phone || null, photoPath]
      );

      const lecturerId = result.insertId;

      // handle courses mapping: expect JSON string or comma-separated
      let courseIds = [];
      if (courses) {
        try { courseIds = JSON.parse(courses); } catch (e) { courseIds = String(courses).split(',').map(x => x.trim()).filter(Boolean); }
      }

      if (courseIds.length) {
        const inserts = courseIds.map(cid => [lecturerId, cid]);
        await conn.query('INSERT INTO lecturer_courses (lecturer_id, course_id) VALUES ?', [inserts]);
      }

      await conn.end();

      // create auth entry and email credentials (best-effort)
      let notified = false;
      let credentials = null;
      try {
        const result = await createLecturerAuthAndNotify(lecturerId, email);
        notified = !!result.emailed;
        credentials = { username: result.username, password: result.password };
      } catch (notifyErr) {
        console.error('Failed to create auth/notify lecturer', notifyErr);
      }

      // If email couldn't be sent, return credentials in response so admin can copy them.
      res.json({ id: lecturerId, photo_path: photoPath, notified, credentials: notified ? null : credentials });
    } catch (dbErr) {
      console.error(dbErr);
      if (req.file) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (e) { console.error('Failed to remove file after DB error', e); }
      }
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Get lecturers (with assigned courses)
router.get('/', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    const [rows] = await conn.execute(
      `SELECT l.id, l.name, l.email, l.phone, l.photo_path,
        GROUP_CONCAT(lc.course_id) as courses
      FROM lecturers l
      LEFT JOIN lecturer_courses lc ON lc.lecturer_id = l.id
      GROUP BY l.id
      ORDER BY l.id DESC`
    );

    await conn.end();

    const formatted = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      photo_path: r.photo_path,
      courses: r.courses ? String(r.courses).split(',').map(x => parseInt(x, 10)) : []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('DB read error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update lecturer (admin only)
router.put('/:id', requireAuth('admin'), (req, res) => {
  upload.single('photo')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' });
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const id = req.params.id;
    const { name, email, phone, courses } = req.body;
    if (!name || !email) {
      if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(400).json({ error: 'Missing required fields (name, email)' });
    }

    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'global_gate'
      });

      const [existing] = await conn.execute('SELECT photo_path FROM lecturers WHERE id = ?', [id]);
      let oldPhoto = existing && existing[0] ? existing[0].photo_path : null;

      const newPhotoPath = req.file ? `/LecturerImage/${req.file.filename}` : oldPhoto;

      await conn.execute(
        'UPDATE lecturers SET name = ?, email = ?, phone = ?, photo_path = ? WHERE id = ?',
        [name, email, phone || null, newPhotoPath, id]
      );

      // update course mappings
      await conn.execute('DELETE FROM lecturer_courses WHERE lecturer_id = ?', [id]);
      let courseIds = [];
      if (courses) {
        try { courseIds = JSON.parse(courses); } catch (e) { courseIds = String(courses).split(',').map(x => x.trim()).filter(Boolean); }
      }
      if (courseIds.length) {
        const inserts = courseIds.map(cid => [id, cid]);
        await conn.query('INSERT INTO lecturer_courses (lecturer_id, course_id) VALUES ?', [inserts]);
      }

      await conn.end();

      if (req.file && oldPhoto) {
        try { const rel = oldPhoto.replace(/^[/\\]+/, ''); fs.unlinkSync(path.join(__dirname, '..', rel)); } catch (e) { /* best-effort */ }
      }

      res.json({ ok: true, photo_path: newPhotoPath });
    } catch (dbErr) {
      console.error(dbErr);
      if (req.file) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (e) { console.error('Failed to remove file after DB error', e); }
      }
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Delete lecturer (admin only)
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

    const [existing] = await conn.execute('SELECT photo_path FROM lecturers WHERE id = ?', [id]);
    const photo = existing && existing[0] ? existing[0].photo_path : null;

    await conn.execute('DELETE FROM lecturer_courses WHERE lecturer_id = ?', [id]);
    await conn.execute('DELETE FROM lecturers WHERE id = ?', [id]);
    await conn.end();

    if (photo) {
      try { const rel = photo.replace(/^[/\\]+/, ''); fs.unlinkSync(path.join(__dirname, '..', rel)); } catch (e) { /* ignore */ }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

// Helper: ensure auth and lessons tables exist
async function ensureAuthTables() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });

  // lecturer_auth: stores credential for lecturer logins
  await conn.execute(
    `CREATE TABLE IF NOT EXISTS lecturer_auth (
      lecturer_id INT UNSIGNED NOT NULL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_la_lecturer FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  );

  // lessons table: schedule entries
  await conn.execute(
    `CREATE TABLE IF NOT EXISTS lessons (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      lecturer_id INT UNSIGNED NOT NULL,
      course_id INT NOT NULL,
      topic VARCHAR(255) DEFAULT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME DEFAULT NULL,
      meeting_link VARCHAR(512) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_lc_lecturer FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
      CONSTRAINT fk_lc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  );

  await conn.end();
}

// Simple transporter using env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

// Create auth entry and email credentials to lecturer
async function createLecturerAuthAndNotify(lecturerId, email) {
  try {
    await ensureAuthTables();
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    const plain = Math.random().toString(36).slice(2, 10) + Math.floor(Math.random()*9000+1000);
    const hash = await bcrypt.hash(plain, 10);

    await conn.execute('INSERT INTO lecturer_auth (lecturer_id, username, password_hash) VALUES (?, ?, ?)', [lecturerId, email, hash]);
    await conn.end();

    const transporter = getTransporter();
    let emailed = false;
    if (transporter) {
      const mail = {
        from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
        to: email,
        subject: 'Your Lecturer Account Created',
        text: `Your account has been created. Username: ${email}\nPassword: ${plain}\nPlease change your password after first login.`,
        html: `<p>Your account has been created.</p><p><b>Username:</b> ${email}</p><p><b>Password:</b> ${plain}</p><p>Please change your password after first login.</p>`
      };
      try {
        await transporter.sendMail(mail);
        emailed = true;
      } catch (err) {
        console.error('Email send failed', err);
        emailed = false;
      }
    } else {
      console.warn('SMTP not configured; skipping sending email to', email);
      emailed = false;
    }

    return { username: email, password: plain, emailed };
  } catch (err) {
    console.error('createLecturerAuthAndNotify error', err);
    throw err;
  }
}

// Lecturer login route (email + password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT la.password_hash, la.lecturer_id, l.name, l.email FROM lecturer_auth la JOIN lecturers l ON l.id = la.lecturer_id WHERE la.username = ?', [username]);
    await conn.end();
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const entry = rows[0];
    const ok = await bcrypt.compare(password, entry.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    // Very simple response — in production return JWT/session
    res.json({ ok: true, lecturer: { id: entry.lecturer_id, name: entry.name, email: entry.email } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lessons endpoints: create and list for lecturer
router.post('/:id/lessons', async (req, res) => {
  const id = req.params.id;
  const { course_id, topic, start_time, end_time, meeting_link } = req.body;
  if (!course_id || !start_time) return res.status(400).json({ error: 'Missing fields' });
  try {
    await ensureAuthTables();
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    
    // Verify lecturer exists
    const [lecChecks] = await conn.execute('SELECT id FROM lecturers WHERE id = ?', [id]);
    if (!lecChecks || lecChecks.length === 0) {
      await conn.end();
      return res.status(400).json({ error: `Lecturer ID ${id} not found in database` });
    }
    
    // Verify course exists
    const [courseChecks] = await conn.execute('SELECT id FROM courses WHERE id = ?', [course_id]);
    if (!courseChecks || courseChecks.length === 0) {
      await conn.end();
      return res.status(400).json({ error: `Course ID ${course_id} not found in database` });
    }
    
    const [result] = await conn.execute('INSERT INTO lessons (lecturer_id, course_id, topic, start_time, end_time, meeting_link) VALUES (?, ?, ?, ?, ?, ?)', [id, course_id, topic || null, start_time, end_time || null, meeting_link || null]);
    await conn.end();
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Create lesson error', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
});

router.get('/:id/lessons', async (req, res) => {
  const id = req.params.id;
  try {
    await ensureAuthTables();
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT id, lecturer_id, course_id, topic, start_time, end_time, meeting_link, created_at FROM lessons WHERE lecturer_id = ? ORDER BY start_time DESC', [id]);
    await conn.end();
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('List lessons error', err);
    res.status(500).json({ error: 'Database error' });
  }
});
