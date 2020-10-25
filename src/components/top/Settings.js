/* eslint-disable import/no-mutable-exports */
import React, { useState } from 'react';
import '../../styles/Settings.scss';
// import { ReactComponent as Add } from '../../assets/icons/add.svg';
// import { ReactComponent as Minus } from '../../assets/icons/minus.svg';
import PropTypes from 'prop-types';
import { ReactComponent as Font } from '../../assets/icons/font.svg';
// import { increaseFontSize } from './helper';

const DEFAULT_COL = 0;

let mode = () => DEFAULT_COL;

function Settings({
  onFontIncrease, onSetting, handleColorModeChange, selectedMode,
}) {
  const allColBtn = [
    {
      id: 0,
      primary: 'black',
      secondary: 'white',
    },
    {
      id: 1,
      primary: 'green',
      secondary: 'pink',
    },
    {
      id: 2,
      primary: 'cyan',
      secondary: 'red',
    },
  ];
  const [currColBtn, setCurrColBtn] = useState(selectedMode);

  const onColorClick = (id) => {
    const num = parseInt(id, 10);
    mode = () => num;
    setCurrColBtn(num);
    onSetting();
    handleColorModeChange(Number(id));
  };

  return (
    <div className="settingsContainer">
      <div className="fontSize">
        <button type="button" className="fontBtn small" onClick={() => { onFontIncrease(-1); }}>
          <Font />
        </button>
        <button type="button" className="fontBtn big" onClick={() => { onFontIncrease(1); }}>
          <Font />
        </button>
      </div>
      <div className="algoCol">
        {
          allColBtn.map(({ primary, secondary, id }, index) => (
            <button key={id} id={index} type="button" className={currColBtn === index ? 'colorBtn active' : 'colorBtn'} onClick={(e) => onColorClick(e.target.id)}>
              <span id={index} className={`left ${primary}`}> </span>
              <span id={index} className={`right ${secondary}`}> </span>
            </button>
          ))
        }
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
  handleColorModeChange: PropTypes.func.isRequired,
  selectedMode: PropTypes.number.isRequired,
};
