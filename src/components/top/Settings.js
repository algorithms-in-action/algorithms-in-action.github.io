import React, { useState } from 'react';
import '../../styles/Settings.scss';
// import { ReactComponent as Add } from '../../assets/icons/add.svg';
// import { ReactComponent as Minus } from '../../assets/icons/minus.svg';
import { ReactComponent as Font } from '../../assets/icons/font.svg';

const DEFAULT_FONT = 12;
const DEFAULT_COL = 0;

function Settings() {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT);
  const allColBtn = [
    {
      primary: 'black',
      secondary: 'white',
    },
    {
      primary: 'green',
      secondary: 'blue',
    },
    {
      primary: 'yellow',
      secondary: 'red',
    },
    {
      primary: 'green',
      secondary: 'blue',
    },
  ];
  const [currColBtn, setCurrColBtn] = useState(DEFAULT_COL);


  const onFontIncrease = () => {
    setFontSize(fontSize + 1);
  };

  const onFontDecrease = () => {
    setFontSize(fontSize - 1);
  };

  const onColorClick = (id) => {
    const num = parseInt(id, 10);
    setCurrColBtn(num);
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
        {
          allColBtn.map(({ primary, secondary }, index) => (
            <button id={index} type="button" className={currColBtn === index ? 'colorBtn active' : 'colorBtn'} onClick={(e) => { onColorClick(e.target.id); }}>
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
