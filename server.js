require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { query, run } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ FIX 1: Session secret dari environment variable, bukan hardcoded
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-dev-secret-ganti-di-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ✅ FIX 2: Path upload absolut supaya tidak error di production
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/uploads/')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

// Batasi tipe file dan ukuran (maks 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Hanya file gambar yang diizinkan'));
  }
});

// ========== API PUBLIK ==========
app.get('/api/berita', async (req, res) => {
  try {
    const berita = await query('SELECT * FROM berita ORDER BY created_at DESC');
    res.json(berita);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data berita' });
  }
});

app.get('/api/berita/:id', async (req, res) => {
  try {
    const berita = await query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    if (berita.length === 0) return res.status(404).json({ error: 'Tidak ditemukan' });
    res.json(berita[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil berita' });
  }
});

app.post('/api/kontak', async (req, res) => {
  try {
    const { nama, email, pesan } = req.body;
    if (!nama || !email || !pesan) return res.status(400).json({ error: 'Semua field harus diisi' });
    await run('INSERT INTO kontak (nama, email, pesan) VALUES (?, ?, ?)', [nama, email, pesan]);
    res.json({ message: 'Pesan terkirim. Terima kasih!' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengirim pesan' });
  }
});

// ========== ADMIN LOGIN ==========
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi' });
    const admin = await query('SELECT * FROM admin WHERE username = ?', [username]);
    if (admin.length === 0) return res.status(401).json({ error: 'Username atau password salah' });
    const match = await bcrypt.compare(password, admin[0].password);
    if (!match) return res.status(401).json({ error: 'Username atau password salah' });
    req.session.admin = true;
    req.session.adminId = admin[0].id;
    res.json({ message: 'Login sukses', redirect: '/admin.html' });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin.html');
});

function isAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ========== CRUD BERITA (ADMIN) ==========
app.post('/admin/berita', isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsiSingkat, kontenLengkap, tanggal } = req.body;
    if (!judul) return res.status(400).json({ error: 'Judul wajib diisi' });
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await run(
      'INSERT INTO berita (judul, deskripsiSingkat, kontenLengkap, gambar, tanggal) VALUES (?, ?, ?, ?, ?)',
      [judul, deskripsiSingkat, kontenLengkap, gambar, tanggal || new Date().toISOString().split('T')[0]]
    );
    res.json({ id: result.id, message: 'Berita ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan berita' });
  }
});

app.put('/admin/berita/:id', isAdmin, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsiSingkat, kontenLengkap, tanggal } = req.body;
    let gambar = req.body.gambar_lama;
    if (req.file) gambar = `/uploads/${req.file.filename}`;
    await run(
      'UPDATE berita SET judul=?, deskripsiSingkat=?, kontenLengkap=?, gambar=?, tanggal=? WHERE id=?',
      [judul, deskripsiSingkat, kontenLengkap, gambar, tanggal, req.params.id]
    );
    res.json({ message: 'Berita diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui berita' });
  }
});

app.delete('/admin/berita/:id', isAdmin, async (req, res) => {
  try {
    await run('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.json({ message: 'Berita dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus berita' });
  }
});

app.get('/admin/kontak', isAdmin, async (req, res) => {
  try {
    const pesan = await query('SELECT * FROM kontak ORDER BY created_at DESC');
    res.json(pesan);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data kontak' });
  }
});

// ✅ FIX 3: Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  if (err.message === 'Hanya file gambar yang diizinkan') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
});
