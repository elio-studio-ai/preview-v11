/* ELIO portfolio v3 - motion layer (no libraries). Curtain reveals, word-mask headline,
   scroll progress, soft image parallax, FLIP filter reorder + FLIP project open/close.
   No content changes. RTL-safe, touch-safe, keyboard-safe, reduced-motion -> simple fade. */
(function () {
  "use strict";
  document.documentElement.classList.add('fx3');
  var RM = false, TOUCH = false;
  try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { TOUCH = !matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) {}
  /* ============ shared helpers ============ */
  function grid() { return document.getElementById('grid'); }
  function pvg() { return document.getElementById('pvg'); }
  function cardsOf(g) { return g ? Array.prototype.slice.call(g.querySelectorAll('.gi,.vc,.cta')) : []; }
  function keyOf(c) { var i = c.querySelector('img'); return i ? i.getAttribute('src') : null; }

  /* ===== curtain reveal for cards (IO triggered, column-staggered) ===== */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el);
      requestAnimationFrame(function () { el.classList.add('fx-in'); });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 }) : null;
  var armEntrances = function () {
    [grid(), pvg()].forEach(function (g) {
      var j = 0;
      cardsOf(g).forEach(function (c) {
        if (c.dataset.fxArmed) return;
        c.dataset.fxArmed = '1';
        c.classList.add('fx-pre');
        c.style.transitionDelay = (j++ % 4) * 90 + 'ms';
        if (io && !RM) io.observe(c); else requestAnimationFrame(function () { c.classList.add('fx-in'); });
      });
    });
  };

  function sweep() {
    var vh = innerHeight * .92;
    document.querySelectorAll('.fx-pre').forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) { if (io) io.unobserve(c); c.classList.add('fx-in'); }
    });
  }
  var _arm = armEntrances;
  armEntrances = function () { _arm(); setTimeout(sweep, 80); };
  addEventListener('scroll', function () { requestAnimationFrame(sweep); }, { passive: true });

  /* ===== headline: per-word mask rise (words only, never per-letter: Arabic joins) ===== */
  (function () {
    var h = document.querySelector('.phead h1');
    if (!h || RM) return;
    var t = h.textContent, parts = t.split(' ');
    h.setAttribute('aria-label', t);
    h.textContent = '';
    parts.forEach(function (w, i) {
      var o = document.createElement('span'), n = document.createElement('span');
      o.className = 'hw'; o.setAttribute('aria-hidden', 'true');
      n.textContent = w; n.style.transitionDelay = (120 + i * 90) + 'ms';
      o.appendChild(n); h.appendChild(o);
      if (i < parts.length - 1) h.appendChild(document.createTextNode(' '));
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('hd-in'); }); });
  })();

  /* ===== scroll progress + soft image parallax (transform/translate only) ===== */
  var bar = document.createElement('i'); bar.className = 'sprog'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  var ticking = false;
  function frame() {
    ticking = false;
    var d = document.documentElement, max = d.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0).toFixed(4) + ')';
    if (RM || TOUCH) return;
    var vh = innerHeight;
    cardsOf(grid()).forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var im = c.querySelector('img'); if (!im) return;
      var p = ((r.top + r.height / 2) / vh - .5) * 2; // -1..1
      im.style.setProperty('--py', (p * -3).toFixed(2) + '%');
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); req();

  /* ============ 3) FLIP — filter reorders (wrap the app's render) ============ */
  var _render = window.render;
  if (typeof _render === 'function') {
    window.render = function () {
      var before = {};
      if (!RM) cardsOf(grid()).forEach(function (c) {
        var k = keyOf(c); if (k) before[k] = c.getBoundingClientRect();
      });
      _render.apply(this, arguments);
      armEntrances();
      if (RM) return;
      var movers = [];
      cardsOf(grid()).forEach(function (c) {
        var k = keyOf(c), b = k ? before[k] : null;
        if (!b) return;
        var a = c.getBoundingClientRect();
        var dx = b.left - a.left, dy = b.top - a.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) movers.push([c, dx, dy, b.width / a.width, b.height / a.height]);
      });
      if (!movers.length) return;
      movers.forEach(function (m) {
        var el = m[0];
        el.classList.remove('fx-pre'); el.classList.add('fx-in');
        el.style.transitionDelay = '0ms';
        el.style.transform = 'translate(' + m[1] + 'px,' + m[2] + 'px) scale(' + m[3].toFixed(3) + ',' + m[4].toFixed(3) + ')';
      });
      void grid().offsetWidth; // reflow
      movers.forEach(function (m) {
        var el = m[0];
        el.style.transition = 'transform .45s var(--ease)';
        el.style.transform = '';
        el.addEventListener('transitionend', function h() {
          el.style.transition = '';
          el.removeEventListener('transitionend', h);
        });
      });
    };
  }

  /* ============ 3b) FLIP — open/close project (shared element) ============ */
  var pv = document.getElementById('pv');
  function firstThumbImg() { var g = pvg(); return g ? g.querySelector('.gi img') : null; }
  function flyClone(fromImg, toRect, midCb, doneCb) {
    var r1 = fromImg.getBoundingClientRect();
    var c = document.createElement('img');
    c.src = fromImg.currentSrc || fromImg.src;
    c.alt = '';
    c.className = 'flip-clone';
    c.style.left = r1.left + 'px'; c.style.top = r1.top + 'px';
    c.style.width = r1.width + 'px'; c.style.height = r1.height + 'px';
    document.body.appendChild(c);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        c.style.transition = 'left .45s var(--ease),top .45s var(--ease),width .45s var(--ease),height .45s var(--ease),opacity .3s ease';
        c.style.left = toRect.left + 'px'; c.style.top = toRect.top + 'px';
        c.style.width = toRect.width + 'px'; c.style.height = toRect.height + 'px';
        setTimeout(function () { if (midCb) midCb(); }, 410);
        setTimeout(function () { c.remove(); if (doneCb) doneCb(); }, 480);
      });
    });
  }

  var _open = window.openProject;
  if (typeof _open === 'function') {
    window.openProject = function (p, opener) {
      var img = opener && opener.querySelector ? opener.querySelector('img') : null;
      _open.apply(this, arguments);
      armEntrances();
      if (RM || !img) return;
      var t = firstThumbImg();
      if (!t) return;
      var tr = t.getBoundingClientRect();
      pv.style.animation = 'pvFade .45s var(--ease)';
      t.style.opacity = '0';
      flyClone(img, tr, function () { t.style.opacity = ''; },
        function () { pv.style.animation = ''; });
    };
  }

  var _hide = window.hidePanel, self = this;
  if (typeof _hide === 'function') {
    window.hidePanel = function () {
      var args = arguments;
      if (RM || !pv.classList.contains('open')) { _hide.apply(self, args); return; }
      var t = firstThumbImg();
      var back = (window.pvOpener && window.pvOpener.querySelector) ? window.pvOpener.querySelector('img') : null;
      if (!t || !back) { _hide.apply(self, args); return; }
      var tr = back.getBoundingClientRect();
      pv.style.animation = 'pvOut .34s ease forwards';
      t.style.opacity = '0';
      flyClone(t, tr, null, null);
      setTimeout(function () {
        _hide.apply(self, args);
        pv.style.animation = '';
        t.style.opacity = '';
      }, 330);
    };
  }

  // "view all" inside the panel appends thumbs — arm them too
  var pvall = document.getElementById('pvall');
  if (pvall && pvall.onclick) {
    var oldAll = pvall.onclick;
    pvall.onclick = function () { oldAll.call(this); armEntrances(); };
  }

  /* ============ init ============ */
  armEntrances();
})();
