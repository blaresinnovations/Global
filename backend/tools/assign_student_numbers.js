require('dotenv').config();
const mysql = require('mysql2/promise');
(async ()=>{
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST||'localhost',
    port: process.env.DB_PORT?parseInt(process.env.DB_PORT):3306,
    user: process.env.DB_USER||'root',
    password: process.env.DB_PASS||'',
    database: process.env.DB_NAME||'global_gate'
  });
  try{
    while(true){
      const [cntRows] = await conn.execute("SELECT COUNT(*) as cnt FROM students WHERE student_number IS NULL OR student_number = ''");
      const cnt = cntRows && cntRows[0] ? cntRows[0].cnt : 0;
      if(!cnt) break;
      const [maxRows] = await conn.execute("SELECT MAX(CAST(SUBSTRING(student_number,3) AS UNSIGNED)) AS maxn FROM students WHERE student_number IS NOT NULL AND student_number <> ''");
      const maxn = maxRows && maxRows[0] && maxRows[0].maxn ? parseInt(maxRows[0].maxn,10) : 0;
      const next = maxn + 1;
      const sn = 'GG' + String(next).padStart(5,'0');
      // update one row
      const [u] = await conn.execute('UPDATE students SET student_number = ? WHERE id = (SELECT id FROM (SELECT id FROM students WHERE student_number IS NULL OR student_number = "" LIMIT 1) x)', [sn]);
      console.log('assigned', sn);
    }
    console.log('done');
  }catch(e){ console.error(e); }
  finally{ await conn.end(); }
})();
