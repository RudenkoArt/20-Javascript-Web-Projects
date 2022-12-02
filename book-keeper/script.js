const modal = document.getElementById('modal');
const showModalBtn = document.getElementById('show-modal');
const closeModalBtn = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

function validateForm(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }

  return true;
}

function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://'))
    urlValue = `https://${urlValue}`;
  if (!validateForm(nameValue, urlValue)) return false;
  bookmarks[nameValue] = urlValue;
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarkForm.reset();
  websiteNameEl.focus();
  buildBookmarksDOM();
}

function deleteBookmark(name) {
  if (bookmarks[name]) delete bookmarks[name];
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    bookmarks = { Google: 'https://google.com' };
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  buildBookmarksDOM();
}

function buildBookmarksDOM() {
  bookmarksContainer.textContent = '';
  for (const [name, url] of Object.entries(bookmarks)) {
    const item = document.createElement('div');
    item.classList.add('item');
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-trash-can');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${name}')`);
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    const favicon = document.createElement('img');
    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  }
}

showModalBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', () =>
  modal.classList.remove('show-modal')
);
window.addEventListener('click', (e) =>
  e.target === modal ? modal.classList.remove('show-modal') : false
);
bookmarkForm.addEventListener('submit', storeBookmark);

// on load
fetchBookmarks();
