/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/top/Header';
import { ReactComponent as Circle } from './assets/icons/circle.svg';
import { GlobalProvider } from './context/GlobalState';
import RightPanel from './components/right-panel';
import MidPanel from './components/mid-panel';
import ControlPanel from './components/mid-panel/ControlPanel';
import Settings from './components/top/Settings';
import {
  setTheme,
  setAlgoTheme,
  getSystemColorMode,
  getWithExpiry,
  ALGO_THEME_KEY,
  ALGO_THEME_1,
  SYSTEM_THEME_KEY,
} from './components/top/helper';
// eslint-disable-next-line import/no-unresolved
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const DEFAULT_FONT_INCREMENT = 0;
const MID_FONT_SIZE = 15;
const RIGHT_FONT_SIZE = 15;

function App() {
  const [isSettingVisible, setSettingVisible] = useState(false);
  const onSetting = () => setSettingVisible(!isSettingVisible);

  const [fontSizeIncrease, setFontSizeIncrease] = useState(DEFAULT_FONT_INCREMENT);
  const onFontIncrease = (val) => setFontSizeIncrease(fontSizeIncrease + val);

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
      {isSettingVisible && (
        <Settings
          onFontIncrease={onFontIncrease}
          onSetting={onSetting}
          colorMode={colorMode}
          handleColorModeChange={handleColorModeChange}
          systemColor={systemColor}
          handleSystemColorChange={handleSystemColorChange}
        />
      )}

      <PanelGroup direction="vertical" style={{ height: '100vh', width: '100vw' }}>
        
        <Header onSetting={onSetting}/>

        <PanelGroup direction="horizontal">
          <Panel>
            <PanelGroup direction="vertical">

              <Panel defaultSize={70}>
                <MidPanel fontSize={MID_FONT_SIZE} fontSizeIncrement={fontSizeIncrease} />
              </Panel>

              <PanelResizeHandle className="resizer"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--system-handle-bg-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'var(--system-handle-bg)')
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.background = 'var(--system-handle-bg-active)')
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.background = 'var(--system-handle-hover-bg)')
                }
                style={{
                  background: 'var(--system-handle-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  height: '8px',
                  cursor: 'row-resize',
                }}
              >
                <Circle />
                <Circle />
                <Circle />
              </PanelResizeHandle>

              <Panel defaultSize={30} style={{backgroundColor: "var(--mid-control-bg)"}}>
                <ControlPanel />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="resizer"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--system-handle-bg-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'var(--system-handle-bg)')
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.background = 'var(--system-handle-bg-active)')
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.background = 'var(--system-handle-hover-bg)')
            }
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: '8px',
              cursor: 'col-resize',
              background: 'var(--system-handle-bg)',
            }}
          >
            <Circle />
            <Circle />
            <Circle />
          </PanelResizeHandle>

          <Panel defaultSize={35}>
            <RightPanel fontSize={RIGHT_FONT_SIZE} fontSizeIncrement={fontSizeIncrease} />
          </Panel>
        </PanelGroup>
      </PanelGroup>
    </GlobalProvider>
  );
}

export default App;
