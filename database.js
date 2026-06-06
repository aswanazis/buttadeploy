const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// ✅ FIX: Gunakan path absolut agar database selalu ditemukan
const dbPath = path.join(__dirname, 'buttaporea.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Gagal membuka database:', err.message);
  } else {
    console.log('✅ Database terhubung:', dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS berita (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      deskripsiSingkat TEXT,
      kontenLengkap TEXT,
      gambar TEXT,
      tanggal TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS kontak (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT NOT NULL,
      pesan TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // ✅ FIX: Baca password admin dari .env, BUKAN hardcoded
  // Hanya buat akun jika belum ada sama sekali
  db.get('SELECT * FROM admin LIMIT 1', (err, row) => {
    if (!row) {
      const adminUser = process.env.ADMIN_USERNAME || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD;

      if (!adminPass) {
        console.warn('⚠️  ADMIN_PASSWORD tidak diset di .env!');
        console.warn('⚠️  Tambahkan ADMIN_PASSWORD=passwordkamu ke file .env');
        return;
      }

      const hash = bcrypt.hashSync(adminPass, 10);
      db.run(
        'INSERT INTO admin (username, password) VALUES (?, ?)',
        [adminUser, hash],
        (err) => {
          if (err) console.error('Gagal buat admin:', err);
          else console.log(`✅ Akun admin "${adminUser}" berhasil dibuat dari .env`);
        }
      );
    }
  });
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

module.exports = { db, query, run };
