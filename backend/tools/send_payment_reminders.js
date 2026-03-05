const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });

  try {
    // find approved enrollments that expire in 3 days
    const [rows] = await conn.execute(`
      SELECT sc.id, sc.student_id, sc.course_id, sc.end_date, s.email, s.name, c.name as course_name
      FROM student_courses sc
      JOIN students s ON sc.student_id = s.id
      LEFT JOIN courses c ON sc.course_id = c.id
      WHERE sc.payment_status = 'approved' AND sc.end_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    `);

    if (!rows || rows.length === 0) {
      console.log('No reminders to send.');
      await conn.end();
      return;
    }

    const transporter = getTransport();

    for (const r of rows) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: r.email,
          subject: 'Course Access Expiry Reminder - Global Gate',
          text: `Hello ${r.name || ''},\n\nThis is a reminder that your access to the course '${r.course_name || ''}' will expire on ${r.end_date}. If you are on a monthly or block plan, please make sure to renew your payment to continue access.\n\nRegards,\nGlobal Gate`,
        });
        console.log('Reminder sent to', r.email);
      } catch (e) {
        console.error('Failed to send reminder to', r.email, e.message || e);
      }
    }
  } catch (e) {
    console.error('Reminder job failed', e);
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  run().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { run };
