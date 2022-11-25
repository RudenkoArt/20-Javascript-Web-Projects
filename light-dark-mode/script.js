const toggleSwitch = document.querySelector('input[type="checkbox"]');
const images = document.querySelectorAll('img');
const nav = document.getElementById('nav');
const toggleIcon = document.getElementById('toggle-icon');
const textBox = document.getElementById('text-box');

const imgLinks = [
  'img/undraw_proud_coder_',
  'img/undraw_feeling_proud_',
  'img/undraw_conceptual_idea_',
];

function switchTheme(e) {
  const isDark = e.target.checked ? true : false;
  document.documentElement.setAttribute(
    'data-theme',
    isDark ? 'dark' : 'light'
  );
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  switchMode(isDark);
}

function switchMode(isDark) {
  isDark
    ? toggleIcon.children[1].classList.replace('fa-sun', 'fa-moon')
    : toggleIcon.children[1].classList.replace('fa-moon', 'fa-sun');
  nav.style.backgroundColor = `rgb(${isDark ? '0 0 0' : '255 255 255'} / 50%)`;
  textBox.style.backgroundColor = `rgb(${
    isDark ? '255 255 255' : '0 0 0'
  } / 50%)`;
  toggleIcon.children[0].textContent = `${isDark ? 'Dark' : 'Light'} Mode`;

  images.forEach((img, i) => {
    img.src = `${imgLinks[i]}${isDark ? 'dark' : 'light'}.svg`;
  });
}

function setInitialTheme() {
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
      switchMode(currentTheme);
    }
  }
}

toggleSwitch.addEventListener('change', switchTheme);

setInitialTheme();
