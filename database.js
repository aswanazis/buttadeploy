require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const usePostgres = !!process.env.DATABASE_URL;

let pool, db, query, run;

if (usePostgres) {
  console.log('✅ Menggunakan PostgreSQL');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  query = async (sql, params = []) => {
    let i = 0;
    // Konversi nama kolom camelCase ke lowercase untuk PostgreSQL
    const pgSql = sql
      .replace(/\?/g, () => `$${++i}`)
      .replace(/deskripsiSingkat/g, 'deskripssingkat')
      .replace(/kontenLengkap/g, 'kontenlengkap')
      .replace(/created_at/g, 'created_at');
    const result = await pool.query(pgSql, params);
    // Normalisasi nama kolom kembali ke camelCase untuk frontend
    return result.rows.map(row => ({
      ...row,
      deskripsiSingkat: row.deskripssingkat ?? row.deskripsisingkat ?? row.deskripsiSingkat,
      kontenLengkap: row.kontenlengkap ?? row.kontenlengkap ?? row.kontenLengkap,
    }));
  };

  run = async (sql, params = []) => {
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
    // Buat tabel dengan nama kolom lowercase
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
      if (!adminPass) { console.warn('⚠️  ADMIN_PASSWORD tidak diset!'); return; }
      const hash = bcrypt.hashSync(adminPass, 10);
      await pool.query('INSERT INTO admin (username, password) VALUES ($1, $2)', [adminUser, hash]);
      console.log(`✅ Akun admin "${adminUser}" berhasil dibuat`);
    }
    console.log('✅ Database PostgreSQL siap');
  };

  initDB().catch(err => console.error('❌ Gagal init database:', err.message));

} else {
  console.log('⚠️  DATABASE_URL tidak ditemukan, menggunakan SQLite');
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const fs = require('fs');

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'buttaporea.db');

  db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('❌ Gagal membuka database:', err.message);
    else console.log('✅ SQLite terhubung:', dbPath);
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS berita (id INTEGER PRIMARY KEY AUTOINCREMENT, judul TEXT NOT NULL, deskripsiSingkat TEXT, kontenLengkap TEXT, gambar TEXT, tanggal TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS kontak (id INTEGER PRIMARY KEY AUTOINCREMENT, nama TEXT NOT NULL, email TEXT NOT NULL, pesan TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
    db.get('SELECT * FROM admin LIMIT 1', (err, row) => {
      if (!row) {
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!adminPass) { console.warn('⚠️  ADMIN_PASSWORD tidak diset!'); return; }
        const hash = bcrypt.hashSync(adminPass, 10);
        db.run('INSERT INTO admin (username, password) VALUES (?, ?)',
          [process.env.ADMIN_USERNAME || 'admin', hash],
          (err) => { if (!err) console.log('✅ Akun admin dibuat'); });
      }
    });
  });

  query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });

  run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

module.exports = { query, run, db: db || pool };
