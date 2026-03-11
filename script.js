/* ═══════════════════════════════════════════════════════════
   AL-NAHIL CLINIC — script.js
   Animations, Bilingual Toggle, Interactions
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── GSAP Registration ─────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────
   1. PRELOADER
──────────────────────────────────────────────────────── */
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initHeroAnimation();
  }, 2600);
});

document.body.style.overflow = 'hidden';

/* ────────────────────────────────────────────────────────
   2. BILINGUAL TOGGLE (EN / AR)
──────────────────────────────────────────────────────── */
const LANG_KEY = 'alnahil_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function applyLanguage(lang) {
  const html = document.documentElement;
  const labelEn = document.querySelector('.lang-en');
  const labelAr = document.querySelector('.lang-ar');

  if (lang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    labelEn.classList.remove('active');
    labelAr.classList.add('active');
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    labelEn.classList.add('active');
    labelAr.classList.remove('active');
  }

  // Swap all data-en / data-ar text content
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'OPTION') {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
    }
  });

  // Swap placeholder attributes
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    el.placeholder = lang === 'ar' ? el.dataset.placeholderAr : el.dataset.placeholderEn;
  });

  // Swap select option text
  document.querySelectorAll('option[data-en]').forEach(opt => {
    opt.textContent = lang === 'ar' ? opt.dataset.ar : opt.dataset.en;
  });

  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

// Apply on load
applyLanguage(currentLang);

// Toggle button
document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'ar' : 'en');
});

/* ────────────────────────────────────────────────────────
   3. NAVBAR: Scroll behaviour + Hamburger
──────────────────────────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    document.body.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
    document.body.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ────────────────────────────────────────────────────────
   4. SMOOTH SCROLL for nav links
──────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────────────────
   5. HERO ANIMATIONS
──────────────────────────────────────────────────────── */
function initHeroAnimation() {
  const words  = document.querySelectorAll('.hero .word');
  const sub    = document.querySelector('.hero-sub');
  const ctas   = document.querySelector('.hero-ctas');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(words, {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    duration: 1.1,
    stagger: 0.18,
  })
  .to(sub, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
  .to(ctas, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
}

/* ────────────────────────────────────────────────────────
   6. TRUST STRIP — Fade in + Counter
──────────────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.trust-strip',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('.trust-item', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
    });
    animateCounter();
  },
  once: true,
});

function animateCounter() {
  const el = document.querySelector('.counter');
  if (!el) return;
  const target = parseInt(el.dataset.target, 10);
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ────────────────────────────────────────────────────────
   7. SERVICE CARDS — Staggered fade up
──────────────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.services-grid',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.service-card', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    });
  },
  once: true,
});

ScrollTrigger.create({
  trigger: '.quick-treatments',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('.quick-item', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    });
  },
  once: true,
});

// Treatments expand/collapse toggle
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    const isOpen = list.classList.toggle('open');
    btn.textContent = currentLang === 'ar'
      ? (isOpen ? 'إخفاء العلاجات −' : 'عرض العلاجات +')
      : (isOpen ? 'Hide Treatments −' : 'View Treatments +');
  });
});

/* ────────────────────────────────────────────────────────
   8. ABOUT SECTION — Image from left, text from right
──────────────────────────────────────────────────────── */
gsap.from('.about-img', {
  scrollTrigger: { trigger: '.about-section', start: 'top 75%', once: true },
  x: -80,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
});

gsap.from('.about-text', {
  scrollTrigger: { trigger: '.about-section', start: 'top 75%', once: true },
  x: 80,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  delay: 0.15,
});

ScrollTrigger.create({
  trigger: '.about-section',
  start: 'top 70%',
  onEnter: () => document.querySelector('.about-img').classList.add('in-view'),
  once: true,
});

/* ────────────────────────────────────────────────────────
   9. DOCTOR SECTION — Elegant fade up
──────────────────────────────────────────────────────── */
gsap.to('.doctor-card', {
  scrollTrigger: { trigger: '.doctor-card', start: 'top 80%', once: true },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out',
});

/* ────────────────────────────────────────────────────────
  10. BEFORE & AFTER SLIDERS
──────────────────────────────────────────────────────── */
// Pop-in animation
ScrollTrigger.create({
  trigger: '.ba-grid',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.ba-card', {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.2)',
    });
  },
  once: true,
});

