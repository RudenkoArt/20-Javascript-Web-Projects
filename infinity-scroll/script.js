const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isInitialLoad = true;
let isReadyToLoadMore = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// unsplash API
let imgsToLoadCount = 5;
const API_KEY = ''; // <-- TODO:insert your unsplash key here
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${imgsToLoadCount}`;

// check if all imgs were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    isReadyToLoadMore = true;
    loader.hidden = true;

    // increasing the number of images to load
    if (isInitialLoad) {
      isInitialLoad = false;
      imgsToLoadCount = 30;
      apiUrl = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${imgsToLoadCount}`;
    }
  }
}

// helper function
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    // create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });

    // create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    img.addEventListener('load', imageLoaded);

    // Put <img> inside <a>, then put both inside imageContainer el
    item.appendChild(img);
    imageContainer.append(item);
  });
}

async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch {
    // handle error here
  }
}

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    isReadyToLoadMore
  ) {
    isReadyToLoadMore = false;
    getPhotos();
  }
});

// on load
getPhotos();
