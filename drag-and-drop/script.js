const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const deleteIconContainer = document.querySelector('.delete-icon-container');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let isUpdatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let draggedItemColumn;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
}

// Set localStorage Arrays
function updateSavedColumns() {
  const keys = [
    'backlogItems',
    'progressItems',
    'completeItems',
    'onHoldItems',
  ];
  listArrays.forEach((list, idx) => {
    localStorage.setItem(keys[idx], JSON.stringify(list));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.id = index;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.setAttribute('ondblclick', 'makeEditible(event)');
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Save Item on Enter
  listEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') listEl.blur();
  });
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!isUpdatedOnLoad) {
    getSavedColumns();
    isUpdatedOnLoad = true;
  }

  listColumns.forEach((column) => {
    column.textContent = '';
  });

  listArrays.forEach((listArray, idx) => {
    listArray.forEach((item, i) => {
      createItemEl(listColumns[idx], idx, item, i);
    });
  });

  updateSavedColumns();
}

function makeEditible(e) {
  e.target.contentEditable = true;
  e.target.draggable = false;
  e.target.focus();
}

// Udate Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children[id];
  if (!selectedColumnEl.textContent) selectedArray.splice(id, 1);
  else selectedArray[id] = selectedColumnEl.textContent;
  updateDOM();
}

// Add to Column, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  if (!itemText) return;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  hideAllInputBoxes();
  // Display current one
  setTimeout(() => {
    addBtns[column].style.transition = 'none';
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
    addItems[column].focus();
  }, 10);
}

// Hide Item Input Box
function hideInputBox(isSaveClicked, column) {
  addBtns[column].style.visibility = 'visible';
  addBtns[column].style.transition = 'all 0.3s ease-in';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  // Save Item only when Save btn or Enter is clicked
  isSaveClicked ? addToColumn(column) : (addItems[column].textContent = '');
}

// Hide previously opened Input box
function hideAllInputBoxes() {
  addBtns.forEach((btn, idx) => {
    if (btn.style.visibility === 'hidden') hideInputBox(false, idx);
  });
}

// Allows arrays to reglect Drag and Drop Items
function rebuildArrays() {
  listArrays.forEach((arr, idx) => {
    arr.length = 0;
    arr.push(
      ...Array.from(listColumns[idx].children).map((item) => item.textContent)
    );
  });
  updateSavedColumns();
}

function showDeleteIcon() {
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');
  deleteIcon.setAttribute('ondragenter', 'changeDeleteIconStyle(true)');
  deleteIcon.setAttribute('ondragleave', 'changeDeleteIconStyle(false)');
  deleteIcon.setAttribute('ondragover', 'allowDrop(event)');
  deleteIcon.setAttribute('ondrop', 'deleteOnDrop()');
  deleteIconContainer.appendChild(deleteIcon);
}

function changeDeleteIconStyle(isItemEnters) {
  const icon = document.querySelector('.delete-icon');
  icon.style.opacity = isItemEnters ? 1 : 0.5;
}

function deleteOnDrop() {
  deleteIconContainer.textContent = '';
  listColumns[currentColumn]?.classList.remove('over');
  draggedItemColumn.removeChild(draggedItem);
  rebuildArrays();
}

// When Item starts dragging
function drag(e) {
  draggedItemColumn = e.target.closest('ul');
  draggedItem = e.target;
  // Hide dragged Item
  setTimeout(() => (draggedItem.hidden = true), 10);
  showDeleteIcon();
}

// Column allows for Item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When Item enters column area
function dragEnter(column) {
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  currentColumn = column;
  listColumns[column].classList.add('over');
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  draggedItem.hidden = false;
  listColumns[currentColumn].classList.remove('over');
  deleteIconContainer.textContent = '';
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
}

// On Load
updateDOM();

// Event listeners
window.addEventListener('click', hideAllInputBoxes);
window.addEventListener('dragend', (e) => {
  if (e.dataTransfer.dropEffect === 'none') {
    draggedItem.hidden = false;
    listColumns[currentColumn]?.classList.remove('over');
    deleteIconContainer.textContent = '';
  }
});
// Save Item by hitting Enter key
addItems.forEach((addItem) => {
  addItem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') hideInputBox(true, e.target.id);
  });
});
