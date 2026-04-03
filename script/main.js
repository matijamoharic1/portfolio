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

/* ── Der Komponist Gin — X-ray scanner ── */
(function () {
  const reveal = document.querySelector('.gin-image-reveal');
  if (!reveal) return;

  const topImg = reveal.querySelector('.gin-img-top');
  const ring   = reveal.querySelector('.gin-xray-ring');
  if (!topImg) return;

  const RADIUS = 90;
  const FEATHER = 20;

  let rafId = null;
  let active = false;

  let tgtX = 0, tgtY = 0;
  let curX = 0, curY = 0;
  let hasPos = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function setHole(x, y) {
    const inner = RADIUS - FEATHER;
    const mask = `radial-gradient(circle at ${x}px ${y}px,
      transparent ${inner}px,
      black ${RADIUS}px)`;
    topImg.style.webkitMaskImage = mask;
    topImg.style.maskImage = mask;
  }

  function removeHole() {
    topImg.style.webkitMaskImage = 'none';
    topImg.style.maskImage = 'none';
  }

  function moveRing(x, y) {
    if (!ring) return;
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
  }

  function tick() {
    if (!active) {
      rafId = null;
      return;
    }

    if (hasPos) {
      curX = lerp(curX, tgtX, 0.16);
      curY = lerp(curY, tgtY, 0.16);
      setHole(curX, curY);
      moveRing(curX, curY);
    }

    rafId = requestAnimationFrame(tick);
  }

  function getPos(e) {
    const rect = reveal.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  reveal.addEventListener('mousemove', (e) => {
    const p = getPos(e);
    tgtX = p.x;
    tgtY = p.y;

    if (!hasPos) {
      curX = tgtX;
      curY = tgtY;
      hasPos = true;
    }

    if (!active) {
      active = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }
  });

  reveal.addEventListener('mouseleave', () => {
    active = false;
    hasPos = false;
    removeHole();
    if (ring) {
      ring.style.left = '-999px';
      ring.style.top = '-999px';
    }
  });

  function touchPos(e) {
    const t = e.touches[0];
    const rect = reveal.getBoundingClientRect();
    return {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    };
  }

  reveal.addEventListener('touchstart', (e) => {
    reveal.classList.add('touch-active');
    const p = touchPos(e);
    tgtX = curX = p.x;
    tgtY = curY = p.y;
    hasPos = true;
    active = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  reveal.addEventListener('touchmove', (e) => {
    const p = touchPos(e);
    tgtX = p.x;
    tgtY = p.y;
  }, { passive: true });

  function endTouch() {
    reveal.classList.remove('touch-active');
    active = false;
    hasPos = false;
    removeHole();
  }

  reveal.addEventListener('touchend', endTouch);
  reveal.addEventListener('touchcancel', endTouch);

  removeHole();
})();