// Drag logic
document.querySelectorAll('.ba-slider-wrap').forEach(wrap => {
  const range  = wrap.querySelector('.ba-range');
  const after  = wrap.querySelector('.ba-after');
  const handle = wrap.querySelector('.ba-handle');

  function updateSlider(val) {
    const pct = val + '%';
    after.style.clipPath  = `inset(0 ${100 - val}% 0 0)`;
    handle.style.left = pct;
  }

  range.addEventListener('input', () => updateSlider(parseInt(range.value, 10)));
  updateSlider(50);
});

/* ────────────────────────────────────────────────────────
  11. VIDEO REEL — Autoplay + Mute/Unmute toggle + Arrows
──────────────────────────────────────────────────────── */
const reelTrack     = document.getElementById('reel-track');
const reelWrap      = document.getElementById('reel-track-wrap');
const arrowLeft     = document.querySelector('.reel-arrow-left');
const arrowRight    = document.querySelector('.reel-arrow-right');

// --- Mute / Unmute toggle on click ---
let iconFadeTimers = new WeakMap();

document.querySelectorAll('.reel-item').forEach(item => {
  const video     = item.querySelector('video');
  const soundIcon = item.querySelector('.reel-sound-icon');
  const iconEl    = soundIcon.querySelector('i');

  // Ensure autoplay fires (some browsers need a nudge)
  video.play().catch(() => {});

  item.addEventListener('click', () => {
    // Toggle mute — video always keeps playing
    video.muted = !video.muted;

    // Update icon
    iconEl.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';

    // Show icon, then fade after 1.5s
    soundIcon.style.opacity = '1';
    clearTimeout(iconFadeTimers.get(item));
    iconFadeTimers.set(item, setTimeout(() => {
      soundIcon.style.opacity = '0';
    }, 1500));
  });
});

// --- Auto-scroll pause / resume via CSS animation ---
let reelResumeTimer = null;

function pauseReelScroll() {
  reelTrack.style.animationPlayState = 'paused';
  clearTimeout(reelResumeTimer);
  reelResumeTimer = setTimeout(resumeReelScroll, 3000);
}

function resumeReelScroll() {
  reelTrack.style.animationPlayState = 'running';
}

// --- Arrow click: manual scroll by one card width ---
const CARD_WIDTH = 220 + 20; // card width + gap

arrowLeft.addEventListener('click', () => {
  pauseReelScroll();
  reelWrap.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
});

arrowRight.addEventListener('click', () => {
  pauseReelScroll();
  reelWrap.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
});

/* ────────────────────────────────────────────────────────
  12. FAQ — Section fade-in with stagger
──────────────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.faq-list',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.faq-item', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
    });
  },
  once: true,
});

/* ────────────────────────────────────────────────────────
  13. CONTACT FORM
──────────────────────────────────────────────────────── */
gsap.to('.contact-form-wrap', {
  scrollTrigger: { trigger: '.contact-section', start: 'top 80%', once: true },
  opacity: 1,
  y: 0,
  duration: 0.9,
  ease: 'power3.out',
  delay: 0.2,
});

// Contact form submission (Google Apps Script AJAX)
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const action = contactForm.getAttribute('action');
  if (action.includes('PLACEHOLDER')) {
    // Dev mode — just show success message
    contactSuccess.hidden = false;
    contactForm.reset();
    return;
  }
  const data = new FormData(contactForm);
  try {
    await fetch(action, { method: 'POST', body: data, mode: 'no-cors' });
    contactSuccess.hidden = false;
    contactForm.reset();
  } catch (err) {
    console.error('Form submission error:', err);
  }
});

