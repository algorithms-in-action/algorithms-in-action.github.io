import React, { useState } from 'react';
import '../../styles/Settings.scss';
// import { ReactComponent as Add } from '../../assets/icons/add.svg';
// import { ReactComponent as Minus } from '../../assets/icons/minus.svg';
import { ReactComponent as Font } from '../../assets/icons/font.svg';

const DEFAULT_FONT = 12;

function Settings() {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT);

  const onFontIncrease = () => {
    setFontSize(fontSize + 1);
  };

  const onFontDecrease = () => {
    setFontSize(fontSize - 1);
  };

  return (
    <div className="settingsContainer">
      <div className="fontSize">
        <button type="button" className="fontBtn small" onClick={onFontDecrease}>
          <Font />
        </button>
        {/* <div className="label">Font Size</div> */}
        <button type="button" className="fontBtn big" onClick={onFontIncrease}>
          <Font />
        </button>
      </div>
      <div className="algoCol">
        <button type="button" className="colorBtn blueGreen"> </button>
        <button type="button" className="colorBtn"> </button>
        <button type="button" className="colorBtn"> </button>
        <button type="button" className="colorBtn"> </button>
        <button type="button" className="colorBtn"> </button>
        <button type="button" className="colorBtn"> </button>

        <button type="button" className="colorBtn"> </button>
      </div>
    </div>
  );
}

export default Settings;
