const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');
const title = document.getElementById('title');
const countdownBtn = document.getElementById('countdown-button');
const countdownEl = document.getElementById('countdown');
const countdownTitleEl = document.getElementById('countdown-title');
const timeElements = document.querySelectorAll('span');
const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let contdownActive = setInterval;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with today's date
const today = new Date().toISOString().slice(0, 10);
dateEl.min = today;

// populate countdown / complete UI
function updateDOM() {
  contdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    const timeLeft = [days, hours, minutes, seconds];

    // hide input
    inputContainer.hidden = true;

    // if the countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(contdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // populate countdown
      countdownTitleEl.textContent = `${countdownTitle}`;
      timeElements.forEach((timeEl, i) => (timeEl.textContent = timeLeft[i]));
      // show countdown
      countdownEl.hidden = false;
    }
  }, second);
}

// take values from form input
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = title.value;
  countdownDate = dateEl.value;
  localStorage.setItem(
    'countdown',
    JSON.stringify({ title: countdownTitle, date: countdownDate })
  );
  countdownValue = new Date(countdownDate).getTime();
  updateDOM();
}

// reset all values
function reset() {
  // hide countdowns & show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // stop the countdown
  clearInterval(contdownActive);
  // reset values
  title.value = '';
  dateEl.value = '';
  localStorage.clear();
}

function resetPreviousCountdown() {
  if (localStorage.length) {
    inputContainer.hidden = true;
    const { title, date } = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = title;
    countdownDate = date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load
resetPreviousCountdown();
title.focus();
