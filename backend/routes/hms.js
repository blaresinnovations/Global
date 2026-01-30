const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// Helper to get DB connection
async function getConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });
}

// GET /api/100ms/token?lessonId=...&lecturerId=...
router.get('/token', async (req, res) => {
  const { lessonId, lecturerId } = req.query;
  if (!lessonId || !lecturerId) return res.status(400).json({ error: 'Missing lessonId or lecturerId' });
  const API_KEY = process.env.HMS_API_KEY || process.env.HUNDRED_MS_API_KEY;
  const PROJECT = process.env.HMS_PROJECT_ID || process.env.HUNDRED_MS_PROJECT_ID;

  // Development mock mode: return a placeholder token so frontend can render a mock session UI
  if (process.env.DEV_HMS_MOCK === 'true') {
    return res.json({ token: 'MOCK' });
  }

  if (!API_KEY || !PROJECT) {
    return res.status(501).json({ error: 'HMS server credentials not configured. Set HMS_API_KEY and HMS_PROJECT_ID in backend .env' });
  }

  // Verify lecturer exists (simple check) to avoid unauthorized token issuance
  try {
    const conn = await getConn();
    const [rows] = await conn.execute('SELECT id, email FROM lecturers WHERE id = ?', [lecturerId]);
    await conn.end();
    if (!rows || rows.length === 0) return res.status(403).json({ error: 'Lecturer not found or not authorized' });
  } catch (e) {
    console.error('DB verify error', e);
    return res.status(500).json({ error: 'Server error verifying lecturer' });
  }

  const roomId = `lesson-${lessonId}`;

  try {
    // Ensure room exists — create if not present
    const createRoomResp = await fetch(`https://api.100ms.live/v2/projects/${encodeURIComponent(PROJECT)}/rooms`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roomId })
    });

    // ignore non-2xx responses for create (room may already exist)
    if (createRoomResp.status !== 201 && createRoomResp.status !== 409) {
      const errBody = await createRoomResp.text();
      console.warn('Room create responded', createRoomResp.status, errBody);
    }

    // Create a token for the room via 100ms REST API
    const resp = await fetch(`https://api.100ms.live/v2/projects/${encodeURIComponent(PROJECT)}/rooms/${encodeURIComponent(roomId)}/tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: String(lecturerId), role: 'host' })
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data?.message || JSON.stringify(data) });

    return res.json({ token: data?.token || data });
  } catch (e) {
    console.error('HMS token error', e);
    return res.status(500).json({ error: 'Failed to create HMS token: ' + e.message });
  }
});

module.exports = router;
