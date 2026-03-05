require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve saved course images
app.use('/CourseImage', express.static(path.join(__dirname, 'CourseImage')));
// Serve lecturer images
app.use('/LecturerImage', express.static(path.join(__dirname, 'LecturerImage')));
// Serve blog media
app.use('/BlogMedia', express.static(path.join(__dirname, 'BlogMedia')));
// Serve student photos and bank slips
app.use('/StudentPhoto', express.static(path.join(__dirname, 'StudentPhoto')));
app.use('/BankSlip', express.static(path.join(__dirname, 'BankSlip')));

// Routes
const coursesRouter = require('./routes/courses');
app.use('/api/courses', coursesRouter);
const lecturersRouter = require('./routes/lecturers');
app.use('/api/lecturers', lecturersRouter);
const lessonsRouter = require('./routes/lessons');
app.use('/api/lessons', lessonsRouter);
const blogsRouter = require('./routes/blogs');
app.use('/api/blogs', blogsRouter);
const inquiriesRouter = require('./routes/inquiries');
app.use('/api/inquiries', inquiriesRouter);
const hmsRouter = require('./routes/hms');
app.use('/api/100ms', hmsRouter);
const studentsRouter = require('./routes/students');
app.use('/api/students', studentsRouter);
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const adminsRouter = require('./routes/admins');
const { requireAuth } = require('./middleware/auth');
app.use('/api/admins', requireAuth('admin'), adminsRouter);
// Payments (PayHere) scaffold
const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);

// Delete expired lessons: remove lessons whose end_time has passed
async function deleteExpiredLessons() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    // debug: count how many expired rows exist
    try {
      const [countRows] = await conn.execute('SELECT COUNT(*) AS cnt FROM lessons WHERE end_time IS NOT NULL AND end_time <= NOW()');
      const cnt = Array.isArray(countRows) && countRows[0] ? countRows[0].cnt : null;
      console.log(`Expired lessons found: ${cnt}`);
      if (cnt && cnt > 0) {
        const [sample] = await conn.execute('SELECT id, lecturer_id, start_time, end_time FROM lessons WHERE end_time IS NOT NULL AND end_time <= NOW() LIMIT 10');
        console.log('Sample expired lessons:', sample);
      }
    } catch (e) {
      console.error('Error counting expired lessons', e);
    }

    const [result] = await conn.execute('DELETE FROM lessons WHERE end_time IS NOT NULL AND end_time <= NOW()');
    await conn.end();

    if (result && typeof result.affectedRows === 'number') {
      if (result.affectedRows > 0) console.log(`Deleted ${result.affectedRows} expired lessons`);
      else console.log('No expired lessons deleted');
    } else {
      console.log('Expired lessons cleanup ran (result not standard)');
    }
  } catch (err) {
    console.error('Error deleting expired lessons', err);
  }
}

// Run once immediately, then every 5 minutes
deleteExpiredLessons();
setInterval(deleteExpiredLessons, 5 * 60 * 1000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GlobalGate backend running on port ${PORT}`);
});
