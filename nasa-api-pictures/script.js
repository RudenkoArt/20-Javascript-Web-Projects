const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};
let currentPage = 'results';

function createDOMNodes() {
  const currentArray =
    currentPage === 'results' ? resultsArray : Object.values(favorites);
  currentArray.forEach((res) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = res.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // Image
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = res.url;
    img.alt = 'NASA Picture of the Day';
    img.loading = 'lazy';
    // Card body
    const body = document.createElement('div');
    body.classList.add('card-body');
    // Card title
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = res.title;
    // Add/remove favorite
    const favorite = document.createElement('p');
    favorite.classList.add('clickable');
    favorite.textContent = Object.keys(favorites).includes(res.url)
      ? 'Remove Favorite'
      : 'Add to Favorites';
    favorite.setAttribute('onclick', `toggleFavorite(this, '${res.url}')`);
    // Card text
    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = res.explanation;
    // Date & Copyright
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    const date = document.createElement('strong');
    date.textContent = res.date;
    const copyright = document.createElement('span');
    copyright.textContent = res.copyright || '';
    // Append everything
    footer.append(date, copyright);
    body.append(title, favorite, text, footer);
    link.appendChild(img);
    card.append(link, body);
    imagesContainer.appendChild(card);
  });
}

function updateDOM() {
  // Get Favorites from localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes();
}

function toggleFavorite(clickedEl, itemUrl) {
  if (clickedEl.textContent === 'Add to Favorites') {
    clickedEl.textContent = 'Remove Favorite';
    resultsArray.forEach((item) => {
      if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
        favorites[itemUrl] = item;
        saveConfirmed.hidden = false;
        setTimeout(() => (saveConfirmed.hidden = true), 3000);
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
      }
    });
  } else {
    clickedEl.textContent = 'Add to Favorites';
    if (favorites[itemUrl]) {
      delete favorites[itemUrl];
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  }
  if (currentPage === 'favorites') updateDOM();
}

async function getNasaPictures() {
  loader.classList.remove('hidden');
  try {
    const res = await fetch(apiUrl);
    resultsArray = await res.json();
    updateDOM();
    showContent();
  } catch (err) {
    // handle error here
  }
}

function showContent() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
}

function changePage() {
  currentPage = currentPage === 'results' ? 'favorites' : 'results';
  updateDOM();
  resultsNav.classList.toggle('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  favoritesNav.classList.toggle('hidden');
}

// On load
getNasaPictures();
