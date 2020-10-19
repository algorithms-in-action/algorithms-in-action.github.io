/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/top/Header';
import { GlobalProvider } from './context/GlobalState';
import RightPanel from './components/right-panel';
import LeftPanel from './components/left-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';
import Settings from './components/top/Settings';
import {
  resizeWindow, startLeftDrag, startRightDrag, startBottomDrag, endDrag, onDrag, collapseLeftDrag, collapseBottomDrag, collapseRightDrag, addEvent,
} from './BorderResize';

import useComponentVisible from './components/top/helper';

const DEFAULT_FONT_INCREMENT = 0;
const LEFT_FONT_SIZE = 14;
const MID_FONT_SIZE = 15;
const RIGHT_FONT_SIZE = 15;

function App() {
  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    // eslint-disable-next-line no-unused-vars
    return (_) => { window.removeEventListener('resize', resizeWindow); };
  });

  // addEvent(document, 'mouseout', (e) => {
  //   // e = e || window.event;
  //   const from = e.relatedTarget || e.toElement;
  //   if (!from || from.nodeName === 'HTML') {
  //     // End dragging when mouse out of html
  //     endDrag();
  //   }
  // });

  // add mouseout event listener to 'document' when App first mount
  useEffect(() => {
    const mouseOutCallback = (e) => {
      // e = e || window.event;
      const from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName === 'HTML') {
        // End dragging when mouse out of html
        endDrag();
      }
    };

    addEvent(document, 'mouseout', mouseOutCallback);

    // do not forget to remove event listener when the App component unmount
    return () => {
      document.removeEventListener('mouseout', mouseOutCallback);
    };
  }, []);

  const {
    // ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(true);

  // ref={ref}
  const onSetting = () => {
    // console.log(isComponentVisible);
    if (isComponentVisible) {
      setIsComponentVisible(false);
    } else {
      setIsComponentVisible(true);
    }
  };

  const [fontSizeIncrease, setFontSizeIncrease] = useState(DEFAULT_FONT_INCREMENT);
  const onFontIncrease = (val) => {
    setFontSizeIncrease(fontSizeIncrease + val);
  };

  return (

    <GlobalProvider>
      { isComponentVisible ? <Settings onFontIncrease={onFontIncrease} /> : ''}

      <div id="page" onMouseUp={endDrag} role="button" tabIndex="-1" onMouseMove={(event) => onDrag(event)}>
        <div id="header">
          <Header onSetting={onSetting} />
        </div>

        <div id="leftcol">
          <LeftPanel fontSize={LEFT_FONT_SIZE} fontSizeIncrement={fontSizeIncrease} />
        </div>
        <div id="leftdragbar" tabIndex="-1" aria-label="Move left drag bar" onDoubleClick={collapseLeftDrag} onMouseDown={startLeftDrag} role="button">
          <div id="draghandle" />
        </div>
        <div id="tabpages">
          <MidPanel fontSize={MID_FONT_SIZE} fontSizeIncrement={fontSizeIncrease} />
        </div>
        <div id="rightdragbar" tabIndex="-1" aria-label="Move right drag bar" onDoubleClick={collapseRightDrag} onMouseDown={startRightDrag} role="button">
          <div id="draghandle" />
        </div>
        <div id="rightcol">
          <RightPanel fontSize={RIGHT_FONT_SIZE} fontSizeIncrement={fontSizeIncrease} />
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
