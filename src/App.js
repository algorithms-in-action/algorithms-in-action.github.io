/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/top/Header';
import AlgorithmMenu from './components/AlgorithmMenu';
import { ReactComponent as Circle } from './assets/icons/circle.svg';
import { ReactComponent as Direction } from './assets/icons/direction.svg';
import { GlobalProvider } from './context/GlobalState';
import LeftPanel from './components/left-panel';
import RightPanel from './components/right-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';
import Settings from './components/top/Settings';
import {
  resizeWindow, startLeftDrag, startRightDrag, startBottomDrag, endDrag, onDrag, collapseLeftDrag, collapseBottomDrag, collapseRightDrag, addEvent,
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
const LEFT_FONT_SIZE = 15;
const MID_FONT_SIZE = 15;
const RIGHT_FONT_SIZE = 15;

function App() {
  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, []);

  useEffect(() => {
    const mouseOutCallback = (e) => {
      const from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName === 'HTML') {
        endDrag();
      }
    };

    document.addEventListener('mouseout', mouseOutCallback);

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
    const theme = getWithExpiry(SYSTEM_THEME_KEY);
    setTheme(theme);
    setAlgoTheme(getWithExpiry(ALGO_THEME_KEY));
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, []);

  return (
    <GlobalProvider>
      {isSettingVisible ? (
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
        <div id="header" className="header-container">
          <div className="header-left">
            <AlgorithmMenu />
          </div>
          <div className="header-right">
            <Header onSetting={onSetting} />
          </div>
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
          <div id="draghandle" className="handle">
            <Direction id="leftdraghandle" />
          </div>
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
        <div
          id="bottomdragbar"
          tabIndex="-1"
          aria-label="Move bottom drag bar"
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
        <div id="footer">
          <ControlPanel />
        </div>
      </div>
    </GlobalProvider>
  );
}

export default App;
