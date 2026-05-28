(function() {
  const panel    = document.getElementById('account-panel');
  const backdrop = document.getElementById('account-backdrop');
  const trigger  = document.getElementById('account-trigger');

  // All focusable elements inside panel for focus trap (SC 2.1.2)
  function getFocusable() {
    return Array.from(panel.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function isMobile() { return window.innerWidth <= 768; }

  window.openAccountPanel = function() {
    // On mobile: move panel + backdrop to body so position:fixed works correctly
    if (isMobile()) {
      document.body.appendChild(backdrop);
      document.body.appendChild(panel);
    }
    panel.classList.add('open');
    backdrop.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    // Prevent body scroll while sheet is open
    if (isMobile()) document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    });
  };

  window.closeAccountPanel = function() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (trigger) trigger.focus();
  };

  // Focus trap (SC 2.1.2)
  panel.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeAccountPanel(); return; }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();
