const { body } = document;

function changeBackground(num) {
  // Check if background is already showing
  let previousBackground;
  if (body.className) previousBackground = body.className;
  body.classList = '';

  previousBackground === `background-${num}`
    ? false
    : body.classList.add(`background-${num}`);
}
