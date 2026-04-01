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


/* ── Der Komponist Gin — 3D reveal on hover / touch ── */
(function () {
  const reveal = document.querySelector('.gin-image-reveal');
  if (!reveal) return;

  const topImg = reveal.querySelector('.gin-img-top');
  if (!topImg) return;

  /* ----- animation state ----- */
  let rafId       = null;
  let progress    = 1;     // 1 = fully covered (final render), 0 = fully revealed (3D)
  let targetProg  = 1;
  let isActive    = false; // true while hovering/touching

  /* looping wipe: oscillates between 0.08 and 0 while active */
  let loopDir     = -1;    // -1 shrinks remaining cover, +1 grows it back slightly
  let loopMin     = 0;     // how far the loop goes (fully revealed)
  let loopMax     = 0.12;  // subtle bounce-back amount

  function applyClip(p) {
    /* p = 1 → fully covered (slide from bottom: inset from 0% bottom)
       p = 0 → fully revealed */
    const pct = (p * 100).toFixed(2);
    topImg.style.clipPath = `inset(0 0 ${100 - pct}% 0)`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    if (isActive) {
      /* first bring progress down to 0 quickly, then loop slightly */
      if (progress > loopMin + 0.005) {
        progress = lerp(progress, loopMin, 0.085);
      } else {
        /* micro-loop: oscillate ±loopMax around 0 to suggest "pulsing through" */
        progress += loopDir * 0.004;
        if (progress <= loopMin)           { progress = loopMin;  loopDir =  1; }
        if (progress >= loopMax)           { progress = loopMax;  loopDir = -1; }
      }
    } else {
      /* ease back to fully covered */
      progress = lerp(progress, 1, 0.07);
      if (progress > 0.999) { progress = 1; cancelAnimationFrame(rafId); rafId = null; applyClip(1); return; }
    }

    applyClip(progress);
    rafId = requestAnimationFrame(animate);
  }

  function startReveal() {
    if (isActive) return;
    isActive = true;
    loopDir  = -1;
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  function endReveal() {
    if (!isActive) return;
    isActive = false;
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  /* mouse */
  reveal.addEventListener('mouseenter', startReveal);
  reveal.addEventListener('mouseleave', endReveal);

  /* touch */
  reveal.addEventListener('touchstart', (e) => {
    reveal.classList.add('touch-active');
    startReveal();
  }, { passive: true });

  reveal.addEventListener('touchend', () => {
    reveal.classList.remove('touch-active');
    endReveal();
  });

  reveal.addEventListener('touchcancel', () => {
    reveal.classList.remove('touch-active');
    endReveal();
  });

  /* set initial state */
  applyClip(1);
})();
