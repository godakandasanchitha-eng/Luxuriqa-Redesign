/* ═══════════════════════════════════════════════════════════
   LUXURIQA AUTOMOTIVE — main.js
   Vanilla JS | Interactions, Animations, Scroll triggers
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. NAVBAR — scroll state
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function updateNavbar() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ─────────────────────────────────────────────
     2. HAMBURGER MENU
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────
     3. SCROLL FADE-IN ANIMATION
  ───────────────────────────────────────────── */
  const fadeTargets = document.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  fadeTargets.forEach(el => observer.observe(el));

  /* ─────────────────────────────────────────────
     4. STYLE CARDS — ripple effect on click
  ───────────────────────────────────────────── */
  document.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', function (e) {
      // Ripple
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        background: rgba(199,167,108,0.08);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 20;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────────
     5. MAKE CARDS — expand / collapse models
  ───────────────────────────────────────────── */
  const makeCards = document.querySelectorAll('.make-card');

  function collapseAll(except) {
    makeCards.forEach(card => {
      if (card !== except) {
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
      }
    });
  }

  makeCards.forEach(card => {
    const front = card.querySelector('.make-card-front');
    const closeBtn = card.querySelector('.models-close');

    // Click front to expand
    front.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains('expanded');
      collapseAll(card);
      if (!isExpanded) {
        card.classList.add('expanded');
        card.setAttribute('aria-expanded', 'true');
      } else {
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
      }
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Collapse on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.make-card')) {
      collapseAll(null);
    }
  });

  // Keyboard accessibility
  makeCards.forEach(card => {
    const front = card.querySelector('.make-card-front');
    front.setAttribute('tabindex', '0');
    front.setAttribute('role', 'button');
    front.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        front.click();
      }
    });
  });

  /* ─────────────────────────────────────────────
     6. PARALLAX — subtle depth on hero
  ───────────────────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  const heroGridLines = document.querySelector('.hero-grid-lines');

  if (heroContent && heroGridLines) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const factor = Math.min(y / window.innerHeight, 1);
          heroContent.style.transform = `translateY(${y * 0.25}px)`;
          heroContent.style.opacity = 1 - factor * 1.8;
          heroGridLines.style.transform = `translateY(${y * 0.1}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     7. SMOOTH SCROLL for nav anchors
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return; // ignore plain anchors
      let target = null;
      try {
        target = document.querySelector(href);
      } catch (err) {
        return; // invalid selector
      }
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     8. SECTION ACTIVE NAV HIGHLIGHT
  ───────────────────────────────────────────── */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  navAnchors.forEach(a => {
    const id = a.getAttribute('href').substring(1);
    const section = document.getElementById(id);
    if (section) sections.push({ el: section, link: a });
  });

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const found = sections.find(s => s.el === entry.target);
        if (found) {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.removeAttribute('data-active'));
            found.link.setAttribute('data-active', 'true');
            found.link.style.color = 'var(--gold)';
          } else {
            found.link.removeAttribute('data-active');
            found.link.style.color = '';
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => sectionObserver.observe(s.el));

  /* ─────────────────────────────────────────────
     9. FEATURED LOGOS — stagger animation
  ───────────────────────────────────────────── */
  const logoCards = document.querySelectorAll('.featured-logo-card');
  const logoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.featured-logo-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        logoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const featuredGrid = document.querySelector('.featured-logos');
  if (featuredGrid) {
    logoCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    logoObserver.observe(featuredGrid);
  }

  /* ─────────────────────────────────────────────
     10. BRAND FEATURE CARDS — stagger on scroll
  ───────────────────────────────────────────── */
  const brandCards = document.querySelectorAll('.brand-feature-card');
  const brandObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.brand-feature-card');
        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 0.08}s`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        brandObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const brandsGrid = document.querySelector('.brands-grid');
  if (brandsGrid) {
    brandCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    brandObserver.observe(brandsGrid);
  }

  /* ─────────────────────────────────────────────
     11. MAKE CARD — stagger entrance
  ───────────────────────────────────────────── */
  const makeGrids = document.querySelectorAll('.manufacturer-grid');
  const makeGridObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.make-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
        makeGridObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  makeGrids.forEach(grid => {
    grid.querySelectorAll('.make-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    makeGridObserver.observe(grid);
  });

  /* ─────────────────────────────────────────────
     12. CURSOR GLOW (desktop)
  ───────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(199,167,108,0.04) 0%, transparent 60%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glow);

    let glowX = 0, glowY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', e => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.1;
      glowY += (targetY - glowY) * 0.1;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

})();