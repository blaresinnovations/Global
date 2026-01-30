const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', 'BlogMedia');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const allowedMimes = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','audio/mpeg','audio/wav','audio/ogg'];
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (allowedMimes.length === 0 || allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type'));
}});
const { requireAuth } = require('../middleware/auth');

async function createConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });
}

// Create blog (admin only)
router.post('/', requireAuth('admin'), (req, res) => {
  upload.array('media')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' });
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const { title, description, publish_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Missing title' });

    try {
      const conn = await createConn();
      const pd = publish_date || new Date().toISOString();
      const [result] = await conn.execute('INSERT INTO blogs (title, description, publish_date) VALUES (?, ?, ?)', [title, description || null, pd]);
      const blogId = result.insertId;

      const files = req.files || [];
      if (files.length) {
        const inserts = files.map((f, i) => [blogId, f.mimetype, `/BlogMedia/${f.filename}`, i]);
        await conn.query('INSERT INTO blog_media (blog_id, media_type, media_path, sort_order) VALUES ?', [inserts]);
      }

      await conn.end();
      res.json({ id: blogId });
    } catch (dbErr) {
      console.error(dbErr);
      // cleanup uploaded files on error
      (req.files || []).forEach(f => { try { fs.unlinkSync(path.join(uploadDir, f.filename)); } catch(e){} });
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Get blogs
router.get('/', async (req, res) => {
  try {
    const conn = await createConn();
    const [rows] = await conn.execute(
      `SELECT b.id, b.title, b.description, b.publish_date,
        GROUP_CONCAT(CONCAT(m.id,'||',m.media_type,'||',m.media_path,'||',m.sort_order) ORDER BY m.sort_order SEPARATOR ';;') as media
      FROM blogs b
      LEFT JOIN blog_media m ON m.blog_id = b.id
      GROUP BY b.id
      ORDER BY b.id DESC`
    );
    await conn.end();

    const out = rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      publish_date: r.publish_date,
      media: r.media ? String(r.media).split(';;').map(s => {
        const parts = s.split('||');
        return { id: Number(parts[0]||0), media_type: parts[1] || null, media_path: parts[2] || null, sort_order: Number(parts[3]||0) };
      }) : []
    }));

    res.json(out);
  } catch (err) {
    console.error('DB read error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update blog (admin only)
router.put('/:id', requireAuth('admin'), (req, res) => {
  upload.array('media')(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' });
      console.error('Upload error', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const id = req.params.id;
    const { title, description, publish_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Missing title' });

    try {
      const conn = await createConn();
      await conn.execute('UPDATE blogs SET title = ?, description = ?, publish_date = ? WHERE id = ?', [title, description || null, publish_date || new Date().toISOString(), id]);

      // remove old media files
      const [old] = await conn.execute('SELECT media_path FROM blog_media WHERE blog_id = ?', [id]);
      old.forEach(r => {
        try { const rel = r.media_path.replace(/^[/\\]+/, ''); fs.unlinkSync(path.join(__dirname, '..', rel)); } catch (e) {}
      });
      await conn.execute('DELETE FROM blog_media WHERE blog_id = ?', [id]);

      const files = req.files || [];
      if (files.length) {
        const inserts = files.map((f, i) => [id, f.mimetype, `/BlogMedia/${f.filename}`, i]);
        await conn.query('INSERT INTO blog_media (blog_id, media_type, media_path, sort_order) VALUES ?', [inserts]);
      }

      await conn.end();
      res.json({ ok: true });
    } catch (dbErr) {
      console.error(dbErr);
      (req.files || []).forEach(f => { try { fs.unlinkSync(path.join(uploadDir, f.filename)); } catch(e){} });
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Delete blog (admin only)
router.delete('/:id', requireAuth('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await createConn();
    const [rows] = await conn.execute('SELECT media_path FROM blog_media WHERE blog_id = ?', [id]);
    rows.forEach(r => {
      try { const rel = r.media_path.replace(/^[/\\]+/, ''); fs.unlinkSync(path.join(__dirname, '..', rel)); } catch (e) {}
    });
    await conn.execute('DELETE FROM blog_media WHERE blog_id = ?', [id]);
    await conn.execute('DELETE FROM blogs WHERE id = ?', [id]);
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
