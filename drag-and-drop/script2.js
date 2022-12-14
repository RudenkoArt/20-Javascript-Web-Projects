const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
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
const lists = [backlogList, progressList, completeList, onHoldList];
let listArrays = [];

// Drag Functionality
let draggedItem;
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
  // prettier-ignore
  const keys = ['backlogItems', 'progressItems','completeItems', 'onHoldItems']
  // prettier-ignore

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
  listEl.setAttribute('ondragstart', 'drag(event)');

  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!isUpdatedOnLoad) {
    getSavedColumns();
    isUpdatedOnLoad = true;
  }

  lists.forEach((list) => {
    list.textContent = '';
  });

  listArrays.forEach((listArray, idx) => {
    listArray.forEach((item, i) => {
      createItemEl(lists[idx], idx, item, i);
    });
  });

  // // Backlog Column
  // backlogListArray.forEach((backlogItem, idx) => {
  //   createItemEl(backlogList, 0, backlogItem, idx);
  // });
  // // Progress Column
  // progressListArray.forEach((progressItem, idx) => {
  //   createItemEl(progressList, 0, progressItem, idx);
  // });
  // // Complete Column
  // completeListArray.forEach((completeItem, idx) => {
  //   createItemEl(completeList, 0, completeItem, idx);
  // });
  // // On Hold Column
  // onHoldListArray.forEach((onHoldItem, idx) => {
  //   createItemEl(onHoldList, 0, onHoldItem, idx);
  // });
  // // Run getSavedColumns only once, Update Local Storage

  updateSavedColumns();
}

// Udate Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!selectedColumnEl[id].textContent) selectedArray.splice(id, 1);
  else selectedArray[id] = selectedColumnEl[id].textContent;
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
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reglect Drag and Drop Items
function rebuildArrays() {
  listArrays.forEach((arr, idx) => {
    arr.length = 0;
    for (let i = 0; i < lists[idx].children.length; i++) {
      arr.push(lists[idx].children[i].textContent);
    }
  });
  updateSavedColumns();
}

// When Item starts dragging
function drag(e) {
  draggedItem = e.target;

  // TODO: delete element as soon as it starts dragging
  // const parent = e.target.closest('ul');
  // for (let i = 0; i < parent.children.length; i++) {
  //   if (parent.children[i].textContent === e.target.textContent)
  //     setTimeout(() => parent.children[i].remove(), 1);
  // }
}

// Column allows for Item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When Item enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
  console.log(currentColumn);
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();

  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  console.log(draggedItem);
  parent.appendChild(draggedItem);
  rebuildArrays();
}

// On Load
updateDOM();
window.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'LI') {
    e.target.contentEditable = true;
    e.target.focus();
  }
});
