/* eslint-disable import/no-mutable-exports */
import React from 'react';
import '../../styles/Settings.scss';
import PropTypes from 'prop-types';
import { ReactComponent as Font } from '../../assets/icons/font.svg';
import {
  allColBtn, allSystemCol,
} from './helper';
// import Checkbox from './Checkbox';

const DEFAULT_COL = 0;

const mode = () => DEFAULT_COL;

function Settings({
  onFontIncrease,
  onSetting,
  colorMode,
  handleColorModeChange,
  systemColor,
  handleSystemColorChange,
}) {
  return (
    <div className="settingsContainer">
      <div className="setContainer">
        <div className="label">Font Size</div>
        <div className="fontSize">
          <button type="button" className="fontBtn small" onClick={() => { onFontIncrease(-1); }}>
            <Font />
          </button>
          <button type="button" className="fontBtn big" onClick={() => { onFontIncrease(1); }}>
            <Font />
          </button>
        </div>
      </div>
      <div className="setContainer">
        <div className="label">Data Structures</div>
        <div className="algoCol">
          {
          allColBtn.map(({ primary, secondary, id }) => (
            <button key={id} id={id} type="button" className={colorMode === id ? 'colorBtn active' : 'colorBtn'} onClick={(e) => handleColorModeChange(e.target.id)}>
              <span id={id} className={`left ${primary}`}> </span>
              <span id={id} className={`right ${secondary}`}> </span>
            </button>
          ))
        }
        </div>
      </div>
      <div className="setContainer">
        <div className="label">System</div>
        <div className="algoCol">
          {
          allSystemCol.map(({ primary, secondary, id }) => (
            <button key={id} id={id} type="button" className={systemColor === id ? 'colorBtn active' : 'colorBtn'} onClick={(e) => handleSystemColorChange(e.target.id)}>
              <span id={id} className={`left ${primary}`}> </span>
              <span id={id} className={`right ${secondary}`}> </span>
            </button>
          ))
        }
        </div>
      </div>
      {/* <div className="setContainer">
        <div className="label">Zoom Preference</div>
        <Checkbox />
      </div> */}
      <div className="settingFooter">
        <button className="saveBtn" type="button" onClick={onSetting}>Return</button>
      </div>
    </div>
  );
}

export default Settings;
export {
  mode,
};

Settings.propTypes = {
  onFontIncrease: PropTypes.func.isRequired,
  onSetting: PropTypes.func.isRequired,
  colorMode: PropTypes.string.isRequired,
  handleColorModeChange: PropTypes.func.isRequired,
  systemColor: PropTypes.string.isRequired,
  handleSystemColorChange: PropTypes.func.isRequired,
};
