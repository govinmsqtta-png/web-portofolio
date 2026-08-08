// ============================================================
// PORTFOLIO - GOVINDHA MUSKITTA
// script.js
// ============================================================

// ============================================================
// 0. ANIMATED BACKGROUND PARTICLES (Canvas)
//    Membuat partikel-partikel kecil mengambang di background
//    menggunakan HTML5 Canvas API. Partikel bergerak perlahan
//    dan terhubung dengan garis jika jaraknya cukup dekat.
// ============================================================
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Jumlah partikel
  const PARTICLE_COUNT = 55;
  // Jarak maksimal antar partikel untuk ditarik garis penghubung
  const MAX_DISTANCE = 130;

  let particles = [];
  let animFrameId;

  // Sesuaikan ukuran canvas dengan jendela browser
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Tentukan warna partikel berdasarkan tema aktif
  function getParticleColor(alpha) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
      ? `rgba(129, 140, 248, ${alpha})`   /* ungu terang di dark mode */
      : `rgba(99, 102, 241, ${alpha})`;   /* indigo di light mode */
  }

  // Buat satu partikel dengan posisi & kecepatan acak
  function createParticle() {
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * 0.5,  /* kecepatan horizontal */
      vy:     (Math.random() - 0.5) * 0.5,  /* kecepatan vertikal */
      radius: Math.random() * 2 + 1,         /* ukuran 1-3px */
      alpha:  Math.random() * 0.5 + 0.2,    /* transparansi 0.2-0.7 */
    };
  }

  // Inisialisasi semua partikel
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  // Update posisi setiap partikel (1 frame)
  function updateParticles() {
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;

      // Pantul jika keluar batas kanan/kiri
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      // Pantul jika keluar batas atas/bawah
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  // Gambar semua partikel dan garis penghubung
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar garis antar partikel yang berdekatan
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          // Makin jauh makin transparan
          const lineAlpha = (1 - dist / MAX_DISTANCE) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = getParticleColor(lineAlpha);
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    }

    // Gambar setiap partikel sebagai lingkaran kecil
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor(p.alpha);
      ctx.fill();
    });
  }

  // Loop animasi utama (dipanggil ~60 kali per detik)
  function animate() {
    updateParticles();
    drawParticles();
    animFrameId = requestAnimationFrame(animate);
  }

  // Mulai
  resizeCanvas();
  initParticles();
  animate();

  // Sesuaikan ulang saat jendela diubah ukurannya
  window.addEventListener('resize', function () {
    resizeCanvas();
    initParticles(); // buat ulang posisi agar tidak keluar layar
  });
}());


// ============================================================
// 1. DOM ELEMENTS - Ambil semua elemen yang diperlukan
// ============================================================
const navbar      = document.getElementById('navbar');
const navToggle   = document.getElementById('navToggle');
const navMenu     = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const iconSun     = document.getElementById('iconSun');
const iconMoon    = document.getElementById('iconMoon');
const backToTopBtn   = document.getElementById('backToTop');
const footerYear     = document.getElementById('footerYear');
const typingText     = document.getElementById('typingText');
const contactForm    = document.getElementById('contactForm');
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const navLinks       = document.querySelectorAll('.nav-link');

// ============================================================
// 2. INISIALISASI - Jalankan saat halaman pertama dimuat
// ============================================================
footerYear.textContent = new Date().getFullYear();

// State dark mode — baca dari localStorage agar persisten setelah refresh
let isDarkMode = localStorage.getItem('theme') === 'dark';

// Terapkan tema yang tersimpan saat halaman dimuat
if (isDarkMode) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Update ikon tema sesuai state
function updateThemeIcon() {
  if (isDarkMode) {
    iconSun.style.display  = 'none';
    iconMoon.style.display = 'block';
  } else {
    iconSun.style.display  = 'block';
    iconMoon.style.display = 'none';
  }
}
updateThemeIcon();

// ============================================================
// 3. DARK / LIGHT MODE TOGGLE
// ============================================================
themeToggle.addEventListener('click', function () {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  updateThemeIcon();
});

