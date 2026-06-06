// ========== MOBILE MENU TOGGLE (tetap) ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ========== SMOOTH SCROLL (tetap) ==========
document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== "#") {
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    }
  });
});

// ========== FADE-UP ON SCROLL ==========
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 252, 240, 0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.background = 'rgba(255, 252, 240, 0.96)';
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
  }
});

// ========== STAT COUNTER ANIMATION (tetap) ==========
const statNumbers = document.querySelectorAll('.stat-number');
const animateNumber = (el, target) => {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.innerText = target + (target === 12 ? '+' : target === 2400 ? '+' : '+');
      clearInterval(timer);
    } else {
      el.innerText = current;
    }
  }, 25);
};
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEl = entry.target;
      const rawText = statEl.innerText;
      let targetNumber = 0;
      if (rawText.includes('12+')) targetNumber = 12;
      else if (rawText.includes('2.400')) targetNumber = 2400;
      else if (rawText.includes('35+')) targetNumber = 35;
      if (targetNumber) {
        statEl.innerText = '0';
        animateNumber(statEl, targetNumber);
      }
      statObserver.unobserve(statEl);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(stat => statObserver.observe(stat));

// ========== FORM HANDLER (Kirim ke backend sendiri) ==========
const form = document.getElementById('contactForm');
const feedbackDiv = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !email || !pesan) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Harap isi semua bidang!</span>';
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">✉️ Email tidak valid.</span>';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-pulse"></i>';
    feedbackDiv.innerHTML = '';

    try {
      const response = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, pesan })
      });
      const data = await response.json();
      if (response.ok) {
        feedbackDiv.innerHTML = `<span style="color:#2b7a3e;">✅ ${data.message || 'Pesan terkirim!'}</span>`;
        form.reset();
      } else {
        feedbackDiv.innerHTML = `<span style="color:#d9534f;">❌ ${data.error || 'Gagal mengirim'}</span>`;
      }
    } catch (error) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Gagal terhubung ke server.</span>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Kirim Pesan <i class="fas fa-paper-plane"></i>';
      setTimeout(() => { if (feedbackDiv.innerHTML) feedbackDiv.innerHTML = ''; }, 6000);
    }
  });
}

// ========== FITUR BERITA DINAMIS DARI BACKEND ==========
const beritaGrid = document.getElementById('beritaGrid');

async function loadBerita() {
  if (!beritaGrid) return;
  beritaGrid.innerHTML = '<div style="text-align:center; padding:2rem;">🔄 Memuat berita...</div>';
  
  try {
    const res = await fetch('/api/berita');
    if (!res.ok) throw new Error('Gagal mengambil data');
    const beritaList = await res.json();
    displayBerita(beritaList);
  } catch (err) {
    console.error(err);
    beritaGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#d9534f;">❌ Gagal memuat berita, coba lagi nanti.</div>';
  }
}

function displayBerita(beritaArray) {
  if (!beritaGrid) return;
  beritaGrid.innerHTML = '';
  
  if (beritaArray.length === 0) {
    beritaGrid.innerHTML = '<div style="text-align:center; padding:2rem;">Belum ada berita. Silakan cek lagi nanti.</div>';
    return;
  }

  beritaArray.forEach(berita => {
    const card = document.createElement('div');
    card.className = 'berita-card fade-up';
    // Gunakan gambar default jika tidak ada
    const imgSrc = berita.gambar && berita.gambar !== 'null' ? berita.gambar : 'https://via.placeholder.com/600x400?text=Gambar+Berita';
    card.innerHTML = `
      <img class="berita-img" src="${imgSrc}" alt="${berita.judul}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x400?text=Gambar+Tidak+Tersedia'">
      <div class="berita-info">
        <div class="berita-tanggal"><i class="far fa-calendar-alt"></i> ${berita.tanggal || 'Tanggal tidak tersedia'}</div>
        <h3 class="berita-judul">${berita.judul}</h3>
        <p class="berita-deskripsi">${(berita.deskripsiSingkat || '').substring(0, 100)}${(berita.deskripsiSingkat || '').length > 100 ? '...' : ''}</p>
        <button class="btn-berita" data-id="${berita.id}">Baca Selengkapnya <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    beritaGrid.appendChild(card);
  });

  // Pasang event listener untuk tombol baca selengkapnya
  document.querySelectorAll('.btn-berita').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.dataset.id;
      try {
        const res = await fetch(`/api/berita/${id}`);
        if (!res.ok) throw new Error();
        const berita = await res.json();
        showModal(berita);
      } catch (err) {
        alert('Gagal memuat detail berita');
      }
    });
  });

  // Trigger fade-up untuk card baru
  const newFade = document.querySelectorAll('.fade-up');
  newFade.forEach(el => observer.observe(el));
}

// Modal untuk detail berita (sama seperti sebelumnya, tapi konten dari parameter)
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
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }
  const modalImg = modal.querySelector('.modal-img');
  const modalJudul = modal.querySelector('.modal-judul');
  const modalTanggal = modal.querySelector('.modal-tanggal');
  const modalBody = modal.querySelector('.modal-body');
  modalImg.src = berita.gambar && berita.gambar !== 'null' ? berita.gambar : 'https://via.placeholder.com/600x400?text=No+Image';
  modalJudul.textContent = berita.judul;
  modalTanggal.innerHTML = `<i class="far fa-calendar-alt"></i> ${berita.tanggal || 'Tanggal tidak diketahui'}`;
  modalBody.innerHTML = `<p>${berita.kontenLengkap || berita.deskripsiSingkat || 'Tidak ada konten lengkap.'}</p><p style="margin-top:1rem;"><strong>#ButtaPorea #UrbanFarming</strong></p>`;
  modal.style.display = 'flex';
}

// Escape key close modal
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('beritaModal');
  if (e.key === 'Escape' && modal && modal.style.display === 'flex') modal.style.display = 'none';
});

// Panggil loadBerita ketika halaman siap
if (beritaGrid) {
  loadBerita();
}