(function () {
  'use strict';

  /* clickjacking guard: this page must never be framed by another site.
     CSP frame-ancestors is ignored in <meta>, so it is enforced here too. */
  try {
    if (window.top !== window.self) { window.top.location = window.self.location; }
  } catch (e) { document.documentElement.style.display = 'none'; }

  /* mobile sticky CTA after the hero */
  var sticky = document.getElementById('stickyCta'), hero = document.querySelector('.hero');
  function onScroll() {
    if (!sticky || !hero) { return; }
    if (window.innerWidth > 640) { sticky.classList.remove('show'); return; }
    sticky.classList.toggle('show', hero.getBoundingClientRect().bottom < 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
