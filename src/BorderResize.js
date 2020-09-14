/* eslint-disable max-len */
let isLeftDragging = false;
let isRightDragging = false;
let isBottomDragging = false;

// Resizing internal border
const ROW_INTERNAL = 0;
const COL_INTERNAL = 1;

// Resizing external (window)
const ROW_EXTERNAL = 2;
const COL_EXTERNAL = 3;

// Collapsing each internal border
const COLLAPSE_LEFT = 4;
const COLLAPSE_RIGHT = 5;
const COLLAPSE_BOTTOM = 6;

// Expanding from collapsed internal border
const EXPAND_LEFT = 7;
const EXPAND_RIGHT = 8;
const EXPAND_BOTTOM = 9;

export const setCursor = (cursor) => {
  const page = document.getElementById('page');
  page.style.cursor = cursor;
};

// This section pertains to resizing internal borders with dragbars
export const startLeftDrag = () => {
  isLeftDragging = true;
  setCursor('col-resize');
};

export const startRightDrag = () => {
  isRightDragging = true;
  setCursor('col-resize');
  console.log('Start Drag');
};

export const startBottomDrag = () => {
  isBottomDragging = true;
  setCursor('row-resize');
};

export const endDrag = () => {
  isLeftDragging = false;
  isRightDragging = false;
  isBottomDragging = false;
  setCursor('auto');
  console.log('END DRAGGING');
};

const addUnitToList = (list, unit) => list.map((c) => `${c.toString()}${unit}`).join(' ');
const addUnitToNum = (num, unit) => `${num.toString()}${unit}`;


const getDefn = (page, list, status) => {
  let tempList = addUnitToList(list, 'px');

  switch (status) {
    case ROW_INTERNAL:
      break;
    case COL_INTERNAL:
      break;
    case ROW_EXTERNAL:
      tempList = addUnitToList([
        addUnitToNum(list[0], 'px'),
        addUnitToNum([list[1] / (list[1] + list[3])], 'fr'),
        addUnitToNum(list[2], 'px'),
        addUnitToNum([list[3] / (list[1] + list[3])], 'fr'),
      ], '');
      console.log(`EXTERNAL ROW: ${tempList}`);

      break;
    case COL_EXTERNAL:
      tempList = addUnitToList([
        addUnitToNum(list[0] / (list[0] + list[2] + list[4]), 'fr'),
        addUnitToNum(list[1], 'px'),
        addUnitToNum(list[2] / (list[0] + list[2] + list[4]), 'fr'),
        addUnitToNum(list[3], 'px'),
        addUnitToNum(list[4] / (list[0] + list[2] + list[4]), 'fr'),
      ], '');
      console.log(`EXTERNAL COL: ${tempList}`);
      break;
    case COLLAPSE_LEFT:
      tempList = addUnitToList([
        addUnitToNum(0, 'px'),
        addUnitToNum(list[1], 'px'),
        addUnitToNum(list[2] / (list[2] + list[4]), 'fr'),
        addUnitToNum(list[3], 'px'),
        addUnitToNum(list[4] / (list[2] + list[4]), 'fr'),
      ], '');
      break;
    case COLLAPSE_RIGHT:
      tempList = addUnitToList([
        addUnitToNum(list[0] / (list[0] + list[2]), 'fr'),
        addUnitToNum(list[1], 'px'),
        addUnitToNum(list[2] / (list[0] + list[2]), 'fr'),
        addUnitToNum(list[3], 'px'),
        addUnitToNum(0, 'px'),
      ], '');
      break;
    case COLLAPSE_BOTTOM:
      tempList = addUnitToList([
        addUnitToNum(list[0], 'px'),
        addUnitToNum(list[1] / list[1], 'fr'),
        addUnitToNum(list[2], 'px'),
        addUnitToNum(0, 'px'),
      ], '');
      break;
    case EXPAND_LEFT:
      break;
    case EXPAND_RIGHT:
      break;
    case EXPAND_BOTTOM:
      break;
    default:
      break;
  }

  return tempList;
};


const getColDefn = (page, event, status) => {
  const leftcol = document.getElementById('leftcol');
  const rightcol = document.getElementById('rightcol');
  const leftDragbar = document.getElementById('leftdragbar');
  const rightDragbar = document.getElementById('rightdragbar');

  const leftColWidth = isLeftDragging ? event.clientX : leftcol.clientWidth;
  const rightColWidth = isRightDragging ? page.clientWidth - event.clientX : rightcol.clientWidth;

  const cols = [
    leftColWidth,
    leftDragbar.clientWidth,
    page.clientWidth - (leftDragbar.clientWidth + rightDragbar.clientWidth) - leftColWidth - rightColWidth,
    rightDragbar.clientWidth,
    rightColWidth,
  ];

  return getDefn(page, cols, status);
};

const getRowDefn = (page, event, status) => {
  const footer = document.getElementById('footer');
  const header = document.getElementById('header');
  const bottomDragbar = document.getElementById('bottomdragbar');
  const bottomRowHeight = isBottomDragging ? page.clientHeight - event.clientY : footer.clientHeight;

  const rows = [
    header.clientHeight,
    page.clientHeight - bottomDragbar.clientHeight - bottomRowHeight - header.clientHeight,
    bottomDragbar.clientHeight,
    bottomRowHeight,
  ];

  return getDefn(page, rows, status);
};

export const onDrag = (event) => {
  if (isLeftDragging || isRightDragging || isBottomDragging) {
    const page = document.getElementById('page');
    const newColDefn = getColDefn(page, event, COL_INTERNAL);
    const newRowDefn = getRowDefn(page, event, ROW_INTERNAL);
    page.style.gridTemplateRows = newRowDefn;
    page.style.gridTemplateColumns = newColDefn;

    console.log(`COL DEF: ${newColDefn}`);
    console.log(`ROW DEF: ${newRowDefn}`);

    event.preventDefault();
  }
};


// This section pertains to collapsing the dragbars
export const collapseLeftDrag = () => {
  console.log('Double Click Left');
  const page = document.getElementById('page');

  const col = getColDefn(page, null, COLLAPSE_LEFT);
  page.style.gridTemplateColumns = col;
};

export const collapseRightDrag = () => {
  const page = document.getElementById('page');
  console.log(`Double Click Right ${page.clientWidth}`);

  const col = getColDefn(page, null, COLLAPSE_RIGHT);
  console.log(`COL: ${col}`);
  page.style.gridTemplateColumns = col;
};

export const collapseBottomDrag = () => {
  console.log('Double Click Bottom');
  const page = document.getElementById('page');
  const row = getRowDefn(page, null, COLLAPSE_BOTTOM);
  page.style.gridTemplateRows = row;
};

// This section pertains to resizing the window

const minLeft = 200;
const minRight = 150;

export const resizeWindow = () => {
  const page = document.getElementById('page');
  const col = getColDefn(page, null, COL_EXTERNAL);
  const row = getRowDefn(page, null, ROW_EXTERNAL);

  const leftcol = document.getElementById('leftcol');
  const rightcol = document.getElementById('rightcol');

  page.style.gridTemplateColumns = col;
  page.style.gridTemplateRows = row;

  if (leftcol.clientWidth < minLeft) {
    collapseLeftDrag();
  }

  if (rightcol.clientWidth < minRight) {
    collapseRightDrag();
  }
};


export const addEvent = (obj, evt, fn) => {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent(`on${evt}`, fn);
  }
};
