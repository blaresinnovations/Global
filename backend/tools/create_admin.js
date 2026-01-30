#!/usr/bin/env node
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '');
      const val = argv[i+1] && !argv[i+1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const name = args.name || process.env.ADMIN_NAME;
  const email = args.email || process.env.ADMIN_EMAIL;
  const password = args.password || process.env.ADMIN_PASSWORD;
  const role = args.role || process.env.ADMIN_ROLE || 'user';

  if (!name || !email || !password) {
    console.error('Missing required args. Usage: node create_admin.js --name "Name" --email "email" --password "pass" [--role admin]');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'global_gate'
  });

  try {
    const hash = bcrypt.hashSync(String(password), 10);
    const [result] = await conn.execute('INSERT INTO admins (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)', [name, email, hash, role]);
    console.log('Admin created with id:', result.insertId);
  } catch (err) {
    console.error('Error creating admin:', err && err.message ? err.message : err);
    // give helpful hints for common issues
    if (err && err.code === 'ER_NO_SUCH_TABLE') {
      console.error('It looks like the `admins` table does not exist. Run the SQL migration in backend/sql/create_admins.sql or create the table manually.');
    }
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
