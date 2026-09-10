/* ==========================================================================
   SHITAL GURAV MAKEUP STUDIO — gallery.js
   Category filters + fullscreen lightbox (keyboard + touch swipe support).
   ========================================================================== */
(function () {
  'use strict';

  var masonry = document.getElementById('masonryGrid');
  if (!masonry) return;

  var items = Array.prototype.slice.call(masonry.querySelectorAll('.masonry-item'));

  /* ------------------------------------------------------------------
     1. CATEGORY FILTERS
     Categories are defined on each item via data-category.
     Adjust or rename categories directly in gallery.html.
  ------------------------------------------------------------------ */
  var filterBar = document.getElementById('filterBar');

  function applyFilter(cat) {
    masonry.classList.add('is-filtering');
    window.setTimeout(function () {
      items.forEach(function (item) {
        var cats = (item.getAttribute('data-category') || '').split(' ');
        var show = cat === 'all' || cats.indexOf(cat) > -1;
        item.classList.toggle('is-hidden', !show);
      });
      masonry.classList.remove('is-filtering');
    }, 220);
  }

  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      applyFilter(btn.getAttribute('data-filter'));
      if (lightbox.isOpen()) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------
     2. LIGHTBOX
  ------------------------------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lbImage = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  var lbCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  var lbCounter = lightbox ? lightbox.querySelector('.lightbox-counter') : null;
  var current = 0;
  var lastFocus = null;

  function visibleItems() {
    return items.filter(function (i) { return !i.classList.contains('is-hidden'); });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function render() {
    var list = visibleItems();
    if (!list.length) return;
    var item = list[current];
    var img = item.querySelector('img');
    var cap = item.querySelector('figcaption');

    lightbox.classList.remove('is-loaded');
    lbImage.onload = function () { lightbox.classList.add('is-loaded'); };
    lbImage.src = item.getAttribute('data-full') || img.getAttribute('src');
    lbImage.alt = img.alt || '';
    lbCaption.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
    lbCounter.textContent = pad(current + 1) + ' / ' + pad(list.length);
  }

  function openLightbox(item) {
    var list = visibleItems();
    var idx = list.indexOf(item);
    if (idx < 0) return;
    current = idx;
    lastFocus = document.activeElement;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open', 'is-loaded');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    var list = visibleItems();
    current = (current + dir + list.length) % list.length;
    render();
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.zoom');
    if (trigger) {
      trigger.addEventListener('click', function () { openLightbox(item); });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
      });
    }
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { step(-1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    /* Touch swipe */
    var touchX = null, touchY = null;
    lightbox.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
      touchX = touchY = null;
    }, { passive: true });
  }
})();
