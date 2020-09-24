import React from 'react';
import '../styles/Header.scss';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import logo from '../resources/logo.svg';

let a = 0;

function mode() {
  return a;
}

function Header() {
  const [modeType, setModeType] = React.useState('');
  const handleChange = (event) => {
    setModeType(event.target.value);
  };

  switch (modeType) {
    case 'green':
      a = 1;
      break;
    case 'blue':
      a = 2;
      break;
    default:
      a = 0;
  }

  return (
    <div className="header">
      <div className="headerTitle">
        <img src={logo} alt="logo" />
        <h1>Algorithms in Action</h1>
      </div>
      <div className="navButton">
        <button type="button">
          Contribute
        </button>
        <button type="button">
          Settings
        </button>
        <button type="button">
          <FormControl>
            <Select
              value={modeType}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="">ColorMode</MenuItem>
              <MenuItem value="green">Green and Red</MenuItem>
              <MenuItem value="blue">Blue</MenuItem>
            </Select>
          </FormControl>
        </button>
      </div>
    </div>
  );
}

export default Header;
export {
  mode,
};
