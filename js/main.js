/* =============================================================================
   Kaiser Mohiuddin — Portfolio
   js/main.js

   Interaction layer. No dependencies, no build step.
     1. Config
     2. Utilities & toasts
     3. Navbar: sticky state, mobile menu, scroll-spy
     4. Reveal on scroll
     5. Metric counters
     6. Project filtering
     7. Copy to clipboard
     8. Misc
   ========================================================================== */

(function () {
  'use strict';

  /* 1. CONFIG ============================================================= */

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* 2. UTILITIES & TOASTS ================================================= */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var toastStack = $('#toasts');

  /**
   * Show a transient message in the bottom-right stack.
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

    requestAnimationFrame(function () { el.classList.add('is-in'); });

    setTimeout(function () {
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 400);
    }, 3200);
  }

  /* 3. NAVBAR ============================================================= */

  var nav = $('#nav');
  var navList = $('#navList');
  var navToggle = $('#navToggle');
  var navAnchors = $$('#navList a');

  // Sticky background once the page has scrolled past the fold edge.
  function syncNavState() {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  }

  window.addEventListener('scroll', syncNavState, { passive: true });
  syncNavState();

  // Mobile menu
  function closeMenu() {
    if (!navList || !navToggle) return;
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var open = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navAnchors.forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!navList.classList.contains('is-open')) return;
      if (navList.contains(e.target) || navToggle.contains(e.target)) return;
      closeMenu();
    });
  }

  // Scroll-spy. Tracks the section closest to the top of the viewport that is
  // still intersecting, which behaves better than "last one to fire" on fast
  // scrolls and on short sections.
  var spySections = $$('main section[id]');
  var visible = new Map();

  function markActive(id) {
    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href');
      var target = href === '#top' ? 'top' : href.slice(1);
      a.classList.toggle('is-active', target === id);
    });
  }

  if ('IntersectionObserver' in window && spySections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (!visible.size) return;

        var best = null;
        var bestTop = Infinity;
        visible.forEach(function (top, id) {
          var abs = Math.abs(top);
          if (abs < bestTop) { bestTop = abs; best = id; }
        });

        if (best) markActive(best);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    spySections.forEach(function (s) { spy.observe(s); });
  }

  // Back at the very top, "Home" should win regardless of what is intersecting.
  window.addEventListener('scroll', function () {
    if (window.scrollY < 120) markActive('top');
  }, { passive: true });

  /* 4. REVEAL ON SCROLL =================================================== */

  var revealables = $$('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* 5. METRIC COUNTERS ==================================================== */

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString('en-IN');
      return;
    }

    var duration = 1300;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
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
      { threshold: 0.5 }
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
        // Next frame, so the browser registers the display change before
        // the opacity transition runs.
        requestAnimationFrame(function () { card.classList.remove('is-out'); });
      } else {
        card.classList.add('is-out');
        var hide = function () {
          if (card.classList.contains('is-out')) card.classList.add('is-hidden');
        };
        if (prefersReducedMotion) hide();
        else setTimeout(hide, 260);
      }
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
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

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () { confirmCopy(btn); },
          function () {
            if (fallbackCopy(value)) confirmCopy(btn);
            else toast('Copy failed — select the address and copy it manually.', 'error');
          }
        );
      } else if (fallbackCopy(value)) {
        confirmCopy(btn);
      } else {
        toast('Copy failed — select the address and copy it manually.', 'error');
      }
    });
  });

  /* 8. MISC =============================================================== */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Anchor clicks: let CSS smooth scrolling do the work, but move keyboard
  // focus to the target so the jump isn't lost for screen-reader users.
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 420);
    });
  });
})();
