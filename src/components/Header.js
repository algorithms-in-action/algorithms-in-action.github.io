/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../styles/Header.scss';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import logo from '../assets/logo.svg';

let a = 0;

function mode() {
  return a;
}

function Header() {
  const [modeType, setModeType] = React.useState('');
  const history = useHistory();

  const handleChange = (event) => {
    setModeType(event.target.value);
  };

  // goes back to main page
  const handleLogoClick = () => {
    history.push('/');
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
      <div className="headerTitle" role="button" onClick={handleLogoClick}>
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
        <button type="button">
          <Link to="/about">About</Link>
        </button>
      </div>
    </div>
  );
}

export default Header;
export {
  mode,
};
