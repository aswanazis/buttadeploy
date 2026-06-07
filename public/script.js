s// ========== MOBILE MENU TOGGLE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        window.scrollTo({ top: targetElem.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    }
  });
});

// ========== FADE-UP ON SCROLL ==========
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.background = window.scrollY > 50 ? 'rgba(255,252,240,0.98)' : 'rgba(255,252,240,0.96)';
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.08)' : '0 2px 20px rgba(0,0,0,0.05)';
  }
});

// ========== STAT COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');
const animateNumber = (el, target) => {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.innerText = target + '+'; clearInterval(timer); }
    else el.innerText = current;
  }, 25);
};
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.innerText;
      let num = 0;
      if (raw.includes('12')) num = 12;
      else if (raw.includes('2.400') || raw.includes('2400')) num = 2400;
      else if (raw.includes('35')) num = 35;
      if (num) { el.innerText = '0'; animateNumber(el, num); }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(stat => statObserver.observe(stat));

// ========== FORM HANDLER ==========
const form = document.getElementById('contactForm');
const feedbackDiv = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();
    if (!nama || !email || !pesan) { feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Harap isi semua bidang!</span>'; return; }
    if (!email.includes('@') || !email.includes('.')) { feedbackDiv.innerHTML = '<span style="color:#d9534f;">✉️ Email tidak valid.</span>'; return; }
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-pulse"></i>';
    feedbackDiv.innerHTML = '';
    try {
      const response = await fetch('/api/kontak', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, pesan })
      });
      const data = await response.json();
      if (response.ok) {
        feedbackDiv.innerHTML = `<span style="color:#2b7a3e;">${t('contact_success')}</span>`;
        form.reset();
      } else {
        feedbackDiv.innerHTML = `<span style="color:#d9534f;">${t('contact_error')}</span>`;
      }
    } catch {
      feedbackDiv.innerHTML = `<span style="color:#d9534f;">${t('contact_error')}</span>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span data-i18n="contact_send">${t('contact_send')}</span> <i class="fas fa-paper-plane"></i>`;
      setTimeout(() => { feedbackDiv.innerHTML = ''; }, 6000);
    }
  });
}

// ========== TERJEMAHAN BERITA via Claude AI ==========
// Cache terjemahan di sessionStorage supaya tidak request ulang
const translationCache = {};

async function translateBeritaWithAI(beritaList) {
  // Cek cache dulu
  const cacheKey = 'bp_news_en_' + beritaList.map(b => b.id).join('_');
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    translationCache[cacheKey] = JSON.parse(cached);
    return translationCache[cacheKey];
  }

  // Siapkan prompt untuk Claude
  const newsData = beritaList.map(b => ({
    id: b.id,
    judul: b.judul,
    deskripsiSingkat: b.deskripsiSingkat || '',
    kontenLengkap: b.kontenLengkap || ''
  }));

  try {
    // Panggil endpoint server (bukan Anthropic langsung — hindari CORS)
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: newsData })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Gagal');
    const translated = data.translated;

    // Merge hasil terjemahan dengan data asli (gambar, tanggal tetap dari asli)
    const merged = beritaList.map(original => {
      const tr = translated.find(t => t.id === original.id);
      return tr ? { ...original, judul: tr.judul, deskripsiSingkat: tr.deskripsiSingkat, kontenLengkap: tr.kontenLengkap } : original;
    });

    // Simpan ke cache
    translationCache[cacheKey] = merged;
    sessionStorage.setItem(cacheKey, JSON.stringify(merged));
    return merged;

  } catch (err) {
    console.warn('Terjemahan gagal, tampilkan bahasa asli:', err);
    return beritaList; // fallback ke bahasa Indonesia
  }
}

// ========== DATA BERITA (disimpan setelah fetch pertama) ==========
let originalBeritaList = [];

async function loadBerita() {
  const beritaGrid = document.getElementById('beritaGrid');
  if (!beritaGrid) return;

  beritaGrid.innerHTML = '<div style="text-align:center;padding:2rem;">🔄 Memuat berita...</div>';
  try {
    const res = await fetch('/api/berita');
    if (!res.ok) throw new Error();
    originalBeritaList = await res.json();
    await displayBeritaByLang();
  } catch {
    beritaGrid.innerHTML = '<div style="text-align:center;padding:2rem;color:#d9534f;">❌ Gagal memuat berita.</div>';
  }
}

