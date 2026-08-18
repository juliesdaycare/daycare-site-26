(function () {
  'use strict';

  /* clickjacking guard: this page must never be framed by another site.
     CSP frame-ancestors is ignored in <meta>, so it is enforced here too. */
  try {
    if (window.top !== window.self) { window.top.location = window.self.location; }
  } catch (e) { document.documentElement.style.display = 'none'; }

  /* visit form -> Netlify Forms. Success is shown only when the POST actually
     succeeded; a failure tells the parent to text instead. Never a fake receipt. */
  var form = document.getElementById('visitForm'),
      ok   = document.getElementById('formOk'),
      err  = document.getElementById('formErr');

  if (form && ok && err) {
    var zh = document.documentElement.lang.indexOf('zh') === 0;
    var btn = form.querySelector('button[type="submit"]');
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

    function reveal(el) {
      el.classList.add('show');
      el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      err.classList.remove('show');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = zh ? '发送中…' : 'Sending…'; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) { throw new Error(res.status); }
        form.reset();
        if (btn) { btn.remove(); }
        reveal(ok);
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        reveal(err);
      });
    });
  }

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
