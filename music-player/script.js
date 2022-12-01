const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const songs = [
  {
    name: 'neffex-1',
    trackName: 'Best of Me',
    artistName: 'NEFFEX',
  },
  {
    name: 'neffex-2',
    trackName: 'Are you OK',
    artistName: 'NEFFEX',
  },
  {
    name: 'neffex-3',
    trackName: 'Rumors',
    artistName: 'NEFFEX',
  },
];

let isPlaying = false;
let songIndex = 0;

function playSong() {
  music.play();
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  isPlaying = true;
}

function pauseSong() {
  music.pause();
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  isPlaying = false;
}

function nextSong() {
  songIndex++;
  if (songIndex === songs.length) songIndex = 0;
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
}

// update DOM
function loadSong(song) {
  const { name, trackName, artistName } = song;
  artist.textContent = artistName;
  title.textContent = trackName;
  music.src = `music/${name}.mp3`;
  image.src = `img/${name}.jpg`;
}

// update progress bar & time
function updateProgressBar(e) {
  const { duration, currentTime } = e.srcElement;

  // update progress bar
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  // avoiding NaN displaying
  if (duration) {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = String(Math.floor(duration % 60)).padStart(2, 0);
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;

    const currentMinutes = Math.floor(currentTime / 60);

    const currentSeconds = String(Math.floor(currentTime % 60)).padStart(2, 0);

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// event listeners

playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgressBar);

// on load - select first song
loadSong(songs[songIndex]);
