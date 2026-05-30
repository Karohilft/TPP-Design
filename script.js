(function () {
  'use strict';

  /* ── Sticky nav ─────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Mobile menu ─────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth scroll ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ───────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Stats counter ───────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(easeOutCubic(p) * target);
      el.textContent = (target >= 1000 ? val.toLocaleString('de-AT') : val) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target >= 1000 ? target.toLocaleString('de-AT') : target) + suffix;
    };
    requestAnimationFrame(step);
  }

  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statsBar.querySelectorAll('.stat-num').forEach(el => {
          countUp(el, parseInt(el.dataset.target), el.dataset.suffix || '', 1800);
        });
        statsObs.unobserve(statsBar);
      });
    }, { threshold: 0.4 });
    statsObs.observe(statsBar);
  }

  /* ── Contact form ────────────────────────────── */
  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('err');
        const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
        if (empty) { field.classList.add('err'); valid = false; }
      });

      if (!valid) {
        const first = form.querySelector('.err');
        if (first) first.focus();
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Wird gesendet …';

      /*
        TODO: Echtes Formular-Backend einbinden.
        Option A – Formspree:   form action="https://formspree.io/f/DEIN-CODE" method="POST"
        Option B – Netlify:     <form netlify>
        Option C – PHP-Mailer:  fetch('/mailer.php', { method:'POST', body: new FormData(form) })
      */
      setTimeout(() => {
        form.style.display = 'none';
        successEl.hidden = false;
      }, 1100);
    });

    form.querySelectorAll('input, select, textarea').forEach(f => {
      f.addEventListener('input', () => f.classList.remove('err'));
    });
  }

  /* ── Footer year ─────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
