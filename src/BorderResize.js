/* eslint-disable max-len */
let isLeftDragging = false;
let isRightDragging = false;
let isBottomDragging = false;

export const setCursor = (cursor) => {
  const page = document.getElementById('page');
  page.style.cursor = cursor;
};

export const startLeftDrag = () => {
  isLeftDragging = true;
  setCursor('col-resize');
};

export const startRightDrag = () => {
  isRightDragging = true;
  setCursor('col-resize');
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

const convertToUnit = (list, unit) => list.map((c) => `${c.toString()}${unit}`).join(' ');

const getColDefn = (page, event) => {
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

  if (event == null) {
    const colsFr = [
      convertToUnit([cols[0] / (cols[0] + cols[2] + cols[4])], 'fr'),
      convertToUnit([leftDragbar.clientWidth], 'px'),
      convertToUnit([cols[2] / (cols[0] + cols[2] + cols[4])], 'fr'),
      convertToUnit([rightDragbar.clientWidth], 'px'),
      convertToUnit([cols[4] / (cols[0] + cols[2] + cols[4])], 'fr'),
    ];

    return convertToUnit(colsFr, '');
  }

  return convertToUnit(cols, 'px');
};

const getRowDefn = (page, event) => {
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

  return convertToUnit(rows, 'px');
};

export const onDrag = (event) => {
  if (isLeftDragging || isRightDragging || isBottomDragging) {
    const page = document.getElementById('page');
    const newColDefn = getColDefn(page, event);
    const newRowDefn = getRowDefn(page, event);

    page.style.gridTemplateRows = newRowDefn;
    page.style.gridTemplateColumns = newColDefn;

    event.preventDefault();
  }
};

export const resetColumnSizes = () => {
  const page = document.getElementById('page');
  const col = getColDefn(page, null);

  page.style.gridTemplateColumns = col;
  page.style.gridTemplateRows = 'min-content 7fr 3px 3fr';
};