// ============================================================
// 4. HAMBURGER MENU - Toggle buka/tutup navbar mobile
// ============================================================
navToggle.addEventListener('click', function () {
  const isOpen = navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Tutup menu saat link diklik (mobile)
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// 5. SMOOTH SCROLL - Navigasi halus saat klik menu
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight      = navbar.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 6. NAVBAR SCROLL BEHAVIOR
//    - Tambah class .scrolled saat scroll > 50px (shadow muncul)
//    - Highlight nav-link sesuai section yang aktif
// ============================================================
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight berdasarkan posisi scroll
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';
  sections.forEach(function (section) {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// 7. BACK TO TOP BUTTON
//    - Muncul setelah scroll 300px
//    - Klik scroll balik ke atas
// ============================================================
function handleBackToTop() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Gabungkan event scroll listener
window.addEventListener('scroll', function () {
  handleNavbarScroll();
  handleBackToTop();
});

// ============================================================
// 8. TYPING TEXT EFFECT
//    Menampilkan teks secara berurutan huruf per huruf,
//    lalu menghapusnya, lalu ganti ke teks berikutnya.
// ============================================================
const typingPhrases = [
  'Mahasiswa Ilmu Komputer',
  'IoT Enthusiast',
  'Content Creator',
  'Problem Solver'
];
let phraseIndex = 0;     // Indeks kata yang sedang ditampilkan
let charIndex   = 0;     // Indeks karakter dalam kata saat ini
let isDeleting  = false; // Apakah sedang mode hapus?

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (!isDeleting) {
    // Mode tulis: tambah karakter satu per satu
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      // Selesai menulis, tunggu 1.5 detik lalu mulai hapus
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
    setTimeout(typeEffect, 100); // Kecepatan menulis
  } else {
    // Mode hapus: kurangi karakter satu per satu
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      // Selesai menghapus, pindah ke frasa berikutnya
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
    setTimeout(typeEffect, 60); // Kecepatan menghapus (lebih cepat)
  }
}
typeEffect(); // Mulai efek typing

// ============================================================
// 9. SCROLL REVEAL ANIMATION (IntersectionObserver)
//    Elemen dengan class .reveal-on-scroll akan fade-in + slide-up
//    saat masuk viewport. Setelah revealed, observer berhenti
//    mengamati elemen tersebut (unobserve) agar efisien.
// ============================================================
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Stop observasi setelah reveal
      }
    });
  },
  {
    threshold:  0.15,              // Element dianggap visible saat 15% terlihat
    rootMargin: '0px 0px -50px 0px' // Trigger 50px sebelum batas bawah viewport
  }
);

revealElements.forEach(function (el) {
  revealObserver.observe(el);
});

// ============================================================
// 10. SKILL PROGRESS BAR ANIMATION (IntersectionObserver)
//     Lebar bar diisi sesuai nilai data-level saat section skills
//     masuk ke viewport.
// ============================================================
const skillBarObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(function (bar) {
          const level    = bar.getAttribute('data-level');
          bar.style.width = level + '%';
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.getElementById('skills');
if (skillsSection) {
  skillBarObserver.observe(skillsSection);
}

// ============================================================
// 11. FORM CONTACT VALIDATION
//     Validasi sederhana: cek apakah semua field terisi dan
//     format email valid sebelum "submit" diproses.
// ============================================================

// Helper: tampilkan pesan error pada span yang sesuai
function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}
// Helper: bersihkan pesan error
function clearError(elementId) {
  document.getElementById(elementId).textContent = '';
}
// Helper: validasi format email dengan regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Cegah reload halaman

  // Ambil nilai input
  const nama       = document.getElementById('inputNama').value.trim();
  const email      = document.getElementById('inputEmail').value.trim();
  const pesan      = document.getElementById('inputPesan').value.trim();
  const successMsg = document.getElementById('formSuccess');

  // Reset semua error
  clearError('errorNama');
  clearError('errorEmail');
  clearError('errorPesan');
  successMsg.textContent = '';

  let isValid = true;

  // Validasi nama
  if (nama === '') {
    showError('errorNama', 'Nama tidak boleh kosong.');
    isValid = false;
  }
  // Validasi email
  if (email === '') {
    showError('errorEmail', 'Email tidak boleh kosong.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('errorEmail', 'Format email tidak valid.');
    isValid = false;
  }
  // Validasi pesan
  if (pesan === '') {
    showError('errorPesan', 'Pesan tidak boleh kosong.');
    isValid = false;
  }

  // Jika semua valid, tampilkan pesan sukses
  if (isValid) {
    successMsg.textContent = 'Pesan berhasil dikirim! Saya akan segera membalas.';
    contactForm.reset(); // Bersihkan semua field form
    // Sembunyikan pesan sukses setelah 5 detik
    setTimeout(function () {
      successMsg.textContent = '';
    }, 5000);
  }
});

// ============================================================
// 12. ACTIVE NAV LINK STYLING
//     Set class .active saat nav-link diklik (sebagai fallback
//     sebelum scroll handler mengambil alih).
// ============================================================
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    // Hanya set active via klik jika bukan scroll yang sedang aktif
    // (scroll handler di handleNavbarScroll akan update ulang setelah scroll)
    navLinks.forEach(function (l) { l.classList.remove('active'); });
    this.classList.add('active');
  });
});

// Jalankan sekali saat load untuk set active link awal
handleNavbarScroll();
