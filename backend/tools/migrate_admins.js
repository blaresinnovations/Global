const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateAdminsTable() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'global_gate'
    });

    console.log('Connected to database');

    // Check if username column exists
    const [columns] = await conn.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME='admins' AND COLUMN_NAME='username'
    `);

    if (columns.length === 0) {
      console.log('Adding username column...');
      await conn.execute(`
        ALTER TABLE admins 
        ADD COLUMN username VARCHAR(255) UNIQUE AFTER email
      `);
      console.log('✓ Username column added');
    } else {
      console.log('✓ Username column already exists');
    }

    // Update role enum
    console.log('Updating role enum...');
    await conn.execute(`
      ALTER TABLE admins 
      MODIFY COLUMN role ENUM('Super Admin','Admin','Staff') NOT NULL DEFAULT 'Staff'
    `);
    console.log('✓ Role enum updated');

    // Create index for username
    const [indexes] = await conn.execute(`
      SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_NAME='admins' AND COLUMN_NAME='username' AND CONSTRAINT_NAME != 'PRIMARY'
    `);

    if (indexes.length === 0) {
      console.log('Creating index for username...');
      await conn.execute(`
        CREATE INDEX idx_admins_username ON admins(username)
      `);
      console.log('✓ Index created');
    } else {
      console.log('✓ Index already exists');
    }

    console.log('\n✓ Migration completed successfully!');
    await conn.end();
  } catch (err) {
    console.error('Migration error:', err.message);
    if (conn) await conn.end();
    process.exit(1);
  }
}

migrateAdminsTable();