/* ────────────────────────────────────────────────────────
  14. POPUP FORM — 7s delay, sessionStorage guard
──────────────────────────────────────────────────────── */
const POPUP_KEY    = 'alnahil_popup_shown';
const popupOverlay = document.getElementById('popup-overlay');
const popupClose   = document.getElementById('popup-close');
const popupForm    = document.getElementById('popup-form');
const popupSuccess = document.getElementById('popup-success');

if (!sessionStorage.getItem(POPUP_KEY)) {
  setTimeout(() => {
    popupOverlay.classList.add('active');
    sessionStorage.setItem(POPUP_KEY, '1');
  }, 7000);
}

function closePopup() {
  popupOverlay.classList.remove('active');
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', e => {
  if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

popupForm.addEventListener('submit', async e => {
  e.preventDefault();
  const action = popupForm.getAttribute('action');
  if (action.includes('PLACEHOLDER')) {
    popupSuccess.hidden = false;
    popupForm.reset();
    setTimeout(closePopup, 2000);
    return;
  }
  const data = new FormData(popupForm);
  try {
    await fetch(action, { method: 'POST', body: data, mode: 'no-cors' });
    popupSuccess.hidden = false;
    popupForm.reset();
    setTimeout(closePopup, 2000);
  } catch (err) {
    console.error('Popup form error:', err);
  }
});

/* ────────────────────────────────────────────────────────
  15. SECTION ANIMATIONS — Generic scroll reveals
──────────────────────────────────────────────────────── */
// Section headers
gsap.utils.toArray('.section-header').forEach(header => {
  gsap.from(header, {
    scrollTrigger: { trigger: header, start: 'top 85%', once: true },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
  });
});

// Doctor section header
gsap.from('.doctor-section .section-header', {
  scrollTrigger: { trigger: '.doctor-section', start: 'top 80%', once: true },
  opacity: 0,
  y: 24,
  duration: 0.7,
  ease: 'power2.out',
});

// Testimonials section header
gsap.from('.testimonials-section .section-header', {
  scrollTrigger: { trigger: '.testimonials-section', start: 'top 85%', once: true },
  opacity: 0,
  y: 24,
  duration: 0.7,
});

// Contact section label/header
gsap.from('.contact-section .section-header', {
  scrollTrigger: { trigger: '.contact-section', start: 'top 85%', once: true },
  opacity: 0,
  y: 24,
  duration: 0.7,
});

/* ────────────────────────────────────────────────────────
  16. LANGUAGE TOGGLE — keep treatment buttons synced
──────────────────────────────────────────────────────── */
// After language change, re-check open/closed toggle button text
const originalApply = applyLanguage;
// (already handled within applyLanguage by data-en/data-ar on button elements)

/* ────────────────────────────────────────────────────────
  17. NAP CONTACT — inline hover highlight
──────────────────────────────────────────────────────── */
document.querySelectorAll('.nap-item a').forEach(a => {
  a.style.transition = 'color 0.3s';
});

/* ────────────────────────────────────────────────────────
  18. FOOTER LINKS — smooth scroll
──────────────────────────────────────────────────────── */
// Already handled by global smooth scroll listener above.

/* ────────────────────────────────────────────────────────
  19. SCROLL PROGRESS INDICATOR (subtle gold top bar)
──────────────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(to right, #C9A96E, #E8D5B0);
  z-index: 9998;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled   = window.scrollY;
  const maxScroll  = document.body.scrollHeight - window.innerHeight;
  const pct        = (scrolled / maxScroll) * 100;
  progressBar.style.width = pct + '%';
});

/* ────────────────────────────────────────────────────────
  20. IMAGE LAZY LOADING FALLBACK
──────────────────────────────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.background = 'linear-gradient(135deg, #f5f0e8 0%, #e8d5b0 100%)';
    img.style.minHeight  = '200px';
  });
});
