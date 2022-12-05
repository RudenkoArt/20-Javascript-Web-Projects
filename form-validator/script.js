const form = document.getElementById('form');
const inputs = document.querySelectorAll('input');
const passwordEls = document.querySelectorAll('input[type="password"]');
const password1El = document.getElementById('password1');
const password2El = document.getElementById('password2');
const showPassIcons = document.querySelectorAll('.show-password');
const messageContainer = document.querySelector('.message-container');
const message = document.getElementById('message');

let isValid = false;
let isPasswordsMatch = false;

function togglePassword(e) {
  if (password1El.type === 'password') {
    passwordEls.forEach((input) => (input.type = 'text'));
    showPassIcons.forEach((icon) => {
      icon.classList.replace('fa-eye', 'fa-eye-slash');
      icon.style.transform = 'translateX(1px)';
    });
  } else {
    passwordEls.forEach((input) => (input.type = 'password'));
    showPassIcons.forEach((icon) => {
      icon.classList.replace('fa-eye-slash', 'fa-eye');
      icon.style.transform = 'translateX(0px)';
    });
  }
  e.target.previousElementSibling.focus();
}

function showCheckIfValid(e) {
  e.target.previousElementSibling.style.opacity = e.target.validity.valid
    ? 1
    : 0;
}

function styleMessageContainer(newColor, newMessage) {
  message.textContent = newMessage;
  message.style.color = newColor;
  messageContainer.style.borderColor = newColor;
}

function validateForm() {
  // Using Constraint API
  isValid = form.checkValidity();
  // Style main message for an error
  if (!isValid) {
    styleMessageContainer('red', 'Please fill out all fields.');
    return;
  }
  // Check to see if passwords match
  if (password1El.value === password2El.value) {
    isPasswordsMatch = true;
    passwordEls.forEach((input) => (input.style.borderColor = 'green'));
  } else {
    isPasswordsMatch = false;
    styleMessageContainer('red', 'Make sure passwords match.');
    passwordEls.forEach((input) => (input.style.borderColor = 'red'));
    return;
  }
  // If form is valid and password match
  if (isValid && isPasswordsMatch) {
    styleMessageContainer('green', 'Successfully Registered!');
  }
}

function storeFormData() {
  const user = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    website: form.website.value,
    password: form.password.value,
  };
  // Do something with user data
  console.log(user);
}

function processFormData(e) {
  e.preventDefault();
  validateForm();
  if (isValid && isPasswordsMatch) storeFormData();
}

// Event listeners
form.addEventListener('submit', processFormData);
showPassIcons.forEach((btn) => btn.addEventListener('click', togglePassword));
inputs.forEach((input) => {
  input.addEventListener('input', showCheckIfValid);
});
