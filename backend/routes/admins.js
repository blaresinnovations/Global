const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

function getConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Check if email is configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

// Generate username from email
function generateUsername(email) {
  return email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 8);
}

// Send credentials email
async function sendCredentialsEmail(email, name, username, password) {
  if (!isEmailConfigured()) {
    console.warn('⚠️  Email not configured. Skipping email send.');
    console.log(`[TEST MODE] Credentials for ${name}:`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Email: ${email}`);
    return false;
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Global Gate Admin Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Welcome to Global Gate Admin Portal</h2>
          <p>Hello ${name},</p>
          <p>Your admin account has been created successfully. Please use the credentials below to log in:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p><strong>Login URL:</strong> <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login">Admin Login</a></p>
          </div>
          
          <p style="color: #d32f2f;"><strong>Important:</strong> Please change your password after first login for security.</p>
          
          <p>If you have any questions, please contact the support team.</p>
          <p>Best regards,<br>Global Gate Team</p>
        </div>
      `
    };
    
    console.log(`📧 Attempting to send email to ${email}...`);
    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent successfully to ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    return false;
  }
}

// list admins
router.get('/', async (req, res) => {
  try {
    const conn = await getConn();
    const [rows] = await conn.execute('SELECT id, name, email, role, is_active, created_at FROM admins ORDER BY id DESC');
    await conn.end();
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('List admins error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// create admin
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const conn = await getConn();
    // check existing
    const [exists] = await conn.execute('SELECT id FROM admins WHERE email = ?', [email]);
    if (Array.isArray(exists) && exists.length > 0) {
      await conn.end();
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hash = bcrypt.hashSync(String(password), 10);
    const username = generateUsername(email);
    const [result] = await conn.execute('INSERT INTO admins (name, email, username, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)', [name, email, username, hash, role || 'Staff']);
    await conn.end();
    
    // Send credentials email
    await sendCredentialsEmail(email, name, username, password);
    
    res.json({ ok: true, id: result.insertId, message: 'Admin created and credentials sent to email' });
  } catch (err) {
    console.error('Create admin error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// update admin (name, role, is_active, password optional)
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, role, is_active, password } = req.body;
  try {
    const conn = await getConn();
    if (password) {
      const hash = bcrypt.hashSync(String(password), 10);
      await conn.execute('UPDATE admins SET name = ?, role = ?, is_active = ?, password_hash = ? WHERE id = ?', [name || null, role || 'user', typeof is_active !== 'undefined' ? is_active : 1, hash, id]);
    } else {
      await conn.execute('UPDATE admins SET name = ?, role = ?, is_active = ? WHERE id = ?', [name || null, role || 'user', typeof is_active !== 'undefined' ? is_active : 1, id]);
    }
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Update admin error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// delete admin
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await getConn();
    await conn.execute('DELETE FROM admins WHERE id = ?', [id]);
    await conn.end();
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete admin error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
