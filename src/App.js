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
import {
  setTheme,
} from './components/top/helper';


const DEFAULT_FONT_INCREMENT = 0;
const LEFT_FONT_SIZE = 13;
const MID_FONT_SIZE = 15;
const RIGHT_FONT_SIZE = 15;

function App() {
  // const [colorMode, setColorMode] = useState(0);

  // const handleColorModeChange = (color) => {
  //   setColorMode(color);
  // };


  useEffect(() => {
    window.addEventListener('resize', (event) => { resizeWindow(event); });
    // eslint-disable-next-line no-unused-vars
    return (_) => { window.removeEventListener('resize', resizeWindow); };
  });

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

  const [isSettingVisible, setSettingVisible] = useState(false);

  const onSetting = () => {
    setSettingVisible(!isSettingVisible);
  };

  const [fontSizeIncrease, setFontSizeIncrease] = useState(DEFAULT_FONT_INCREMENT);
  const onFontIncrease = (val) => {
    setFontSizeIncrease(fontSizeIncrease + val);
  };

  const [colorMode, setColorMode] = useState(0);
  const handleColorModeChange = (id) => {
    const num = parseInt(id, 10);
    setColorMode(num);
  };

  const [systemColor, setSystemColor] = useState(localStorage.getItem('theme'));
  const handleSystemColorChange = (id) => {
    setSystemColor(id);
    console.log('HER');
    setTheme(id);
  };

  useEffect(() => {
    console.log(`effect: ${localStorage.getItem('theme')}`);
    setTheme(localStorage.getItem('theme'));
  });

  return (

    <GlobalProvider>
      { isSettingVisible ? (
        <Settings
          onFontIncrease={onFontIncrease}
          onSetting={onSetting}
          colorMode={colorMode}
          handleColorModeChange={handleColorModeChange}
          systemColor={systemColor}
          handleSystemColorChange={handleSystemColorChange}
        />
      ) : ''}

      <div
        id="page"
        onMouseUp={endDrag}
        role="button"
        tabIndex="-1"
        onMouseMove={(event) => onDrag(event)}
      >
        <div id="header">
          <Header onSetting={onSetting} />
        </div>

        <div id="leftcol">
          <LeftPanel
            fontSize={LEFT_FONT_SIZE}
            fontSizeIncrement={fontSizeIncrease}
          />
        </div>
        <div
          id="leftdragbar"
          tabIndex="-1"
          aria-label="Move left drag bar"
          onDoubleClick={collapseLeftDrag}
          onMouseDown={startLeftDrag}
          role="button"
          className="dragbar"
        >
          <div id="draghandle" className="handle" />
        </div>
        <div id="tabpages">
          <MidPanel
            fontSize={MID_FONT_SIZE}
            fontSizeIncrement={fontSizeIncrease}
          />
        </div>
        <div
          id="rightdragbar"
          tabIndex="-1"
          aria-label="Move right drag bar"
          onDoubleClick={collapseRightDrag}
          onMouseDown={startRightDrag}
          role="button"
          className="dragbar"
        >
          <div id="draghandle" className="handle" />
        </div>
        <div id="rightcol">
          <RightPanel
            fontSize={RIGHT_FONT_SIZE}
            fontSizeIncrement={fontSizeIncrease}
          />
        </div>
        <div
          id="bottomdragbar"
          tabIndex="-1"
          aria-label="Move bottom drag bar"
          onDoubleClick={collapseBottomDrag}
          onMouseDown={startBottomDrag}
          role="button"
          className="dragbar"
        >
          <div id="draghandle" className="handle" />
        </div>
        <div id="footer">
          <ControlPanel />
        </div>
      </div>
    </GlobalProvider>
  );
}


export default App;
