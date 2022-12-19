const BRUSH_DELAY = 1500;
const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
  brushSize.textContent = currentSize > 9 ? currentSize : `0${currentSize}`;
}

// Switch to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

// Switch to Brush with delay
function displayBrushTimeout(ms) {
  setTimeout(switchToBrush, ms);
}

// Changing Background color
function changeBackgroundColor() {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// EVENT LISTENERS

// Pick Brush
brushIcon.addEventListener('click', switchToBrush);

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Brush Size
brushSlider.addEventListener('change', (e) => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Setting Background Color
bucketColorBtn.addEventListener('change', changeBackgroundColor);

// Pick Eraser
eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser ';
  currentColor = bucketColor;
  currentSize = 50;
});

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared 🧹';
  displayBrushTimeout(BRUSH_DELAY);
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  if (drawnArray.length) {
    // Removing # symbol
    const background = bucketColor.slice(1);
    localStorage.setItem(
      'savedCanvas',
      JSON.stringify({ drawing: drawnArray, background })
    );
    // Active Tool
    activeToolEl.textContent = 'Canvas Saved 🎨';
    displayBrushTimeout(BRUSH_DELAY);
  } else {
    activeToolEl.textContent = 'Draw something first 😉';
    displayBrushTimeout(BRUSH_DELAY);
  }
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    const { drawing, background } = JSON.parse(localStorage.savedCanvas);
    drawnArray = drawing;
    bucketColorBtn.value = background;
    bucketColorBtn.style.backgroundColor = `#${background}`;
    changeBackgroundColor();
    // Active Tool
    activeToolEl.textContent = 'Canvas Loaded 🖼';
    displayBrushTimeout(BRUSH_DELAY);
  } else {
    activeToolEl.textContent = 'No Canvas Found 🤷‍♂️';
    displayBrushTimeout(BRUSH_DELAY);
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared ♻️';
  displayBrushTimeout(BRUSH_DELAY);
});

// Download Image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'paint-example.jpeg';
  // Active Tool
  activeToolEl.textContent = 'Image File Saved 👨‍🎨';
  displayBrushTimeout(BRUSH_DELAY);
});

// MOUSE EVENT LISTENERS

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// ON LOAD
createCanvas();
