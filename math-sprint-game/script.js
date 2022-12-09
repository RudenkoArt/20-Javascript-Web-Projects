// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Scores
let bestScoreArray = [];

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Time
let timer = setInterval;
let timePlayed = 0;
let penaltyTime = 0;
let finalTimeDisplay = '0.0s';

// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  bestScores.forEach((scoreEl, idx) => {
    scoreEl.textContent = bestScoreArray[idx].bestScore;
  });
}

// Check localStorage for Best Scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores'))
    bestScoreArray = JSON.parse(localStorage.bestScores);
  else
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score) => {
    if (
      score.questions === questionAmount &&
      (parseFloat(score.bestScore) === 0 ||
        parseFloat(score.bestScore) > parseFloat(finalTimeDisplay))
    ) {
      score.bestScore = finalTimeDisplay;
      localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
    }
  });
}

// Reset the Game
function playAgain() {
  scorePage.hidden = true;
  splashPage.hidden = false;
  playAgainBtn.hidden = true;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  // Save and display best scores
  updateBestScore();
  bestScoresToDOM();
}

// Show score page
function showScorePage() {
  gamePage.hidden = true;
  scorePage.hidden = false;
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1500);
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = `${(timePlayed + penaltyTime).toFixed(1)}s`;
  baseTimeEl.textContent = `Base Time: ${timePlayed.toFixed(1)}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime.toFixed(1)}s`;
  finalTimeEl.textContent = finalTimeDisplay;
  showScorePage();
}

//Stop Timer, Process Results, go to Score Page
function checkTime() {
  clearInterval(timer);
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  // Check for wrong guesses, add penalty time
  equationsArray.forEach((equation, idx) => {
    if (equation.evaluated !== playerGuessArray[idx]) penaltyTime += 0.5;
  });
  scoresToDOM();
}

// Start Timer when game page gets displayed
function startTimer() {
  // Reset timers
  timePlayed = 0;
  penaltyTime = 0;
  timer = setInterval(() => {
    // Add a tenth of a secong to timePlayed
    timePlayed += 0.1;
  }, 100);
}

// Scroll, Store user selection in playerGuessArray
function select(guess) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  playerGuessArray.push(guess);
  // Check if player answered the last question
  if (playerGuessArray.length === questionAmount) checkTime();
}

// Display Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  let equationObject = {};
  let firstNumber = 0;
  let secondNumber = 0;
  const wrongFormat = [];
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to DOM
function equationToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count < 0) {
      showGamePage();
      startTimer();
      clearInterval(timeCountDown);
    }
    countdown.textContent = count === 0 ? 'GO!' : count;
  }, 1000);
}

// Navigate from Splash Page to Countdown Page
function showCountdownPage() {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownStart();
}

function setQuestionAmount() {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add selected class back if it's checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
      // Set question amount
      questionAmount = +radioEl.children[1].value;
    }
  });
}

function startRound(e) {
  e.preventDefault();
  if (!questionAmount) return;
  showCountdownPage();
  populateGamePage();
}

// Event Listeners
startForm.addEventListener('click', setQuestionAmount);
startForm.addEventListener('submit', startRound);

// On load
getSavedBestScores();
