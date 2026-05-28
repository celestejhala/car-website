function toggleDrop(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  closeAll();
  if (!isOpen) {
    item.classList.add('open');
    document.getElementById('backdrop').classList.add('active');
  }
}

function closeAll() {
  document.querySelectorAll('.main-nav-list > li').forEach(el => el.classList.remove('open'));
  document.getElementById('backdrop').classList.remove('active');
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.add('open');
  menu.classList.remove('show-account');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
  menu.classList.remove('show-account');
}

function mobileMenuShowAccount() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.add('show-account');
  // Focus first item in account view
  requestAnimationFrame(() => {
    const view = document.querySelector('.mobile-account-view');
    const first = view && view.querySelector('a[href], button');
    if (first) first.focus();
  });
}

function mobileMenuBack() {
  document.getElementById('mobile-menu').classList.remove('show-account');
  // Return focus to My Account button
  requestAnimationFrame(() => {
    const btn = document.querySelector('.mobile-bottom-bar button');
    if (btn) btn.focus();
  });
}

function toggleMobile(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.mobile-acc-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Escape: back out of account view or close menu
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  const menu = document.getElementById('mobile-menu');
  if (!menu || !menu.classList.contains('open')) return;
  if (menu.classList.contains('show-account')) mobileMenuBack();
  else closeMobileMenu();
});
