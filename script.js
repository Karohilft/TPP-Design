/* ═══════════════════════════════════════
   TPP DESIGN — script.js
   Textil · Print · Plot · Österreich
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sticky nav ───────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Mobile menu ──────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth scroll (anchor links) ────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ───────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Stats counter ───────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateNum(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOutCubic(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statsBar.querySelectorAll('.stat-item__num').forEach(el => {
          animateNum(el, parseInt(el.dataset.target), el.dataset.suffix || '', 1800);
        });
        statsObs.unobserve(statsBar);
      });
    }, { threshold: 0.4 });
    statsObs.observe(statsBar);
  }

  /* ── Contact form ────────────────────── */
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Validate required fields
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('field-error');
        const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
        if (isEmpty) {
          field.classList.add('field-error');
          valid = false;
        }
      });

      if (!valid) {
        const first = form.querySelector('.field-error');
        if (first) first.focus();
        return;
      }

      // Submit state
      submitBtn.disabled = true;
      btnText.textContent = 'Wird gesendet …';

      /* ─────────────────────────────────────────────────────────
         TODO: Replace with real form endpoint.
         Option A: Formspree  →  action="https://formspree.io/f/YOURCODE"
         Option B: Netlify Forms → add netlify attribute to <form>
         Option C: Own PHP/backend → fetch('/mailer.php', {...})
      ───────────────────────────────────────────────────────── */
      setTimeout(() => {
        form.style.display = 'none';
        successBox.hidden = false;
      }, 1100);
    });

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('field-error'));
    });
  }

  /* ── Footer year ─────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
