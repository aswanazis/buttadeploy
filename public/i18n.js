// ============================================
// i18n.js - Sistem 2 Bahasa ButtaPorea
// Indonesia (id) & English (en)
// ============================================

const translations = {
  id: {
    // Navbar
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_programs: "Program",
    nav_gallery: "Galeri",
    nav_news: "Berita",
    nav_contact: "Kontak",

    // Hero
    hero_title: "Menanam Kota, <br> Melestarikan Bumi",
    hero_desc: "Pusat Edukasi, Praktik & Replikasi Urban Farming Terintegrasi. Memberdayakan masyarakat lokal untuk ketahanan pangan dan lingkungan hijau.",
    hero_btn_program: "Jelajahi Program",
    hero_btn_volunteer: "Gabung Relawan",

    // About
    about_title: "Yayasan ButtaPorea Indonesia",
    about_desc: "Berfokus pada pengembangan pusat edukasi, praktik urban farming, dan replikasi model pertanian perkotaan yang ramah lingkungan. Kami bekerja bersama masyarakat lokal untuk menciptakan ekosistem pangan berkelanjutan, mengurangi jejak karbon, dan menghidupkan kembali kearifan lokal dalam pelestarian alam.",
    about_vision: "<strong>Visi:</strong> Perkotaan hijau, mandiri pangan, dan harmonis dengan alam.",
    about_mission: "<strong>Misi:</strong> Edukasi urban farming, pendampingan replikasi, serta gerakan lingkungan berbasis komunitas.",
    stat_community: "Komunitas Binaan",
    stat_volunteer: "Relawan Aktif",
    stat_garden: "Kebun Percontohan",

    // Programs
    programs_title: "Program Unggulan Kami",
    programs_sub: "Edukasi terintegrasi, praktik langsung, hingga replikasi skala komunitas untuk keberlanjutan lingkungan.",
    prog1_title: "Pusat Edukasi",
    prog1_desc: "Pelatihan hidroponik, vertikultur, dan pengelolaan sampah organik. Workshop untuk anak muda & ibu rumah tangga.",
    prog2_title: "Praktik Urban Farming Terintegrasi",
    prog2_desc: "Lahan percontohan di atap gedung & pekarangan sempit. Demo teknik pertanian modern yang zero waste.",
    prog3_title: "Replikasi Model",
    prog3_desc: "Pendampingan pembuatan kebun komunitas, dari perencanaan hingga panen. Dukung regenerasi kawasan hijau.",
    prog4_title: "Gerakan Lestari Bumi",
    prog4_desc: "Bank sampah, daur ulang, penanaman pohon massal, dan kampanye sungai bersih berbasis masyarakat lokal.",

    // Gallery
    gallery_title: "Momen Aksi Nyata",
    gallery_sub: "Dari edukasi hingga panen bersama, setiap langkah kecil memberi dampak besar bagi lingkungan.",

    // News
    news_title: "Berita & Kegiatan Terbaru",
    news_sub: "Ikuti aksi nyata kami dalam mewujudkan urban farming berkelanjutan dan pelestarian lingkungan.",
    news_read_more: "Baca Selengkapnya",
    news_empty: "Belum ada berita.",

    // Contact
    contact_title: "Jadi Bagian dari Perubahan",
    contact_sub: "Isi formulir berikut untuk menjadi relawan, mitra, atau sekadar bertanya tentang program urban farming.",
    contact_name: "Nama Lengkap",
    contact_email: "Alamat Email",
    contact_message: "Pesan / Minat Bergabung (relawan, edukasi, donasi, dll)",
    contact_send: "Kirim Pesan",
    contact_success: "✅ Pesan berhasil dikirim! Kami akan segera menghubungi Anda.",
    contact_error: "❌ Gagal mengirim pesan. Silakan coba lagi.",

    // Footer
    footer_desc: "Yayasan yang berfokus pada pengembangan pusat edukasi, praktik urban farming, dan pelestarian lingkungan berbasis masyarakat lokal.",
    footer_address_title: "Alamat Sekretariat",
    footer_follow: "Ikuti Kami",
    footer_copyright: "© 2026 Yayasan Butta Porea<br>Edukasi, Praktik & Replikasi Urban Farming Berkelanjutan",
    footer_tagline: "🌱 Bersama Masyarakat Lokal untuk Bumi Lebih Hijau",

    // Video
    video_title: "Video Kegiatan",
    video_sub: "Dokumentasi kegiatan urban farming dan pelestarian lingkungan kami.",
    video_empty: "Belum ada video.",
    admin_menu_video: "🎬 Kelola Video",
    admin_add_video: "Tambah Video YouTube",
    admin_video_title: "Judul Video",
    admin_video_url: "URL YouTube (contoh: https://youtube.com/watch?v=xxx)",
    admin_video_desc: "Deskripsi singkat (opsional)",
    admin_video_list: "Daftar Video",
    admin_video_added: "Video ditambahkan",
    admin_video_deleted: "Video dihapus",
    admin_confirm_delete_video: "Yakin hapus video ini?",

    // Admin Panel
    admin_login_title: "Login Admin",
    admin_username: "Username",
    admin_password: "Password",
    admin_login_btn: "Login",
    admin_menu_news: "📰 Kelola Berita",
    admin_menu_contact: "📩 Pesan Kontak",
    admin_logout: "🚪 Logout",
    admin_add_news: "Tambah Berita Baru",
    admin_edit_news: "Edit Berita",
    admin_news_title: "Judul Berita",
    admin_news_date: "Tanggal (YYYY-MM-DD)",
    admin_news_desc: "Deskripsi singkat",
    admin_news_content: "Konten lengkap",
    admin_save: "Simpan",
    admin_cancel: "Batal",
    admin_news_list: "Daftar Berita",
    admin_col_id: "ID",
    admin_col_image: "Gambar",
    admin_col_title: "Judul",
    admin_col_date: "Tanggal",
    admin_col_action: "Aksi",
    admin_edit_btn: "Edit",
    admin_delete_btn: "Hapus",
    admin_contact_title: "Pesan dari Pengunjung",
    admin_col_name: "Nama",
    admin_col_email: "Email",
    admin_col_message: "Pesan",
    admin_saved: "Berita ditambahkan",
    admin_updated: "Berita diperbarui",
    admin_deleted: "Berita dihapus",
    admin_confirm_delete: "Yakin hapus berita ini?",
    admin_save_error: "Gagal menyimpan",
    admin_delete_error: "Gagal hapus",
    admin_no_news: "Belum ada berita",
  },

  en: {
    // Navbar
    nav_home: "Home",
    nav_about: "About",
    nav_programs: "Programs",
    nav_gallery: "Gallery",
    nav_news: "News",
    nav_contact: "Contact",

    // Hero
    hero_title: "Growing Cities, <br> Preserving the Earth",
    hero_desc: "An Integrated Center for Urban Farming Education, Practice & Replication. Empowering local communities for food security and a greener environment.",
    hero_btn_program: "Explore Programs",
    hero_btn_volunteer: "Join as Volunteer",

    // About
    about_title: "ButtaPorea Indonesia Foundation",
    about_desc: "Focused on developing education centers, urban farming practices, and replication of eco-friendly urban agriculture models. We work with local communities to create sustainable food ecosystems, reduce carbon footprints, and revive local wisdom in nature conservation.",
    about_vision: "<strong>Vision:</strong> Green cities, food independent, and in harmony with nature.",
    about_mission: "<strong>Mission:</strong> Urban farming education, replication assistance, and community-based environmental movements.",
    stat_community: "Communities Assisted",
    stat_volunteer: "Active Volunteers",
    stat_garden: "Pilot Gardens",

    // Programs
    programs_title: "Our Featured Programs",
    programs_sub: "Integrated education, hands-on practice, to community-scale replication for environmental sustainability.",
    prog1_title: "Education Center",
    prog1_desc: "Training in hydroponics, verticulture, and organic waste management. Workshops for youth & housewives.",
    prog2_title: "Integrated Urban Farming Practice",
    prog2_desc: "Pilot plots on rooftops & small yards. Demo of modern zero-waste farming techniques.",
    prog3_title: "Model Replication",
    prog3_desc: "Assistance in creating community gardens, from planning to harvest. Supporting green area regeneration.",
    prog4_title: "Earth Preservation Movement",
    prog4_desc: "Waste banks, recycling, mass tree planting, and community-based clean river campaigns.",

    // Gallery
    gallery_title: "Real Action Moments",
    gallery_sub: "From education to communal harvest, every small step makes a big impact on the environment.",

    // News
    news_title: "Latest News & Activities",
    news_sub: "Follow our real actions in realizing sustainable urban farming and environmental conservation.",
    news_read_more: "Read More",
    news_empty: "No news available yet.",

    // Contact
    contact_title: "Be Part of the Change",
    contact_sub: "Fill in the form below to become a volunteer, partner, or simply ask about our urban farming programs.",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_message: "Message / Interest in Joining (volunteer, education, donation, etc)",
    contact_send: "Send Message",
    contact_success: "✅ Message sent successfully! We will contact you soon.",
    contact_error: "❌ Failed to send message. Please try again.",

    // Footer
    footer_desc: "A foundation focused on developing education centers, urban farming practices, and community-based environmental conservation.",
    footer_address_title: "Secretariat Address",
    footer_follow: "Follow Us",
    footer_copyright: "© 2026 ButtaPorea Foundation<br>Education, Practice & Sustainable Urban Farming Replication",
    footer_tagline: "🌱 Together with Local Communities for a Greener Earth",

    // Video
    video_title: "Video Kegiatan",
    video_sub: "Dokumentasi kegiatan urban farming dan pelestarian lingkungan kami.",
    video_empty: "Belum ada video.",
    admin_menu_video: "🎬 Kelola Video",
    admin_add_video: "Tambah Video YouTube",
    admin_video_title: "Judul Video",
    admin_video_url: "URL YouTube (contoh: https://youtube.com/watch?v=xxx)",
    admin_video_desc: "Deskripsi singkat (opsional)",
    admin_video_list: "Daftar Video",
    admin_video_added: "Video ditambahkan",
    admin_video_deleted: "Video dihapus",
    admin_confirm_delete_video: "Yakin hapus video ini?",

    // Video
    video_title: "Activity Videos",
    video_sub: "Documentation of our urban farming and environmental conservation activities.",
    video_empty: "No videos yet.",
    admin_menu_video: "🎬 Manage Videos",
    admin_add_video: "Add YouTube Video",
    admin_video_title: "Video Title",
    admin_video_url: "YouTube URL (e.g: https://youtube.com/watch?v=xxx)",
    admin_video_desc: "Short description (optional)",
    admin_video_list: "Video List",
    admin_video_added: "Video added",
    admin_video_deleted: "Video deleted",
    admin_confirm_delete_video: "Are you sure you want to delete this video?",

    // Admin Panel
    admin_login_title: "Admin Login",
    admin_username: "Username",
    admin_password: "Password",
    admin_login_btn: "Login",
    admin_menu_news: "📰 Manage News",
    admin_menu_contact: "📩 Contact Messages",
    admin_logout: "🚪 Logout",
    admin_add_news: "Add New Article",
    admin_edit_news: "Edit Article",
    admin_news_title: "Article Title",
    admin_news_date: "Date (YYYY-MM-DD)",
    admin_news_desc: "Short description",
    admin_news_content: "Full content",
    admin_save: "Save",
    admin_cancel: "Cancel",
    admin_news_list: "Article List",
    admin_col_id: "ID",
    admin_col_image: "Image",
    admin_col_title: "Title",
    admin_col_date: "Date",
    admin_col_action: "Action",
    admin_edit_btn: "Edit",
    admin_delete_btn: "Delete",
    admin_contact_title: "Messages from Visitors",
    admin_col_name: "Name",
    admin_col_email: "Email",
    admin_col_message: "Message",
    admin_saved: "Article added",
    admin_updated: "Article updated",
    admin_deleted: "Article deleted",
    admin_confirm_delete: "Are you sure you want to delete this article?",
    admin_save_error: "Failed to save",
    admin_delete_error: "Failed to delete",
    admin_no_news: "No articles yet",
  }
};

// ============================================
// Fungsi inti i18n
// ============================================

function detectBrowserLang() {
  const lang = navigator.language || navigator.userLanguage || 'id';
  return lang.startsWith('id') ? 'id' : 'en';
}

function getCurrentLang() {
  return localStorage.getItem('bp_lang') || detectBrowserLang();
}

function setLang(lang, refreshNews = false) {
  // Simpan dulu ke localStorage sebelum refresh
  localStorage.setItem('bp_lang', lang);
  applyTranslations(lang);
  updateToggleBtn(lang);
  document.documentElement.lang = lang;
  // Refresh berita hanya saat user toggle manual, bukan saat pertama load
  if (refreshNews && typeof window.refreshBeritaDisplay === "function") {
    window.refreshBeritaDisplay();
  }
}

function t(key) {
  const lang = getCurrentLang();
  return translations[lang][key] || translations['id'][key] || key;
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val !== undefined) el.placeholder = val;
  });
}

function updateToggleBtn(lang) {
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.textContent = lang === 'id' ? '🌐 EN' : '🌐 ID';
}

function toggleLang() {
  const current = getCurrentLang();
  setLang(current === 'id' ? 'en' : 'id', true);
}

// Auto-apply saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  setLang(getCurrentLang());
});
