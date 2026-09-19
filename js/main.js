/* =============================================================================
   Kaiser Mohiuddin — Portfolio
   js/main.js

   Interaction & Animation Layer. No external dependencies, 100% vanilla JS.
     1. Config & Motion Preferences
     2. Utilities & Toasts
     3. Navbar: Sticky Header, Mobile Drawer, Scroll-Spy
     4. Reveal on Scroll (Staggered Entry)
     5. Metric Counters (Smooth Animation)
     6. Project Filtering (Smooth Transition)
     7. Copy to Clipboard (Haptic/Visual Feedback)
     8. Smooth Anchor Scrolling & Focus
   ========================================================================== */

(function () {
  'use strict';

  /* 1. CONFIG & MOTION PREFERENCES ========================================= */

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* 2. UTILITIES & TOASTS ================================================= */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var toastStack = $('#toasts');

  /**
   * Show a transient alert notification in the bottom toast stack.
   * @param {string} message
   * @param {'success'|'error'} [kind]
   */
  function toast(message, kind) {
    if (!toastStack) return;

    var el = document.createElement('div');
    el.className = 'toast' + (kind === 'error' ? ' is-error' : '');

    var icon = document.createElement('i');
    icon.className = kind === 'error'
      ? 'fa-solid fa-circle-exclamation'
      : 'fa-solid fa-circle-check';
    icon.setAttribute('aria-hidden', 'true');

    var text = document.createElement('span');
    text.textContent = message;

    el.appendChild(icon);
    el.appendChild(text);
    toastStack.appendChild(el);

    requestAnimationFrame(function () {
      el.classList.add('is-in');
    });

    setTimeout(function () {
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 350);
    }, 3200);
  }

  /* 2b. THEME TOGGLER ==================================================== */

  var themeToggleBtn = $('#themeToggle');
  var themeToggleMobileBtn = $('#themeToggleMobile');
  var metaThemeColor = $('meta[name="theme-color"]');

  function getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored) return stored;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }

  function applyTheme(theme, notify) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#F8FAFC' : '#070A12');
    }

    var isLight = theme === 'light';

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggleBtn.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggleMobileBtn) {
      themeToggleMobileBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggleMobileBtn.innerHTML = (isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>') +
        '<span class="theme-label-text">' + (isLight ? 'Dark Mode' : 'Light Mode') + '</span>';
    }

    if (notify) {
      toast('Switched to ' + (isLight ? 'light' : 'dark') + ' theme');
    }
  }

  var currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
  applyTheme(currentTheme, false);

  function toggleTheme() {
    var now = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = now === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  /* 3. NAVBAR, MOBILE DRAWER & SCROLL-SPY =================================== */

  var nav = $('#nav');
  var navList = $('#navList');
  var navToggle = $('#navToggle');
  var navBackdrop = $('#navBackdrop');
  var navAnchors = $$('#navList a');

  // Sticky navbar with blur upon scroll
  function syncNavState() {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 20);
  }

  window.addEventListener('scroll', syncNavState, { passive: true });
  syncNavState();

  // Mobile Drawer Open / Close controller
  function closeMenu() {
    if (!navList || !navToggle) return;
    navList.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  function openMenu() {
    if (!navList || !navToggle) return;
    navList.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-open');
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    navToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navList.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    // Close when clicking any nav item
    navAnchors.forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!navList.classList.contains('is-open')) return;
      if (navList.contains(e.target) || navToggle.contains(e.target)) return;
      closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && navList.classList.contains('is-open')) {
        closeMenu();
      }
    }, { passive: true });
  }

  // Scroll-spy: robust tracking across mobile & desktop viewports
  var spySections = $$('main section[id]');

  function markActive(id) {
    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var target = href === '#top' ? 'top' : href.slice(1);
      a.classList.toggle('is-active', target === id);
    });
  }

  if ('IntersectionObserver' in window && spySections.length) {
    var observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    var currentActive = null;

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentActive = entry.target.id;
          markActive(currentActive);
        }
      });
    }, observerOptions);

    spySections.forEach(function (sec) {
      spyObserver.observe(sec);
    });
  }

  // Reset to Home when scrolled near top
  window.addEventListener('scroll', function () {
    if (window.scrollY < 100) {
      markActive('top');
    }
  }, { passive: true });

  /* 4. REVEAL ON SCROLL =================================================== */

  var revealables = $$('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) {
      el.classList.add('is-in');
    });
  } else {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );

    revealables.forEach(function (el) {
      revealer.observe(el);
    });
  }

  /* 5. METRIC COUNTERS ==================================================== */

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString('en-IN');
      return;
    }

    var duration = 1400;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    }

    requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* 6. PROJECT FILTERING ================================================== */

  var filters = $$('.filter');
  var projects = $$('#projectGrid .project');

  function applyFilter(key) {
    projects.forEach(function (card) {
      var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      var match = key === 'all' || tags.indexOf(key) !== -1;

      if (match) {
        card.classList.remove('is-hidden');
        requestAnimationFrame(function () {
          card.classList.remove('is-out');
        });
      } else {
        card.classList.add('is-out');
        var hide = function () {
          if (card.classList.contains('is-out')) {
            card.classList.add('is-hidden');
          }
        };
        if (prefersReducedMotion) hide();
        else setTimeout(hide, 260);
      }
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* 7. COPY TO CLIPBOARD ================================================== */

  function fallbackCopy(value) {
    var scratch = document.createElement('textarea');
    scratch.value = value;
    scratch.setAttribute('readonly', '');
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();

    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(scratch);
    return ok;
  }

  function confirmCopy(btn) {
    btn.classList.add('is-done');
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(function () {
      btn.classList.remove('is-done');
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 1800);
    toast('Copied to clipboard!');
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      if (!value) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () { confirmCopy(btn); },
          function () {
            if (fallbackCopy(value)) confirmCopy(btn);
            else toast('Copy failed — please select and copy manually.', 'error');
          }
        );
      } else if (fallbackCopy(value)) {
        confirmCopy(btn);
      } else {
        toast('Copy failed — please select and copy manually.', 'error');
      }
    });
  });

  /* 8. MISC & SMOOTH SCROLLING ============================================ */

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Anchor clicks: smooth scroll with offset & focus management
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }
      var target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 68;
      var topPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({
        top: topPos,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, prefersReducedMotion ? 50 : 450);
    });
  });
})();
