const calculatorDisplay = document.querySelector('h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');

// Calculate first and second values depending on operator
const calculate = {
  '/': (firstNumber, secondNumber) => firstNumber / secondNumber,
  '*': (firstNumber, secondNumber) => firstNumber * secondNumber,
  '+': (firstNumber, secondNumber) => firstNumber + secondNumber,
  '-': (firstNumber, secondNumber) => firstNumber - secondNumber,
  '=': (_, secondNumber) => secondNumber,
};

let firstValue = 0;
let operatorValue = '';
let isAwaitingNextValue = false;

function sendNumberValue(number) {
  // Replace current display if first value is entered
  if (isAwaitingNextValue) {
    calculatorDisplay.textContent = number;
    isAwaitingNextValue = false;
  } else {
    // If current display value is 0 - replace, if not - add
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent =
      displayValue === '0' ? number : displayValue + number;
  }
}

function addDecimal() {
  // If operator pressed, don't add decimal
  if (isAwaitingNextValue) return;
  // If no Decimal - add one
  if (!calculatorDisplay.textContent.includes('.'))
    calculatorDisplay.textContent += '.';
}

function useOperator(operator) {
  // Prevent Multiple operators
  if (operatorValue && isAwaitingNextValue) {
    operatorValue = operator;
    return;
  }
  const currentValue = +calculatorDisplay.textContent;
  // Assign firstValue if no value
  if (!firstValue) firstValue = currentValue;
  else {
    const calculation = calculate[operatorValue](firstValue, currentValue);
    calculatorDisplay.textContent = calculation;
    firstValue = calculation;
  }
  // Raeady for next value, store operator
  isAwaitingNextValue = true;
  operatorValue = operator;
}

// Reset all Values
function resetAll() {
  calculatorDisplay.textContent = '0';
  firstValue = 0;
  operatorValue = '';
  isAwaitingNextValue = false;
}

// Event Listeners for numbers, operators, decimal
inputBtns.forEach((inputBtn) => {
  if (inputBtn.classList.length === 0)
    inputBtn.addEventListener('click', () => sendNumberValue(inputBtn.value));
  else if (inputBtn.classList.contains('operator'))
    inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
  else if (inputBtn.classList.contains('decimal'))
    inputBtn.addEventListener('click', addDecimal);
});

// Reset
clearBtn.addEventListener('click', resetAll);
