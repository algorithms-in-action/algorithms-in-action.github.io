/* eslint-disable max-len */
import React, { useEffect } from 'react';
import './styles/App.scss';
import Header from './components/Header';
import { GlobalProvider } from './context/GlobalState';
import RightPanel from './components/right-panel';
import LeftPanel from './components/left-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';
import {
  resizeWindow, startLeftDrag, startRightDrag, startBottomDrag, endDrag, onDrag, collapseLeftDrag, collapseBottomDrag, collapseRightDrag, addEvent,
} from './BorderResize';


function App() {
  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    // eslint-disable-next-line no-unused-vars
    return (_) => { window.removeEventListener('resize', resizeWindow); };
  });


  addEvent(document, 'mouseout', (e) => {
    // e = e || window.event;
    const from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName === 'HTML') {
      // End dragging when mouse out of html
      endDrag();
    }
  });


  return (

    <GlobalProvider>
      <div id="page" onMouseUp={endDrag} role="button" tabIndex="-1" onMouseMove={(event) => onDrag(event)}>
        <div id="header">
          <Header />
        </div>
        <div id="leftcol">
          <LeftPanel />
        </div>
        <div id="leftdragbar" tabIndex="-1" aria-label="Move left drag bar" onDoubleClick={collapseLeftDrag} onMouseDown={startLeftDrag} role="button">
          <div id="draghandle" />
        </div>
        <div id="tabpages">
          <MidPanel />
        </div>
        <div id="rightdragbar" tabIndex="-1" aria-label="Move right drag bar" onDoubleClick={collapseRightDrag} onMouseDown={startRightDrag} role="button">
          <div id="draghandle" />
        </div>
        <div id="rightcol">
          <RightPanel />
        </div>
        <div id="bottomdragbar" tabIndex="-1" aria-label="Move bottom drag bar" onDoubleClick={collapseBottomDrag} onMouseDown={startBottomDrag} role="button">
          <div id="draghandle" />
        </div>
        <div id="footer">
          <ControlPanel />
        </div>
      </div>
    </GlobalProvider>
  );
}


export default App;
