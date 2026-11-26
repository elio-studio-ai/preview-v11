/* ELIO portfolio v2 — motion layer. Loads after the app script.
   Adds: one WebGL header scene (lazy Three.js), staggered entrances,
   light card tilt (desktop), FLIP project open/close, FLIP filter reorder.
   No content changes. Respects RTL, touch, keyboard, prefers-reduced-motion. */
(function () {
  "use strict";
  window.__pv2ok = true;
/**
 * https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/three-components/EnvironmentScene.ts
 */

function makeRoomEnvironment() {
const {BackSide,BoxGeometry,Mesh,MeshBasicMaterial,MeshStandardMaterial,PointLight,Scene}=THREE;
class RoomEnvironment extends Scene {

	constructor() {

		super();

		const geometry = new BoxGeometry();
		geometry.deleteAttribute( 'uv' );

		const roomMaterial = new MeshStandardMaterial( { side: BackSide } );
		const boxMaterial = new MeshStandardMaterial();

		const mainLight = new PointLight( 0xffffff, 5.0, 28, 2 );
		mainLight.position.set( 0.418, 16.199, 0.300 );
		this.add( mainLight );

		const room = new Mesh( geometry, roomMaterial );
		room.position.set( - 0.757, 13.219, 0.717 );
		room.scale.set( 31.713, 28.305, 28.591 );
		this.add( room );

		const box1 = new Mesh( geometry, boxMaterial );
		box1.position.set( - 10.906, 2.009, 1.846 );
		box1.rotation.set( 0, - 0.195, 0 );
		box1.scale.set( 2.328, 7.905, 4.651 );
		this.add( box1 );

		const box2 = new Mesh( geometry, boxMaterial );
		box2.position.set( - 5.607, - 0.754, - 0.758 );
		box2.rotation.set( 0, 0.994, 0 );
		box2.scale.set( 1.970, 1.534, 3.955 );
		this.add( box2 );

		const box3 = new Mesh( geometry, boxMaterial );
		box3.position.set( 6.167, 0.857, 7.803 );
		box3.rotation.set( 0, 0.561, 0 );
		box3.scale.set( 3.927, 6.285, 3.687 );
		this.add( box3 );

		const box4 = new Mesh( geometry, boxMaterial );
		box4.position.set( - 2.017, 0.018, 6.124 );
		box4.rotation.set( 0, 0.333, 0 );
		box4.scale.set( 2.002, 4.566, 2.064 );
		this.add( box4 );

		const box5 = new Mesh( geometry, boxMaterial );
		box5.position.set( 2.291, - 0.756, - 2.621 );
		box5.rotation.set( 0, - 0.286, 0 );
		box5.scale.set( 1.546, 1.552, 1.496 );
		this.add( box5 );

		const box6 = new Mesh( geometry, boxMaterial );
		box6.position.set( - 2.193, - 0.369, - 5.547 );
		box6.rotation.set( 0, 0.516, 0 );
		box6.scale.set( 3.875, 3.487, 2.986 );
		this.add( box6 );


		// -x right
		const light1 = new Mesh( geometry, createAreaLightMaterial( 50 ) );
		light1.position.set( - 16.116, 14.37, 8.208 );
		light1.scale.set( 0.1, 2.428, 2.739 );
		this.add( light1 );

		// -x left
		const light2 = new Mesh( geometry, createAreaLightMaterial( 50 ) );
		light2.position.set( - 16.109, 18.021, - 8.207 );
		light2.scale.set( 0.1, 2.425, 2.751 );
		this.add( light2 );

		// +x
		const light3 = new Mesh( geometry, createAreaLightMaterial( 17 ) );
		light3.position.set( 14.904, 12.198, - 1.832 );
		light3.scale.set( 0.15, 4.265, 6.331 );
		this.add( light3 );

		// +z
		const light4 = new Mesh( geometry, createAreaLightMaterial( 43 ) );
		light4.position.set( - 0.462, 8.89, 14.520 );
		light4.scale.set( 4.38, 5.441, 0.088 );
		this.add( light4 );

		// -z
		const light5 = new Mesh( geometry, createAreaLightMaterial( 20 ) );
		light5.position.set( 3.235, 11.486, - 12.541 );
		light5.scale.set( 2.5, 2.0, 0.1 );
		this.add( light5 );

		// +y
		const light6 = new Mesh( geometry, createAreaLightMaterial( 100 ) );
		light6.position.set( 0.0, 20.0, 0.0 );
		light6.scale.set( 1.0, 0.1, 1.0 );
		this.add( light6 );

	}

	dispose() {

		const resources = new Set();

		this.traverse( ( object ) => {

			if ( object.isMesh ) {

				resources.add( object.geometry );
				resources.add( object.material );

			}

		} );

		for ( const resource of resources ) {

			resource.dispose();

		}

	}

}

function createAreaLightMaterial( intensity ) {

	const material = new MeshBasicMaterial();
	material.color.setScalar( intensity );
	return material;

}
return RoomEnvironment;
}



  document.documentElement.classList.add('fx2');

  var RM = false, TOUCH = false, WEAK = false;
  try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { TOUCH = !matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) {}
  try { WEAK = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4; } catch (e) {}

  /* ============ 1) header 3D scene — the only WebGL on the page ============ */
  (function () {
    var host = document.getElementById('h3d');
    if (!host) return;
    function useStatic() { host.classList.add('h3d-static'); }
    if (RM || WEAK) { useStatic(); return; }
    var glOk = false;
    try {
      var c = document.createElement('canvas');
      glOk = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) {}
    if (!glOk) { useStatic(); return; }

    function boot() {
      var s = document.createElement('script');
      s.src = 'assets/three.min.js';
      s.async = true;
      s.onerror = useStatic;
      s.onload = function () { try { start(host); } catch (e) { useStatic(); } };
      document.body.appendChild(s);
    }
    if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1800 });
    else setTimeout(boot, 700);

    function start(host) {
      if (!window.THREE) throw 0;
      var W = host.clientWidth || 600, H = host.clientHeight || 280;
      var ren = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      ren.setSize(W, H);
      var scene = new THREE.Scene();
      var cam = new THREE.PerspectiveCamera(32, W / H, .1, 50);
      cam.position.set(0, .35, 4.9);
      cam.lookAt(0, .1, 0);
      var pm = new THREE.PMREMGenerator(ren);
      var RoomEnvironment = makeRoomEnvironment();
      scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;

      var g = new THREE.Group();
      scene.add(g);

      // Perfume bottle — lathe profile (product object, glass material)
      var prof = [[0, 0], [.34, 0], [.52, .04], [.60, .14], [.63, .4], [.63, .9], [.60, 1.18], [.5, 1.38], [.34, 1.5], [.28, 1.56], [.27, 1.66]]
        .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var glass = new THREE.MeshPhysicalMaterial({
        color: 0xfdfbf7, metalness: 0, roughness: .07, transmission: 1,
        thickness: 1.1, ior: 1.45, clearcoat: 1, clearcoatRoughness: .08,
        attenuationColor: new THREE.Color(0xd8b48f), attenuationDistance: 2.2
      });
      var bottle = new THREE.Mesh(new THREE.LatheGeometry(prof, 72), glass);
      var cap = new THREE.Mesh(
        new THREE.CylinderGeometry(.29, .30, .5, 56),
        new THREE.MeshStandardMaterial({ color: 0xC56835, metalness: 1, roughness: .3 }));
      cap.position.y = 1.92;
      var band = new THREE.Mesh(
        new THREE.TorusGeometry(.285, .035, 20, 56),
        new THREE.MeshStandardMaterial({ color: 0xA94F28, metalness: 1, roughness: .35 }));
      band.rotation.x = Math.PI / 2; band.position.y = 1.67;
      var shadow = new THREE.Mesh(
        new THREE.CircleGeometry(.85, 40),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .32 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.02;
      g.add(bottle, cap, band, shadow);
      g.position.y = -.95;

      var key = new THREE.DirectionalLight(0xfff2e2, .7); key.position.set(2.5, 3, 2); scene.add(key);
      var rim = new THREE.DirectionalLight(0xC56835, .5); rim.position.set(-3, 1.5, -2); scene.add(rim);

      host.appendChild(ren.domElement);
      host.classList.add('h3d-live');

      var mx = 0, my = 0, tx = 0, ty = 0, vis = true, run = true;
      var zone = host.closest('.phead') || host;
      zone.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - .5;
        my = (e.clientY - r.top) / r.height - .5;
      }, { passive: true });
      zone.addEventListener('pointerleave', function () { mx = 0; my = 0; }, { passive: true });
      if ('IntersectionObserver' in window)
        new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(host);
      document.addEventListener('visibilitychange', function () { run = !document.hidden; });

      var t0 = performance.now();
      (function loop(now) {
        requestAnimationFrame(loop);
        if (!vis || !run) return;
        var t = (now - t0) / 1000;
        tx += (mx - tx) * .05; ty += (my - ty) * .05;
        g.rotation.y = t * .42 + tx * .9;          // slow continuous turn + light mouse response
        g.rotation.x = Math.sin(t * .5) * .03 + ty * .35;
        g.position.y = -.95 + Math.sin(t * .8) * .045;
        ren.render(scene, cam);
      })(t0);

      addEventListener('resize', function () {
        var w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        cam.aspect = w / h; cam.updateProjectionMatrix(); ren.setSize(w, h);
      }, { passive: true });
    }
  })();

  /* ============ shared helpers ============ */
  function grid() { return document.getElementById('grid'); }
  function pvg() { return document.getElementById('pvg'); }
  function cardsOf(g) { return g ? Array.prototype.slice.call(g.querySelectorAll('.gi,.vc,.cta')) : []; }
  function keyOf(c) { var i = c.querySelector('img'); return i ? i.getAttribute('src') : null; }

  /* ============ 2) staggered entrances (CSS transition, IO triggered) ============ */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      io.unobserve(el);
      requestAnimationFrame(function () { el.classList.add('fx-in'); });
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: .04 }) : null;

  function armEntrances() {
    [grid(), pvg()].forEach(function (g) {
      var j = 0;
      cardsOf(g).forEach(function (c) {
        if (c.dataset.fxArmed) return;
        c.dataset.fxArmed = '1';
        c.classList.add('fx-pre');
        c.style.transitionDelay = Math.min(j++, 9) * 45 + 'ms';
        if (io && !RM) io.observe(c);
        else requestAnimationFrame(function () { c.classList.add('fx-in'); });
      });
    });
  }

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

  /* ============ 2b) light tilt (desktop pointers only) ============ */
  if (!TOUCH && !RM) {
    var g = grid(), cur = null;
    function reset() { if (cur) { cur.style.transform = ''; cur.classList.remove('fx-tilting'); cur = null; } }
    g.addEventListener('pointermove', function (e) {
      var c = e.target && e.target.closest ? e.target.closest('.gi,.vc') : null;
      if (cur && cur !== c) reset();
      if (!c) return;
      if (cur !== c) { cur = c; c.classList.add('fx-tilting'); }
      var r = c.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      c.style.transform = 'perspective(700px) rotateX(' + (-py * 4.5).toFixed(2) + 'deg) rotateY(' + (px * 4.5).toFixed(2) + 'deg)';
    }, { passive: true });
    g.addEventListener('pointerleave', reset, { passive: true });
    g.addEventListener('pointerdown', reset, { passive: true });
  }

  /* ============ init ============ */
  armEntrances();
})();