// Dipanggil saat bahasa berubah (dari i18n.js) atau saat pertama load
window.refreshBeritaDisplay = async function() {
  if (originalBeritaList.length > 0) await displayBeritaByLang();
};

async function displayBeritaByLang() {
  const beritaGrid = document.getElementById('beritaGrid');
  if (!beritaGrid) return;

  const lang = getCurrentLang();
  let beritaToShow = originalBeritaList;

  if (lang === 'en' && originalBeritaList.length > 0) {
    beritaGrid.innerHTML = '<div style="text-align:center;padding:2rem;">🌐 Translating news to English...</div>';
    beritaToShow = await translateBeritaWithAI(originalBeritaList);
  }

  renderBeritaCards(beritaToShow);
}

function renderBeritaCards(beritaArray) {
  const beritaGrid = document.getElementById('beritaGrid');
  if (!beritaGrid) return;
  beritaGrid.innerHTML = '';

  if (beritaArray.length === 0) {
    beritaGrid.innerHTML = `<div style="text-align:center;padding:2rem;">${t('news_empty')}</div>`;
    return;
  }

  beritaArray.forEach(berita => {
    const card = document.createElement('div');
    card.className = 'berita-card fade-up';
    const imgSrc = berita.gambar && berita.gambar !== 'null' ? berita.gambar : 'https://via.placeholder.com/600x400?text=Gambar+Berita';
    card.innerHTML = `
      <img class="berita-img" src="${imgSrc}" alt="${berita.judul}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
      <div class="berita-info">
        <div class="berita-tanggal"><i class="far fa-calendar-alt"></i> ${berita.tanggal || '-'}</div>
        <h3 class="berita-judul">${berita.judul}</h3>
        <p class="berita-deskripsi">${(berita.deskripsiSingkat || '').substring(0, 100)}${(berita.deskripsiSingkat || '').length > 100 ? '...' : ''}</p>
        <button class="btn-berita" data-id="${berita.id}">${t('news_read_more')} <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    beritaGrid.appendChild(card);
  });

  document.querySelectorAll('.btn-berita').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);
      const lang = getCurrentLang();
      let berita;

      if (lang === 'en') {
        const cacheKey = 'bp_news_en_' + originalBeritaList.map(b => b.id).join('_');
        const cached = translationCache[cacheKey] || JSON.parse(sessionStorage.getItem(cacheKey) || '[]');
        berita = cached.find(b => b.id === id) || originalBeritaList.find(b => b.id === id);
      } else {
        berita = originalBeritaList.find(b => b.id === id);
      }

      if (berita) showModal(berita);
    });
  });

  document.querySelectorAll('.berita-card.fade-up').forEach(el => observer.observe(el));
}

function showModal(berita) {
  let modal = document.getElementById('beritaModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'beritaModal';
    modal.className = 'berita-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img class="modal-img" src="" alt="">
        <h2 class="modal-judul"></h2>
        <div class="modal-tanggal"></div>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  }
  modal.querySelector('.modal-img').src = berita.gambar && berita.gambar !== 'null' ? berita.gambar : 'https://via.placeholder.com/600x400?text=No+Image';
  modal.querySelector('.modal-judul').textContent = berita.judul;
  modal.querySelector('.modal-tanggal').innerHTML = `<i class="far fa-calendar-alt"></i> ${berita.tanggal || '-'}`;
  modal.querySelector('.modal-body').innerHTML = `<p>${berita.kontenLengkap || berita.deskripsiSingkat || '-'}</p><p style="margin-top:1rem;"><strong>#ButtaPorea #UrbanFarming</strong></p>`;
  modal.style.display = 'flex';
}

document.addEventListener('keydown', e => {
  const modal = document.getElementById('beritaModal');
  if (e.key === 'Escape' && modal && modal.style.display === 'flex') modal.style.display = 'none';
});

if (document.getElementById('beritaGrid')) loadBerita();
