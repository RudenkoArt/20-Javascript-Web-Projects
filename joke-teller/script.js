const button = document.getElementById('button');
const audioEl = document.getElementById('audio');

let joke = '';

// passing joke to VoiceRSS API
function tellMeAJoke(joke) {
  button.disabled = true;
  VoiceRSS.speech({
    key: '', // <-- TODO: insert your voiceRSS key here
    src: joke,
    hl: 'en-us',
    r: 0,
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false,
  });
  getJokes();
}

async function getJokes() {
  const apiUrl =
    'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.setup) joke = `${data.setup} ... ${data.delivery}`;
    else joke = data.joke;
  } catch (err) {
    // handle error here
    console.log('ooops', err);
  }
}

button.addEventListener('click', () => tellMeAJoke(joke));
audioEl.addEventListener('ended', () => {
  button.disabled = false;
});

// on load
getJokes();
