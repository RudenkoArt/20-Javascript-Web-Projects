const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const API_URL = 'https://type.fit/api/quotes';
let apiQuotes = [];

// show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// hide loading
function complete() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

// pick a random quote
function getRandomQuote() {
  loading();
  // destructuring quote text and author
  const { text, author } =
    apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  // check if a quote has an author and adding 'unknown' if doesn't
  quoteAuthor.textContent = author ? author : 'Unknown';

  // check quote length to set the size of a text
  if (text.length > 50) quoteText.classList.add('long-quote');
  else quoteText.classList.remove('long-quote');

  quoteText.textContent = text;
  complete();
}

// get quotes from API
async function getQuotes() {
  loading();
  try {
    const res = await fetch(API_URL);
    apiQuotes = await res.json();
    getRandomQuote();
  } catch (err) {
    // handle error here
  }
}

// tweet quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${quoteAuthor.textContent}`;
  window.open(twitterUrl, '_blank');
}
// event listeners
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', getRandomQuote);

// on load
getQuotes();
