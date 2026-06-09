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

// Gambar disimpan di Cloudinary - tidak perlu static uploads route

// Session store - gunakan memory store (cukup untuk production skala kecil)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-dev-secret-ganti-di-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 * 24,
    httpOnly: true,
    secure: false
  }
}));

// Upload gambar ke Cloudinary (persistent, tidak hilang saat restart)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'buttaporea',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }]
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
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


// ========== TRANSLATE via Google Translate (gratis) ==========
async function googleTranslate(text, from = 'id', to = 'en') {
  if (!text || text.trim() === '') return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(chunk => chunk[0]).join('');
}

app.post('/api/translate', async (req, res) => {
  try {
    const { articles } = req.body;
    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Format tidak valid' });
    }

    const translated = await Promise.all(articles.map(async (article) => {
      try {
        const [judul, deskripsiSingkat, kontenLengkap] = await Promise.all([
          googleTranslate(article.judul || ''),
          googleTranslate(article.deskripsiSingkat || ''),
          googleTranslate(article.kontenLengkap || '')
        ]);
        return { ...article, judul, deskripsiSingkat, kontenLengkap };
      } catch (err) {
        console.error('Gagal terjemahkan artikel', article.id, err.message);
        return article;
      }
    }));

    res.json({ translated });

  } catch (err) {
    console.error('Translate error:', err.message);
    res.status(500).json({ error: 'Terjemahan gagal: ' + err.message });
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
    res.json({ message: 'Login sukses' });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Cek apakah sesi admin masih aktif
app.get('/admin/check', (req, res) => {
  if (req.session && req.session.admin) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
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
    const gambar = req.file ? req.file.path : null; // Cloudinary URL
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
    if (req.file) gambar = req.file.path; // Cloudinary URL
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

// Global error handler
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