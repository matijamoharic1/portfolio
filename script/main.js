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
