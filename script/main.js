/* ── Fade-up on scroll ── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ── Hero parallax ── */
const heroEl  = document.querySelector('.hero-header');
const bg1El   = document.querySelector('.hero-bg-1');
const bg2El   = document.querySelector('.hero-bg-2');
const titleEl = document.querySelector('.portfolio-title');
const phoneEl = document.querySelector('.phone-video');
const flowEl  = document.querySelector('.flowchart');

if (heroEl) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (bg1El)  bg1El.style.transform  = `translate(${dx * -18}px, ${dy * -10}px) scale(1.03)`;
    if (bg2El)  bg2El.style.transform  = `translate(${dx *  12}px, ${dy *   8}px) scale(1.03)`;
    if (titleEl) titleEl.style.transform = `translate(${dx * -8}px, ${dy * -5}px)`;
    if (phoneEl) phoneEl.style.transform = `translate(${dx * -6}px, ${dy * -8}px)`;
    if (flowEl)  flowEl.style.transform  = `translate(${dx *  5}px, ${dy *  6}px) scale(.98)`;
  });
}


/* ── Der Komponist Gin — X-ray scanner on hover / touch ── */
(function () {
  const reveal = document.querySelector('.gin-image-reveal');
  if (!reveal) return;

  const topImg  = reveal.querySelector('.gin-img-top');
  const ring    = reveal.querySelector('.gin-xray-ring');
  if (!topImg) return;

  /* radius of the x-ray circle in px */
  const RADIUS     = 80;
  const SOFT_EDGE  = 18;   /* feathering width */

  /* current and target cursor position (for smooth ring follow) */
  let curX = -999, curY = -999;
  let tgtX = -999, tgtY = -999;
  let rafId = null;
  let active = false;

  function buildMask(x, y, r) {
    const inner = Math.max(0, r - SOFT_EDGE);
    return `radial-gradient(circle ${r}px at ${x}px ${y}px,
      transparent ${inner}px,
      black ${r}px)`;
  }

  function applyMask(x, y, r) {
    const m = buildMask(x, y, r);
    topImg.style.webkitMaskImage = m;
    topImg.style.maskImage       = m;
  }

  function clearMask() {
    /* fully opaque = branded image covers everything */
    topImg.style.webkitMaskImage = '';
    topImg.style.maskImage       = '';
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    if (!active) { rafId = null; return; }

    /* smooth follow */
    curX = lerp(curX, tgtX, 0.14);
    curY = lerp(curY, tgtY, 0.14);

    /* update x-ray hole */
    applyMask(curX, curY, RADIUS);

    /* move the glowing ring to match */
    if (ring) {
      ring.style.left = curX + 'px';
      ring.style.top  = curY + 'px';
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── mouse ── */
  reveal.addEventListener('mouseenter', () => {
    active = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  reveal.addEventListener('mousemove', (e) => {
    const rect = reveal.getBoundingClientRect();
    tgtX = e.clientX - rect.left;
    tgtY = e.clientY - rect.top;

    /* snap immediately on first entry so there's no lag from off-screen */
    if (curX < 0) { curX = tgtX; curY = tgtY; }
  });

  reveal.addEventListener('mouseleave', () => {
    active = false;
    clearMask();
    /* hide ring */
    if (ring) { ring.style.left = '-999px'; ring.style.top = '-999px'; }
    /* reset so next entry snaps */
    curX = -999; curY = -999;
  });

  /* ── touch (tap + drag) ── */
  reveal.addEventListener('touchstart', (e) => {
    reveal.classList.add('touch-active');
    const t = e.touches[0];
    const rect = reveal.getBoundingClientRect();
    tgtX = curX = t.clientX - rect.left;
    tgtY = curY = t.clientY - rect.top;
    active = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  reveal.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const rect = reveal.getBoundingClientRect();
    tgtX = t.clientX - rect.left;
    tgtY = t.clientY - rect.top;
  }, { passive: true });

  reveal.addEventListener('touchend', () => {
    reveal.classList.remove('touch-active');
    active = false;
    clearMask();
    curX = -999; curY = -999;
  });

  reveal.addEventListener('touchcancel', () => {
    reveal.classList.remove('touch-active');
    active = false;
    clearMask();
    curX = -999; curY = -999;
  });

  /* initial state: branded image fully visible */
  clearMask();
})();
