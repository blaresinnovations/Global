require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const sqlDir = path.join(__dirname, '..', 'sql');

async function run() {
  const files = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql')).sort();

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate',
    multipleStatements: true,
  });

  console.log('Running migrations against', process.env.DB_NAME || 'global_gate');

  for (const file of files) {
    const full = path.join(sqlDir, file);
    console.log('Applying', file);
    try {
      if (file.includes('add_course_fee')) {
        // ensure courses.fee exists
        const [cols] = await conn.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses' AND COLUMN_NAME = 'fee'", [process.env.DB_NAME]);
        if (cols && cols.length) {
          console.log(' - fee column already exists, skipping');
        } else {
          await conn.execute("ALTER TABLE courses ADD COLUMN fee DECIMAL(10,2) NOT NULL DEFAULT 0");
          console.log(' - fee column added');
        }
        continue;
      }

      if (file.includes('add_student_status')) {
        const [cols] = await conn.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'students' AND COLUMN_NAME = 'status'", [process.env.DB_NAME]);
        if (cols && cols.length) {
          console.log(' - students.status already exists, skipping');
        } else {
          await conn.execute("ALTER TABLE students ADD COLUMN `status` VARCHAR(30) NOT NULL DEFAULT 'pending'");
          console.log(' - students.status added');
        }
        continue;
      }

      if (file.includes('add_payment_columns')) {
        const [cols] = await conn.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'student_courses' AND COLUMN_NAME IN ('payment_plan', 'order_id')", [process.env.DB_NAME]);
        if (cols && cols.length >= 2) {
          console.log(' - payment columns already exist, skipping');
        } else {
          const sql = fs.readFileSync(full, 'utf8');
          if (sql.trim()) await conn.query(sql);
          console.log(' - payment columns added');
        }
        continue;
      }

      const sql = fs.readFileSync(full, 'utf8');
      if (!sql.trim()) { console.log(' - empty file'); continue; }
      await conn.query(sql);
      console.log(' - applied');
    } catch (err) {
      console.error('Error applying', file, err.message || err);
    }
  }

  await conn.end();
  console.log('Migrations finished');
}

run().catch(e => { console.error('Migration runner failed', e); process.exit(1); });
