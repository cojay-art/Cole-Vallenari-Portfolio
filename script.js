/* ============================================================
   Mira Kellner — portfolio
   Three jobs:
     1. load images, and draw a stand-in if the file isn't there yet
     2. filter the hang by medium
     3. the lightbox
   ============================================================ */

(function () {
  'use strict';

  var hang     = document.getElementById('hang');
  var figures  = Array.prototype.slice.call(document.querySelectorAll('figure[data-src]'));
  var lightbox = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lbImg');
  var lbCap    = document.getElementById('lbCap');
  var lastFocus = null;
  var openList = [];   // figures currently visible, in order
  var current  = 0;

  /* ── 1. Images ────────────────────────────────────────────
     Every figure points at a real file path. If that file
     isn't on disk yet, we paint a stand-in canvas so the
     layout still reads properly while you're building.
     Delete drawStandIn() once your images are in place.      */

  function drawStandIn(seed, ratio) {
    var w = 800;
    var h = Math.round(w * ratio);
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d');

    // deterministic pseudo-random, so each piece looks the same on reload
    var s = seed * 9301 + 49297;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }

    var beds = [
      ['#c9cfc4', '#8e9a8c'], ['#cbc7ba', '#7d8595'],
      ['#d0c9bd', '#9a7f5e'], ['#bfc6c8', '#5f6d7a'],
      ['#cfcabc', '#6f7a63']
    ];
    var bed = beds[seed % beds.length];

    var grad = g.createLinearGradient(0, 0, w * 0.4, h);
    grad.addColorStop(0, bed[0]);
    grad.addColorStop(1, bed[1]);
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);

    // a few soft bands, like a horizon
    for (var i = 0; i < 5; i++) {
      g.globalAlpha = 0.10 + rnd() * 0.14;
      g.fillStyle = i % 2 ? '#f2f2ec' : '#2b3128';
      var y = rnd() * h;
      g.fillRect(0, y, w, 8 + rnd() * (h / 6));
    }

    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(32,35,30,0.28)';
    g.lineWidth = 2;
    g.strokeRect(1, 1, w - 2, h - 2);

    return c.toDataURL('image/png');
  }

  figures.forEach(function (fig) {
    var img   = fig.querySelector('img');
    var src   = fig.getAttribute('data-src');
    var ratio = parseFloat(fig.getAttribute('data-ratio')) || 1;
    var seed  = parseInt(fig.getAttribute('data-seed'), 10) || 1;

    img.style.aspectRatio = '1 / ' + ratio;   // reserves space, stops layout jump
    img.loading = 'lazy';

    img.addEventListener('error', function () {
      img.src = drawStandIn(seed, ratio);
      fig.setAttribute('data-standin', 'true');
    }, { once: true });

    img.src = src;
  });

  /* ── 2. Filtering ─────────────────────────────────────── */

  var buttons = document.querySelectorAll('.filters button');
  var empty   = document.getElementById('empty');

  function applyFilter(medium) {
    var shown = 0;
    if (!hang) return;

    Array.prototype.forEach.call(hang.children, function (fig) {
      var match = medium === 'all' || fig.getAttribute('data-medium') === medium;
      fig.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });

    if (empty) empty.hidden = shown > 0;
    refreshOpenList();
  }

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ── 3. Lightbox ──────────────────────────────────────── */

  function refreshOpenList() {
    openList = figures.filter(function (f) {
      return !f.classList.contains('is-hidden');
    });
  }
  refreshOpenList();

  function show(index) {
    if (!openList.length) return;
    current = (index + openList.length) % openList.length;

    var fig = openList[current];
    var src = fig.querySelector('img').getAttribute('src');
    var cap = fig.querySelector('figcaption');

    lbImg.setAttribute('src', src);
    lbImg.setAttribute('alt', fig.querySelector('img').getAttribute('alt') || '');
    lbCap.innerHTML = cap ? cap.innerHTML : '';
  }

  function open(fig) {
    refreshOpenList();
    var i = openList.indexOf(fig);
    if (i < 0) return;

    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    show(i);
    document.getElementById('lbClose').focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  figures.forEach(function (fig) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');

    fig.addEventListener('click', function () { open(fig); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(fig);
      }
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ── Housekeeping ─────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
