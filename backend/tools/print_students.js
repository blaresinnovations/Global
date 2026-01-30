require('dotenv').config();
const mysql = require('mysql2/promise');
(async ()=>{
  try{
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT,10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });
    const [rows] = await conn.execute('SELECT id, student_number, name, nic FROM students ORDER BY id DESC LIMIT 200');
    console.log(rows);
    await conn.end();
  }catch(e){ console.error('error', e); process.exit(1);} 
})();
