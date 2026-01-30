const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', 'CourseImage');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type'));
  }
});
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth('admin'), (req, res) => {
  upload.single('banner')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 5MB)' });
        return res.status(400).json({ error: 'Invalid file upload' });
      }
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const { name, duration, description, fee, start_date, end_date } = req.body;
    // parse seminar flag and meeting link
    const rawIsSeminar = req.body.is_seminar;
    const is_seminar = (rawIsSeminar === undefined || rawIsSeminar === null) ? 0 : (['1', 'true', 'on'].includes(String(rawIsSeminar).toLowerCase()) ? 1 : 0);
    const meeting_link = req.body.meeting_link || null;
    const early_bird_price = req.body.early_bird_price || null;
    // robustly parse is_free from form data (may be '0'/'1'/'true'/'false')
    const rawIsFree = req.body.is_free;
    const is_free = (rawIsFree === undefined || rawIsFree === null) ? 0 : (['1', 'true', 'on'].includes(String(rawIsFree).toLowerCase()) ? 1 : 0);
    if (!name || !duration) {
      // remove uploaded file if present
      if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(400).json({ error: 'Missing required fields (name, duration)' });
    }

    const bannerPath = req.file ? `/CourseImage/${req.file.filename}` : null;

    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'global_gate'
      });

      const [result] = await conn.execute(
        'INSERT INTO courses (name, duration, description, banner_path, fee, is_free, is_seminar, meeting_link, early_bird_price, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, duration, description || null, bannerPath, fee || 0, is_free, is_seminar, meeting_link, early_bird_price, start_date || null, end_date || null]
      );


      // If lecturers were provided as JSON array of ids, insert mappings
      try {
        const rawLect = req.body.lecturers;
        if (rawLect) {
          let list = [];
          if (typeof rawLect === 'string') {
            try { list = JSON.parse(rawLect); } catch (e) { list = []; }
          } else if (Array.isArray(rawLect)) list = rawLect;
          list = (list || []).map(x => Number(x)).filter(x => Number.isFinite(x));
          if (list.length) {
            const inserts = list.map(cid => [cid, result.insertId]);
            // lecturer_courses uses (lecturer_id, course_id)
            await conn.query('INSERT INTO lecturer_courses (lecturer_id, course_id) VALUES ?', [inserts]);
          }
        }
      } catch (e) {
        console.error('Failed to assign lecturers to course', e);
      }
      await conn.end();

      res.json({ id: result.insertId, banner_path: bannerPath });
    } catch (dbErr) {
      console.error(dbErr);
      // remove uploaded file on DB error
      if (req.file) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (e) { console.error('Failed to remove file after DB error', e); }
      }
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    const [rows] = await conn.execute(`
      SELECT 
        c.id, 
        c.name, 
        c.duration, 
        c.description, 
        c.banner_path, 
        c.fee, 
        COALESCE(c.is_free,0) as is_free, 
        COALESCE(c.is_seminar,0) as is_seminar, 
        c.meeting_link, 
        c.early_bird_price, 
        c.start_date, 
        c.end_date,
        GROUP_CONCAT(l.name) as lecturer_name,
        GROUP_CONCAT(l.photo_path) as lecturer_photo
      FROM courses c
      LEFT JOIN lecturer_courses lc ON c.id = lc.course_id
      LEFT JOIN lecturers l ON lc.lecturer_id = l.id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('DB read error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update course (admin only)
router.put('/:id', requireAuth('admin'), (req, res) => {
  upload.single('banner')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' });
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const id = req.params.id;
    const { name, duration, description, fee, start_date, end_date } = req.body;
    const rawIsFree = req.body.is_free;
    const is_free = (rawIsFree === undefined || rawIsFree === null) ? 0 : (['1', 'true', 'on'].includes(String(rawIsFree).toLowerCase()) ? 1 : 0);
    const rawIsSeminar = req.body.is_seminar;
    const is_seminar = (rawIsSeminar === undefined || rawIsSeminar === null) ? 0 : (['1', 'true', 'on'].includes(String(rawIsSeminar).toLowerCase()) ? 1 : 0);
    const meeting_link = req.body.meeting_link || null;
    const early_bird_price = req.body.early_bird_price || null;
    if (!name || !duration) {
      if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(400).json({ error: 'Missing required fields (name, duration)' });
    }

    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'global_gate'
      });

      // get existing banner to remove if replaced
      const [existing] = await conn.execute('SELECT banner_path FROM courses WHERE id = ?', [id]);
      let oldBanner = existing && existing[0] ? existing[0].banner_path : null;

      const newBannerPath = req.file ? `/CourseImage/${req.file.filename}` : oldBanner;

      await conn.execute(
        'UPDATE courses SET name = ?, duration = ?, description = ?, banner_path = ?, fee = ?, is_free = ?, is_seminar = ?, meeting_link = ?, early_bird_price = ?, start_date = ?, end_date = ? WHERE id = ?',
        [name, duration, description || null, newBannerPath, fee || 0, is_free, is_seminar, meeting_link, early_bird_price, start_date || null, end_date || null, id]
      );

      // update lecturer mappings if provided
      try {
        const rawLect = req.body.lecturers;
        if (rawLect) {
          let list = [];
          if (typeof rawLect === 'string') {
            try { list = JSON.parse(rawLect); } catch (e) { list = []; }
          } else if (Array.isArray(rawLect)) list = rawLect;
          list = (list || []).map(x => Number(x)).filter(x => Number.isFinite(x));
          // remove existing mappings for this course
          await conn.execute('DELETE FROM lecturer_courses WHERE course_id = ?', [id]);
          if (list.length) {
            const inserts = list.map(lid => [lid, Number(id)]);
            await conn.query('INSERT INTO lecturer_courses (lecturer_id, course_id) VALUES ?', [inserts]);
          }
        }
      } catch (e) {
        console.error('Failed to update lecturer mappings for course', e);
      }

      await conn.end();

      // remove old file if replaced
      if (req.file && oldBanner) {
        try {
          const rel = oldBanner.replace(/^[/\\]+/, '');
          fs.unlinkSync(path.join(__dirname, '..', rel));
        } catch (e) { /* best-effort */ }
      }

      res.json({ ok: true, banner_path: newBannerPath });
    } catch (dbErr) {
      console.error(dbErr);
      if (req.file) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (e) { console.error('Failed to remove file after DB error', e); }
      }
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Delete course (admin only)
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

    const [existing] = await conn.execute('SELECT banner_path FROM courses WHERE id = ?', [id]);
    const banner = existing && existing[0] ? existing[0].banner_path : null;

    await conn.execute('DELETE FROM courses WHERE id = ?', [id]);
    await conn.end();

    if (banner) {
      try {
        const rel = banner.replace(/^[/\\]+/, '');
        fs.unlinkSync(path.join(__dirname, '..', rel));
      } catch (e) { /* ignore */ }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
