document.addEventListener('DOMContentLoaded', function() {
(function() {
  const TOTAL   = 7;
  const VISIBLE = 4;
  let current      = 0; // logical slide index (0–6)
  let stripPos     = 0; // actual position in the cloned track (0–TOTAL+VISIBLE-1)

  const slideImgs  = document.querySelectorAll('.featured-slide-img');
  const slideConts = document.querySelectorAll('.featured-slide-content');
  const realThumbs = document.querySelectorAll('.featured-thumb[data-index]');
  const track      = document.getElementById('featured-thumbs-track');
  const prevBtn    = document.getElementById('featured-prev');
  const nextBtn    = document.getElementById('featured-next');
  const announce   = document.getElementById('carousel-announce');
  const mobileDots = document.querySelectorAll('.featured-dot-m');

  // Clone first VISIBLE thumbs and append — creates seamless loop buffer
  for (let i = 0; i < VISIBLE; i++) {
    const clone = realThumbs[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('id');
    clone.removeAttribute('data-index');
    track.appendChild(clone);
  }

  function slotWidth() {
    const gap = parseFloat(getComputedStyle(track).gap) || 12;
    return realThumbs[0].getBoundingClientRect().width + gap;
  }

  function setStrip(pos, animate) {
    track.style.transition = animate ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    if (!animate) void track.offsetWidth;
    track.style.transform = 'translateX(-' + (pos * slotWidth()) + 'px)';
  }

  function updateSlides() {
    slideImgs.forEach((el, i)  => el.classList.toggle('active', i === current));
    slideConts.forEach((el, i) => el.classList.toggle('active', i === current));
    realThumbs.forEach((el, i) => {
      el.classList.toggle('active', i === current);
      el.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    // Mirror active state onto clones
    const allThumbs = track.querySelectorAll('.featured-thumb');
    allThumbs.forEach((el, i) => {
      el.classList.toggle('active', (i % TOTAL) === current);
    });
    // Sync mobile dots
    mobileDots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const title = slideConts[current].querySelector('.featured-main-title').textContent;
    announce.textContent = 'Slide ' + (current + 1) + ' of ' + TOTAL + ': ' + title;
  }

  function goTo(newCurrent, direction) {
    current = ((newCurrent % TOTAL) + TOTAL) % TOTAL;
    stripPos += direction; // always increment/decrement strip position linearly

    updateSlides();
    setStrip(stripPos, true);

    // After animation, if we've scrolled into the clone zone, snap back silently
    track.addEventListener('transitionend', function onEnd() {
      track.removeEventListener('transitionend', onEnd);
      if (stripPos >= TOTAL) {
        stripPos = stripPos - TOTAL;
        setStrip(stripPos, false);
      } else if (stripPos < 0) {
        stripPos = stripPos + TOTAL;
        setStrip(stripPos, false);
      }
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1, -1));
  nextBtn.addEventListener('click', () => goTo(current + 1, +1));

  // Clicking a real thumb: advance by its visual distance from slot 0
  realThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      const steps = ((i - current) % TOTAL + TOTAL) % TOTAL;
      if (steps === 0) return;
      goTo(current + steps, +steps);
    });
  });

  // Mobile dot clicks: jump directly to that slide
  mobileDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.dot);
      const steps = ((target - current) % TOTAL + TOTAL) % TOTAL;
      if (steps === 0) return;
      goTo(target, steps <= TOTAL / 2 ? +steps : -(TOTAL - steps));
    });
  });

  document.getElementById('featured-carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1, -1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1, +1); }
  });

  realThumbs.forEach((thumb) => {
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1, -1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1, +1); }
    });
  });

  // Initialise
  updateSlides();
  setStrip(0, false);
})();
});

(function() {
  const tabs   = document.querySelectorAll('.resources-tab');
  const panels = document.querySelectorAll('.resources-panel');

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');
    document.getElementById(tab.getAttribute('aria-controls')).classList.add('active');
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));

    // Arrow key nav per ARIA tabs pattern (SC 2.1.1)
    tab.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End')  next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); next.focus(); activateTab(next); }
    });
  });

  // Set initial tabindex on non-active tabs (roving tabindex pattern)
  tabs.forEach(t => { if (!t.classList.contains('active')) t.setAttribute('tabindex', '-1'); });
})();
