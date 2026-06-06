# Website ButtaPorea Dinamis

Website company profile dinamis Yayasan ButtaPorea menggunakan Node.js + Express + SQLite.

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: SQLite (file-based)
- **Auth**: express-session + bcrypt
- **Upload**: Multer

---

## Setup Lokal

### 1. Clone & Install
```bash
git clone https://github.com/aswanazis/Webbuttaporea-dinamis.git
cd Webbuttaporea-dinamis/buttaporea-dinamis
npm install
```

### 2. Buat file .env
```bash
cp .env.example .env
```
Lalu edit `.env` dan isi nilai-nilainya:
```
SESSION_SECRET=buat_string_acak_panjang_di_sini
ADMIN_USERNAME=admin
ADMIN_PASSWORD=passwordkamu
NODE_ENV=development
```

Cara buat SESSION_SECRET yang aman:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Jalankan
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Buka di browser: http://localhost:3000
Admin panel: http://localhost:3000/admin.html

---

## Deploy ke Railway

1. Push kode ke GitHub (pastikan `.env` dan `*.db` ada di `.gitignore`)
2. Buka [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Pilih repo ini
4. Di Railway → **Variables**, tambahkan:
   - `SESSION_SECRET` = string acak panjang
   - `ADMIN_USERNAME` = admin
   - `ADMIN_PASSWORD` = password kuat
   - `NODE_ENV` = production
5. Di Railway → **Volumes**, tambahkan volume dan mount ke `/app/public/uploads` (untuk gambar persisten)
6. Deploy otomatis berjalan — akses via URL yang diberikan Railway

---

## Struktur Folder
```
buttaporea-dinamis/
├── server.js          # Entry point, semua route API
├── database.js        # Koneksi SQLite & inisialisasi tabel
├── package.json
├── .env.example       # Template environment variables
├── .gitignore
├── railway.toml       # Konfigurasi deploy Railway
└── public/
    ├── index.html     # Halaman utama
    ├── admin.html     # Admin panel
    ├── script.js      # Frontend JS
    ├── style.css      # Styling
    └── uploads/       # Gambar yang diupload
```

## API Endpoints

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/api/berita` | Publik | Semua berita |
| GET | `/api/berita/:id` | Publik | Detail berita |
| POST | `/api/kontak` | Publik | Kirim pesan |
| POST | `/admin/login` | - | Login admin |
| GET | `/admin/logout` | Admin | Logout |
| POST | `/admin/berita` | Admin | Tambah berita |
| PUT | `/admin/berita/:id` | Admin | Edit berita |
| DELETE | `/admin/berita/:id` | Admin | Hapus berita |
| GET | `/admin/kontak` | Admin | Lihat pesan |
