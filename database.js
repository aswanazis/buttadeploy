require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

console.log('✅ Menggunakan PostgreSQL');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const query = async (sql, params = []) => {
  let i = 0;
  const pgSql = sql
    .replace(/\?/g, () => `$${++i}`)
    .replace(/deskripsiSingkat/g, 'deskripssingkat')
    .replace(/kontenLengkap/g, 'kontenlengkap');
  const result = await pool.query(pgSql, params);
  return result.rows.map(row => ({
    ...row,
    deskripsiSingkat: row.deskripssingkat,
    kontenLengkap: row.kontenlengkap,
  }));
};

const run = async (sql, params = []) => {
  let i = 0;
  const pgSql = sql
    .replace(/\?/g, () => `$${++i}`)
    .replace(/deskripsiSingkat/g, 'deskripssingkat')
    .replace(/kontenLengkap/g, 'kontenlengkap');
  const finalSql = pgSql.match(/^INSERT/i) ? pgSql + ' RETURNING id' : pgSql;
  const result = await pool.query(finalSql, params);
  return { id: result.rows[0]?.id, changes: result.rowCount };
};

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS berita (
      id SERIAL PRIMARY KEY,
      judul TEXT NOT NULL,
      deskripssingkat TEXT,
      kontenlengkap TEXT,
      gambar TEXT,
      tanggal TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kontak (
      id SERIAL PRIMARY KEY,
      nama TEXT NOT NULL,
      email TEXT NOT NULL,
      pesan TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  const existing = await pool.query('SELECT * FROM admin LIMIT 1');
  if (existing.rows.length === 0) {
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) {
      console.warn('⚠️  ADMIN_PASSWORD tidak diset!');
      return;
    }
    const hash = bcrypt.hashSync(adminPass, 10);
    await pool.query('INSERT INTO admin (username, password) VALUES ($1, $2)', [adminUser, hash]);
    console.log(`✅ Akun admin "${adminUser}" berhasil dibuat`);
  }
  console.log('✅ Database PostgreSQL siap');
};

initDB().catch(err => {
  console.error('❌ Gagal init database:', err.message);
  process.exit(1);
});

module.exports = { query, run, db: pool };