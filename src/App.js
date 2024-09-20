/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/top/Header';
import AlgorithmMenu from './components/AlgorithmMenu';
import { ReactComponent as Circle } from './assets/icons/circle.svg';
import { ReactComponent as Direction } from './assets/icons/direction.svg';
import { GlobalProvider } from './context/GlobalState';
import RightPanel from './components/right-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';
import Settings from './components/top/Settings';
import {
  resizeWindow, startRightDrag, startBottomDrag, endDrag, onDrag, collapseBottomDrag, collapseRightDrag, addEvent,
} from './BorderResize';
import {
  setTheme,
  setAlgoTheme,
  getSystemColorMode,
  getWithExpiry,
  ALGO_THEME_KEY,
  ALGO_THEME_1,
  SYSTEM_THEME_KEY,
} from './components/top/helper';

const DEFAULT_FONT_INCREMENT = 0;
const MID_FONT_SIZE = 15;
const RIGHT_FONT_SIZE = 15;

function App() {
  useEffect(() => {
    window.addEventListener('resize', (event) => {
      resizeWindow(event);
    });
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


  const initAlgoColor = () => {
    const algoTheme = getWithExpiry(ALGO_THEME_KEY);
    if (algoTheme === null) {
      setAlgoTheme(ALGO_THEME_1);
      return ALGO_THEME_1;
    }
    return algoTheme;
  };

  const [colorMode, setColorMode] = useState(initAlgoColor());
  const handleColorModeChange = (id) => {
    setColorMode(id);
    setAlgoTheme(id);
  };


  const initSystemColor = () => {
    const theme = getWithExpiry(SYSTEM_THEME_KEY);
    if (theme === null) {
      setTheme(getSystemColorMode());
      return getSystemColorMode();
    }

    return theme;
  };

  const [systemColor, setSystemColor] = useState(initSystemColor());
  const handleSystemColorChange = (id) => {
    setSystemColor(id);
    setTheme(id);
  };

  useEffect(() => {
    setTheme(getWithExpiry(SYSTEM_THEME_KEY));
    setAlgoTheme(getWithExpiry(ALGO_THEME_KEY));
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
          <AlgorithmMenu />
          <Header onSetting={onSetting} />
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          id="tabpages"
          tabIndex="-1"
          aria-label="Move tab pages"
          onDoubleClick={collapseBottomDrag}
          onMouseDown={startBottomDrag}
          role="button"
          className="dragbar"
        >
          <div id="draghandle" className="handle bottomHandle">
            <Circle />
            <Circle />
            <Circle />
          </div>
        </div>
        <div id="rightdragbar"
          tabIndex="-1"
          aria-label="Move right drag bar"
          onDoubleClick={collapseRightDrag}
          onMouseDown={startRightDrag}
          role="button"
          className="dragbar"
        >
          <div id="draghandle" className="handle">
            <Circle />
            <Circle />
            <Circle />
          </div>
        </div>
        <div id="rightcol">
          <RightPanel
            fontSize={RIGHT_FONT_SIZE}
            fontSizeIncrement={fontSizeIncrease}
          />
        </div>
        <div id="footer">
          <ControlPanel />
        </div>
      </div>
    </GlobalProvider>
  );
}


export default App;
