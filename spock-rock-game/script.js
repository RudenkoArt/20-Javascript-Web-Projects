const playerScoreEl = document.getElementById('player-score');
const playerChoiceEl = document.getElementById('player-choice');
const computerScoreEl = document.getElementById('computer-score');
const computerChoiceEl = document.getElementById('computer-choice');
const resultText = document.getElementById('result-text');
const allGameIcons = document.querySelectorAll('.far');

const choices = {
  rock: { name: 'Rock', defeats: ['Scissors', 'Lizard'] },
  paper: { name: 'Paper', defeats: ['Rock', 'Spock'] },
  scissors: { name: 'Scissors', defeats: ['Paper', 'Lizard'] },
  lizard: { name: 'Lizard', defeats: ['Paper', 'Spock'] },
  spock: { name: 'Spock', defeats: ['Scissors', 'Rock'] },
};

let playerScoreNumber = 0;
let computerScoreNumber = 0;
let computerChoice = '';

// Reset all selected icons
function resetSelected() {
  removeConfetti();
  allGameIcons.forEach((icon) => {
    icon.classList.remove('selected');
  });
}

// Reset Score & playerChoise/computerChoise
function resetAll() {
  resetSelected();
  removeConfetti();
  playerScoreNumber = 0;
  playerScoreEl.textContent = 0;
  playerChoiceEl.textContent = '';

  computerScoreNumber = 0;
  computerScoreEl.textContent = 0;
  computerChoiceEl.textContent = '';

  resultText.textContent = 'Make a choice.';
}

// Random compute choice
function computerRandomChoice() {
  const computerChoiceNumber = Math.random();
  if (computerChoiceNumber < 0.2) computerChoice = 'Rock';
  else if (computerChoiceNumber <= 0.4) computerChoice = 'Paper';
  else if (computerChoiceNumber <= 0.6) computerChoice = 'Scissors';
  else if (computerChoiceNumber <= 0.8) computerChoice = 'Lizard';
  else computerChoice = 'Spock';
}

// Check result, increse scores, update resultText
function updateScore(playerChoice) {
  if (playerChoice === computerChoice) {
    resultText.textContent = "It's a tie.";
    return;
  }

  if (choices[playerChoice.toLowerCase()].defeats.includes(computerChoice)) {
    startConfetti();
    resultText.textContent = 'You Won!';
    playerScoreNumber++;
    playerScoreEl.textContent = playerScoreNumber;
  } else {
    resultText.textContent = 'You Lost!';
    computerScoreNumber++;
    computerScoreEl.textContent = computerScoreNumber;
  }
}

function displayChoice(player, choice) {
  const selectedEl = document.getElementById(
    `${player}-${choice.toLowerCase()}`
  );
  selectedEl.classList.add('selected');

  if (player === 'player') playerChoiceEl.textContent = ` --- ${choice}`;
  else computerChoiceEl.textContent = ` --- ${choice}`;
}

// Call function to process turn
function checkResult(playerChoice) {
  resetSelected();
  computerRandomChoice();
  displayChoice('player', playerChoice);
  displayChoice('computer', computerChoice);
  updateScore(playerChoice);
}
