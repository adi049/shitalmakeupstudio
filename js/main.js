/* ==========================================================================
   SHITAL GURAV MAKEUP STUDIO — main.js
   Navigation, scroll reveals, parallax, testimonials, page transitions.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. HEADER — compact state on scroll
  ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     2. MOBILE MENU
  ------------------------------------------------------------------ */
  var menu = document.getElementById('mobileMenu');
  var toggle = document.getElementById('navToggle');

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    /* Close menu if viewport grows into desktop layout */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     3. SCROLL REVEALS (IntersectionObserver; content stays visible
        without JavaScript because hidden states are gated by .has-js)
  ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) {
      el.style.transitionDelay = delay.indexOf('ms') > -1 ? delay : delay + 'ms';
      el.addEventListener('transitionend', function clear() {
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', clear);
      });
    }
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ------------------------------------------------------------------
     4. GSAP PARALLAX (progressive enhancement — CDN, optional)
  ------------------------------------------------------------------ */
  function initParallax() {
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amount = parseFloat(el.getAttribute('data-parallax')) || 10;
      gsap.fromTo(el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1
          }
        }
      );
    });

    /* Gentle drift of full-bleed media inside CTA bands */
    document.querySelectorAll('.cta-band .media img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.cta-band'), start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

  /* ------------------------------------------------------------------
     5. MARQUEE — duplicate track content for a seamless loop
  ------------------------------------------------------------------ */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    var content = track.querySelector('.marquee-content');
    if (content) {
      var clone = content.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });

  /* ------------------------------------------------------------------
     6. TESTIMONIALS
     ------------------------------------------------------------------
     PLACEHOLDER DATA — replace these dummy entries with real client
     testimonials. Only this array needs to change.
  ------------------------------------------------------------------ */
  var TESTIMONIALS = [
    {
      quote: 'The team understood exactly what I wanted before I could even explain it properly. On my wedding morning everything felt calm, unhurried and so beautifully done. I felt like the best version of myself.',
      name: 'Aditi K.',
      occasion: 'Bridal Makeup'
    },
    {
      quote: 'I was nervous about looking overdone. The makeup was so refined and long lasting that it looked fresh from the morning rituals straight through the reception. I received compliments all evening.',
      name: 'Sneha M.',
      occasion: 'Reception Glam'
    },
    {
      quote: 'Structured, patient and genuinely practical. Every session built on the last one, and the one-to-one feedback is what made the difference for me as an artist.',
      name: 'Priya D.',
      occasion: 'Academy Student'
    }
  ];

  var tstViewport = document.querySelector('.tst-viewport');
  if (tstViewport) {
    var track = document.createElement('div');
    track.className = 'tst-track';
    track.setAttribute('aria-live', 'polite');

    TESTIMONIALS.forEach(function (t, i) {
      var slide = document.createElement('figure');
      slide.className = 'tst-slide';
      var q = document.createElement('blockquote');
      q.className = 'tst-quote';
      q.textContent = '\u201C' + t.quote + '\u201D';
      var name = document.createElement('figcaption');
      name.className = 'tst-name';
      name.textContent = t.name;
      var occ = document.createElement('div');
      occ.className = 'tst-occasion';
      occ.textContent = t.occasion;
      slide.appendChild(q);
      slide.appendChild(name);
      slide.appendChild(occ);
      track.appendChild(slide);
    });
    tstViewport.appendChild(track);

    var controls = document.querySelector('.tst-controls');
    var dotsWrap = controls ? controls.querySelector('.tst-dots') : null;
    var index = 0;
    var dots = [];

    if (dotsWrap) {
      TESTIMONIALS.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'tst-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function goTo(i) {
      index = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('is-active', di === index); });
    }

    document.querySelectorAll('.tst-arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(index + (btn.classList.contains('tst-next') ? 1 : -1));
        restart();
      });
    });

    var timer = null;
    function start() {
      if (prefersReducedMotion || TESTIMONIALS.length < 2) return;
      timer = window.setInterval(function () { goTo(index + 1); }, 6500);
    }
    function restart() { window.clearInterval(timer); start(); }
    var tstSection = document.querySelector('.tst');
    if (tstSection) {
      tstSection.addEventListener('mouseenter', function () { window.clearInterval(timer); });
      tstSection.addEventListener('mouseleave', start);
    }
    start();
  }

  /* ------------------------------------------------------------------
     7. SMOOTH ANCHOR SCROLLING (same-page links only)
  ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    var top = target.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------
     8. PAGE TRANSITIONS — quick elegant fade between pages
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.protocol !== 'http:' && a.protocol !== 'https:') return;
      if (a.host !== window.location.host) return;
      var url = a.getAttribute('href');
      if (!url || url.charAt(0) === '#' || url.indexOf('mailto:') === 0 || url.indexOf('tel:') === 0) return;
      if (a.pathname === window.location.pathname && !a.hash) return; /* reload same page */
      e.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(function () { window.location.href = a.href; }, 270);
      /* Safety fallback in case navigation is blocked */
      window.setTimeout(function () {
        if (document.body.classList.contains('page-leaving')) window.location.href = a.href;
      }, 900);
    });
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('page-leaving');
    });
  }
})();
