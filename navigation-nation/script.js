const menuBars = document.getElementById('menu-bars');
const overlay = document.getElementById('overlay');
const navs = document.querySelectorAll('li');

function toggleNav() {
  menuBars.classList.toggle('change');
  overlay.classList.toggle('overlay-active');

  if (overlay.classList.contains('overlay-active')) {
    overlay.classList.replace('overlay-slide-left', 'overlay-slide-right');
    navs.forEach((nav, i) => {
      nav.classList.replace(`slide-out-${i + 1}`, `slide-in-${i + 1}`);
    });
  } else {
    overlay.classList.replace('overlay-slide-right', 'overlay-slide-left');
    navs.forEach((nav, i) => {
      nav.classList.replace(`slide-in-${i + 1}`, `slide-out-${i + 1}`);
    });
  }
}

menuBars.addEventListener('click', toggleNav);
navs.forEach((nav) => nav.addEventListener('click', toggleNav));
