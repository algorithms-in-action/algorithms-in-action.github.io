/* eslint-disable max-len */
import React from 'react';
import './styles/App.scss';
import Header from './components/Header';
import { GlobalProvider } from './context/GlobalState';
import RightPanel from './components/right-panel';
import LeftPanel from './components/left-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';


function App() {
  let isLeftDragging = false;
  let isRightDragging = false;
  let isBottomDragging = false;

  // function resetColumnSizes() {
  //   const page = document.getElementById('pageFrame');
  //   page.style.gridTemplateColumns = '2fr 3px 6fr 3px 2fr';
  //   page.style.gridTemplateRows = 'min-content 7fr 3px 3fr';
  // }

  function setCursor(cursor) {
    const page = document.getElementById('page');
    page.style.cursor = cursor;
  }

  function startLeftDrag() {
    isLeftDragging = true;
    setCursor('col-resize');
  }

  function startRightDrag() {
    isRightDragging = true;
    setCursor('col-resize');
  }

  function startBottomDrag() {
    isBottomDragging = true;
    setCursor('row-resize');
  }

  function endDrag() {
    isLeftDragging = false;
    isRightDragging = false;
    isBottomDragging = false;
    setCursor('auto');
  }

  function onDrag(event) {
    if (isLeftDragging || isRightDragging || isBottomDragging) {
      const page = document.getElementById('page');
      const leftcol = document.getElementById('leftcol');
      const rightcol = document.getElementById('rightcol');

      const header = document.getElementById('header');
      const footer = document.getElementById('footer');

      const leftColWidth = isLeftDragging ? event.clientX : leftcol.clientWidth;
      const rightColWidth = isRightDragging ? page.clientWidth - event.clientX : rightcol.clientWidth;
      const bottomRowHeight = isBottomDragging ? page.clientHeight - event.clientY : footer.clientHeight;

      const dragbarWidth = 3;

      const cols = [
        leftColWidth,
        dragbarWidth,
        page.clientWidth - (2 * dragbarWidth) - leftColWidth - rightColWidth,
        dragbarWidth,
        rightColWidth,
      ];

      const newColDefn = cols.map((c) => `${c.toString()}px`).join(' ');

      const rows = [
        header.clientHeight,
        page.clientHeight - dragbarWidth - bottomRowHeight - header.clientHeight,
        dragbarWidth,
        bottomRowHeight,
      ];

      const newRowDefn = rows.map((r) => `${r.toString()}px`).join(' ');

      page.style.gridTemplateRows = newRowDefn;
      page.style.gridTemplateColumns = newColDefn;

      event.preventDefault();
    }
  }

  // onresize={resetColumnSizes}
  return (
    <div>
      <GlobalProvider>
        <div id="page" onMouseUp={endDrag} role="button" tabIndex="-1" onMouseMove={(event) => onDrag(event)}>
          <div id="header">
            <Header />
          </div>
          <div id="leftcol">
            <LeftPanel />
          </div>
          <div id="leftdragbar" tabIndex="-1" aria-label="Move left drag bar" onMouseDown={startLeftDrag} role="button">
            <div id="draghandle" />
          </div>
          <div id="tabpages">
            <MidPanel />
          </div>
          <div id="rightdragbar" tabIndex="-1" aria-label="Move right drag bar" onMouseDown={startRightDrag} role="button">
            <div id="draghandle" />
          </div>
          <div id="rightcol">
            <RightPanel />
          </div>
          <div id="bottomdragbar" tabIndex="-1" aria-label="Move bottom drag bar" onMouseDown={startBottomDrag} role="button">
            <div id="draghandle" />
          </div>
          <div id="footer">
            <ControlPanel />
          </div>
        </div>
      </GlobalProvider>
    </div>
  );
}


export default App;
