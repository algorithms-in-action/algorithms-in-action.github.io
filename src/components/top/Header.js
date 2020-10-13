import React from 'react';
import '../../styles/Header.scss';
// import { Dropdown } from 'semantic-ui-react';
import logo from '../../assets/logo.svg';

function Header() {
  // const [fontSizing, setFontSizing] = React.useState('');
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   switch (fontSizing) {
  //     case 80:
  //       // left panel
  //       Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
  //         e.style.fontSize = '12px';
  //       });
  //       // algorithm title
  //       document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '12px';
  //       // code panel
  //       document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '12px';
  //       document.getElementsByClassName('parameterPanel')[0].style.fontSize = '12px';

  //       break;
  //     case 150:
  //       // left panel
  //       Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
  //         e.style.fontSize = '16px';
  //       });
  //       // algorithm title
  //       document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '18px';
  //       // code panel
  //       document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '18px';
  //       document.getElementsByClassName('parameterPanel')[0].style.fontSize = '18px';
  //       break;
  //     default:
  //       // left panel
  //       Array.prototype.map.call(document.getElementsByClassName('MuiList-root'), (e) => {
  //         e.style.fontSize = '12px';
  //       });
  //       // algorithm title
  //       document.getElementsByClassName('algorithmTitle')[0].style.fontSize = '14px';
  //       // code panel
  //       document.getElementsByClassName('textAreaContainer')[0].style.fontSize = '14px';
  //       document.getElementsByClassName('parameterPanel')[0].style.fontSize = '14px';
  //   }
  // }, [fontSizing]);

  /* <Dropdown text="Setting" pointing className="link item">
  <Dropdown.Menu>
    <Dropdown.Item>
      <Dropdown
        text="Text Size"
        direction="left"
      >
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setFontSizing(80)}>80%</Dropdown.Item>
          <Dropdown.Item onClick={() => setFontSizing(100)}>100%</Dropdown.Item>
          <Dropdown.Item onClick={() => setFontSizing(150)}>150%</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
*/


  return (
    <div className="header">
      <div className="headerTitle">
        <img src={logo} alt="logo" />
        <h1>Algorithms in Action</h1>
      </div>
      <div className="navButton">
        <button type="button">
          About
        </button>
        <button type="button">
          Settings
        </button>
      </div>


    </div>
  );
}

export default Header;
