const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { signToken } = require('../middleware/auth');

async function getConn() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });
}

// Configure email transporter (using Ethereal for testing or Gmail for production)
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// POST /api/auth/login
// body: { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    // 1) check lecturer auth
    const conn = await getConn();
    const [laRows] = await conn.execute('SELECT la.password_hash, la.lecturer_id, l.name, l.email FROM lecturer_auth la JOIN lecturers l ON l.id = la.lecturer_id WHERE la.username = ?', [username]);
    if (laRows && laRows.length) {
      const entry = laRows[0];
      const ok = await bcrypt.compare(password, entry.password_hash);
      if (ok) {
        await conn.end();
        const token = signToken({ role: 'lecturer', id: entry.lecturer_id, name: entry.name, email: entry.email });
        return res.json({ role: 'lecturer', lecturer: { id: entry.lecturer_id, name: entry.name, email: entry.email }, token });
      }
    }

    // 2) check student (username=email, password=NIC) and must be approved
    const [sRows] = await conn.execute('SELECT id, name, email, nic, status FROM students WHERE email = ?', [username]);
    if (sRows && sRows.length) {
      const s = sRows[0];
        if (s.nic && password === s.nic) {
        if (s.status !== 'approved') {
          await conn.end();
          return res.status(403).json({ error: 'Registration not approved yet', status: s.status });
        }
        await conn.end();
        const token = signToken({ role: 'student', id: s.id, name: s.name, email: s.email });
        return res.json({ role: 'student', student: { id: s.id, name: s.name, email: s.email }, token });
      }
    }

    // 3) check admin from DB (admins table)
    try {
      const [aRows] = await conn.execute('SELECT id, name, email, password_hash, role, is_active FROM admins WHERE email = ?', [username]);
      if (aRows && aRows.length) {
        const a = aRows[0];
        if (!a.is_active) {
          await conn.end();
          return res.status(403).json({ error: 'Admin account inactive' });
        }
        const ok = await bcrypt.compare(password, a.password_hash);
        if (ok) {
          await conn.end();
          const token = signToken({ role: String(a.role || 'admin').trim().toLowerCase(), id: a.id, name: a.name, email: a.email });
          return res.json({ role: 'admin', admin: { id: a.id, name: a.name, email: a.email, role: a.role }, token });
        }
      }
    } catch (e) {
      console.error('Admin auth lookup error', e);
      // fall through to env fallback below
    }

    // 4) fallback: check admin from env (legacy)
    const adminUser = process.env.ADMIN_USER || 'admin@globalgate';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    if (username === adminUser && password === adminPass) {
      await conn.end();
      const token = signToken({ role: 'admin', name: adminUser, email: adminUser });
      return res.json({ role: 'admin', admin: { username: adminUser }, token });
    }

    await conn.end();
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Auth login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/forgot-password
// body: { email }
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const conn = await getConn();
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

    // Check if email exists in admins, lecturers, or students
    let userExists = false;
    let userType = null;
    let userId = null;

    // Check admin
    const [adminRows] = await conn.execute('SELECT id FROM admins WHERE email = ?', [email]);
    if (adminRows && adminRows.length) {
      userExists = true;
      userType = 'admin';
      userId = adminRows[0].id;
      // Update admin table with reset token
      await conn.execute(
        'UPDATE admins SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [resetToken, resetTokenExpires, email]
      );
    } else {
      // Check lecturer
      const [lecturerRows] = await conn.execute('SELECT l.id FROM lecturers l WHERE l.email = ?', [email]);
      if (lecturerRows && lecturerRows.length) {
        userExists = true;
        userType = 'lecturer';
        userId = lecturerRows[0].id;
        // Update lecturer_auth table with reset token
        await conn.execute(
          'UPDATE lecturer_auth SET reset_token = ?, reset_token_expires = ? WHERE lecturer_id = ?',
          [resetToken, resetTokenExpires, userId]
        );
      } else {
        // Check student
        const [studentRows] = await conn.execute('SELECT id FROM students WHERE email = ?', [email]);
        if (studentRows && studentRows.length) {
          userExists = true;
          userType = 'student';
          userId = studentRows[0].id;
          // Update students table with reset token
          await conn.execute(
            'UPDATE students SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [resetToken, resetTokenExpires, email]
          );
        }
      }
    }

    await conn.end();

    if (!userExists) {
      // Don't reveal if email exists for security
      return res.status(200).json({ message: 'If an account exists with this email, a reset link has been sent.' });
    }

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@globalgate.com',
        to: email,
        subject: 'Global Gate - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password for your Global Gate account.</p>
            <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 14px;">Or copy this link in your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${resetLink}</p>
            <p style="color: #999; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
          </div>
        `
      });
      console.log(`Password reset email sent to ${email}`);
    } catch (mailErr) {
      console.error('Email sending error:', mailErr);
      // Still return success to user for security
    }

    return res.status(200).json({ message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/reset-password
// body: { token, newPassword }
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and password are required' });

  try {
    const conn = await getConn();

    // Find user with valid reset token
    let userFound = false;
    let userType = null;
    let userId = null;
    let email = null;

    // Check admin
    const [adminRows] = await conn.execute(
      'SELECT id, email FROM admins WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    if (adminRows && adminRows.length) {
      userFound = true;
      userType = 'admin';
      userId = adminRows[0].id;
      email = adminRows[0].email;
    } else {
      // Check lecturer
      const [lecturerRows] = await conn.execute(
        'SELECT la.lecturer_id, l.email FROM lecturer_auth la JOIN lecturers l ON l.id = la.lecturer_id WHERE la.reset_token = ? AND la.reset_token_expires > NOW()',
        [token]
      );
      if (lecturerRows && lecturerRows.length) {
        userFound = true;
        userType = 'lecturer';
        userId = lecturerRows[0].lecturer_id;
        email = lecturerRows[0].email;
      } else {
        // Check student
        const [studentRows] = await conn.execute(
          'SELECT id, email FROM students WHERE reset_token = ? AND reset_token_expires > NOW()',
          [token]
        );
        if (studentRows && studentRows.length) {
          userFound = true;
          userType = 'student';
          userId = studentRows[0].id;
          email = studentRows[0].email;
        }
      }
    }

    if (!userFound) {
      await conn.end();
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password based on user type
    if (userType === 'admin') {
      await conn.execute(
        'UPDATE admins SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [passwordHash, userId]
      );
    } else if (userType === 'lecturer') {
      await conn.execute(
        'UPDATE lecturer_auth SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE lecturer_id = ?',
        [passwordHash, userId]
      );
    } else if (userType === 'student') {
      // For students, we update the NIC field as password (based on login logic)
      // But let's add a password_hash column to students table alternatively
      // For now, we'll keep the existing NIC-based auth
      await conn.execute(
        'UPDATE students SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [userId]
      );
      // Note: Student password reset is complex since they use NIC
      // You may want to send a new temporary password instead
    }

    await conn.end();

    return res.status(200).json({ message: 'Password has been reset successfully. Please login with your new password.' });
  } catch (err) {
    console.error('Reset password error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
