(function() {
  // Look elements up at call time, not load time — nav.html loads async
  // via fetch() in index.html, so #account-panel/#account-backdrop/#account-trigger
  // don't exist when this script first runs.

  function isMobile() { return window.innerWidth <= 768; }

  function getFocusable(panel) {
    return Array.from(panel.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  window.openAccountPanel = function() {
    const panel    = document.getElementById('account-panel');
    const backdrop = document.getElementById('account-backdrop');
    const trigger  = document.getElementById('account-trigger');
    if (!panel || !backdrop) return;

    // On mobile: move panel + backdrop to body so position:fixed works correctly
    if (isMobile()) {
      document.body.appendChild(backdrop);
      document.body.appendChild(panel);
    }
    panel.classList.add('open');
    backdrop.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (isMobile()) document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const focusable = getFocusable(panel);
      if (focusable.length) focusable[0].focus();
    });
  };

  window.closeAccountPanel = function() {
    const panel    = document.getElementById('account-panel');
    const backdrop = document.getElementById('account-backdrop');
    const trigger  = document.getElementById('account-trigger');
    if (!panel || !backdrop) return;

    panel.classList.remove('open');
    backdrop.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (trigger) trigger.focus();
  };

  // Focus trap (SC 2.1.2) — registered on document so it works regardless of
  // whether nav.html has loaded yet. Guards against firing when panel is closed.
  document.addEventListener('keydown', function(e) {
    const panel = document.getElementById('account-panel');
    if (!panel || !panel.classList.contains('open')) return;
    if (e.key === 'Escape') { window.closeAccountPanel(); return; }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(panel);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();
