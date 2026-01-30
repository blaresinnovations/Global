const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { requireAuth } = require('../middleware/auth');

// Email transporter setup
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

async function createConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });
}

// Create inquiry
router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });

    const conn = await createConn();
    const [result] = await conn.execute('INSERT INTO inquiries (name, mobile, email, message) VALUES (?, ?, ?, ?)', [name, mobile || '', email, message || null]);
    await conn.end();

    // Send confirmation email to user
    try {
      const transporter = getTransport();
      const confirmationResult = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'We Received Your Message - Global Gate',
        html: `
          <h2>Thank You for Contacting Global Gate!</h2>
          <p>Hi ${name},</p>
          <p>We have received your inquiry and will get back to you as soon as possible, typically within 24 hours.</p>
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
          <p>Best regards,<br>Global Gate Team</p>
        `
      });
      console.log('Confirmation email sent:', confirmationResult);

      // Send notification email to admin
      const adminResult = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || 'globalgate25.lk@gmail.com',
        subject: `New Inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${mobile || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Inquiry ID:</strong> ${result.insertId}</p>
        `
      });
      console.log('Admin notification email sent to:', process.env.ADMIN_EMAIL, adminResult);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.json({ id: result.insertId, message: 'Inquiry submitted successfully' });
  } catch (err) {
    console.error('Create inquiry error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// List inquiries (admin only)
router.get('/', requireAuth('admin'), async (req, res) => {
  try {
    const conn = await createConn();
    const [rows] = await conn.execute('SELECT id, name, mobile, email, message, is_done, admin_comment, created_at FROM inquiries ORDER BY id DESC');
    await conn.end();
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('List inquiries error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update inquiry: mark done / add admin comment (admin only)
router.put('/:id', requireAuth('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const { is_done, admin_comment } = req.body;
    const conn = await createConn();
    await conn.execute('UPDATE inquiries SET is_done = ?, admin_comment = ? WHERE id = ?', [is_done ? 1 : 0, admin_comment || null, id]);
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Update inquiry error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', requireAuth('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const conn = await createConn();
    await conn.execute('DELETE FROM inquiries WHERE id = ?', [id]);
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete inquiry error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
