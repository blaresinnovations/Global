const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

require('dotenv').config();
const { requireAuth } = require('../middleware/auth');

// Delete a lesson by id — allowed for admins or the lesson owner (lecturer)
router.delete('/:id', requireAuth(), async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    // fetch lesson to verify ownership
    const [rows] = await conn.execute('SELECT lecturer_id FROM lessons WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      await conn.end();
      return res.status(404).json({ error: 'Lesson not found' });
    }
    const lesson = rows[0];

    // allow if admin
    if (req.user && req.user.role === 'admin') {
      await conn.execute('DELETE FROM lessons WHERE id = ?', [id]);
      await conn.end();
      return res.json({ ok: true });
    }

    // allow if lecturer and owner
    if (req.user && req.user.role === 'lecturer' && Number(req.user.id) === Number(lesson.lecturer_id)) {
      await conn.execute('DELETE FROM lessons WHERE id = ?', [id]);
      await conn.end();
      return res.json({ ok: true });
    }

    await conn.end();
    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    console.error('Delete lesson error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update a lesson
router.put('/:id', requireAuth('admin'), async (req, res) => {
  const id = req.params.id;
  const { topic, start_time, end_time, course_id, meeting_link } = req.body;
  if (!start_time) return res.status(400).json({ error: 'Missing start_time' });
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    await conn.execute('UPDATE lessons SET topic = ?, start_time = ?, end_time = ?, course_id = ?, meeting_link = ? WHERE id = ?', [topic || null, start_time, end_time || null, course_id || null, meeting_link || null, id]);
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Update lesson error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get lessons for a course (optional helper)
router.get('/course/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT id, lecturer_id, course_id, topic, start_time, end_time, meeting_link, created_at FROM lessons WHERE course_id = ? ORDER BY start_time DESC', [courseId]);
    await conn.end();
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('List lessons by course error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
