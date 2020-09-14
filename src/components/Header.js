import React, { useEffect } from 'react';
import '../styles/Header.scss';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import logo from '../resources/logo.svg';


function Header() {
  const [fontSizing, setFontSizing] = React.useState('');
  const handleChange = (event) => {
    setFontSizing(event.target.value);
  };
  useEffect(() => {
    // Update the document title using the browser API
    switch (fontSizing) {
      case 80:
        // left panel
        Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
          e.style.fontSize = '12px';
        });
        // algorithm title
        document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '12px';
        // code panel
        document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '12px';
        document.getElementsByClassName('parameterPanel')[0].style.fontSize = '12px';

        break;
      case 150:
        // left panel
        Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
          e.style.fontSize = '16px';
        });
        // algorithm title
        document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '18px';
        // code panel
        document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '18px';
        document.getElementsByClassName('parameterPanel')[0].style.fontSize = '18px';
        break;
      default:
        // left panel
        Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
          e.style.fontSize = '12px';
        });
        // algorithm title
        document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '14px';
        // code panel
        document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '14px';
        document.getElementsByClassName('parameterPanel')[0].style.fontSize = '14px';
    }
  });

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
              value={fontSizing}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="">Text Size</MenuItem>
              <MenuItem value={80}>80%</MenuItem>
              <MenuItem value={100}>100%</MenuItem>
              <MenuItem value={150}>150%</MenuItem>
            </Select>
          </FormControl>
        </button>
      </div>
    </div>
  );
}

export default Header;
