require('dotenv').config();
const mysql = require('mysql2/promise');

async function recomputeAll() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });

  console.log('Computing enrollment ranges for all students...');

  try {
    const [students] = await conn.execute('SELECT id FROM students');
    for (const s of students) {
      const studentId = s.id;
      const [r] = await conn.execute(
        `SELECT MIN(start_date) as mn, MAX(end_date) as mx FROM student_courses
         WHERE student_id = ? AND payment_status = 'approved' AND start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= CURDATE()`
        , [studentId]
      );
      const mn = r && r[0] ? r[0].mn : null;
      const mx = r && r[0] ? r[0].mx : null;
      if (!mn || !mx) {
        await conn.execute('DELETE FROM student_enrollment_ranges WHERE student_id = ?', [studentId]);
        console.log(` - student ${studentId}: no active ranges, removed`);
        continue;
      }
      const [exist] = await conn.execute('SELECT id FROM student_enrollment_ranges WHERE student_id = ?', [studentId]);
      if (exist && exist[0]) {
        await conn.execute('UPDATE student_enrollment_ranges SET start_date = ?, end_date = ? WHERE student_id = ?', [mn, mx, studentId]);
        console.log(` - student ${studentId}: updated range ${mn} -> ${mx}`);
      } else {
        await conn.execute('INSERT INTO student_enrollment_ranges (student_id, start_date, end_date) VALUES (?, ?, ?)', [studentId, mn, mx]);
        console.log(` - student ${studentId}: inserted range ${mn} -> ${mx}`);
      }
    }

    console.log('Recompute finished');
  } catch (err) {
    console.error('Recompute failed', err);
    process.exitCode = 2;
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  recomputeAll().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { recomputeAll };
