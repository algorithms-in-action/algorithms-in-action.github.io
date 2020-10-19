import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/Header.scss';
import logo from '../../assets/logo.svg';

function Header({ onSetting }) {
  const history = useHistory();

  // goes back to main page
  const handleLogoClick = () => {
    history.push('/');
  };

  // goes to about page
  const handleAboutClick = () => {
    history.push('/about');
  };


  return (
    <div className="header">
      <button className="headerTitle" type="button" onClick={handleLogoClick}>
        <img src={logo} alt="logo" />
        <h1>Algorithms in Action</h1>
      </button>

      <div className="navButton">
        <button type="button" onClick={handleAboutClick}>
          About
        </button>
        <button type="button" onClick={onSetting}>
          Settings
        </button>
      </div>
    </div>
  );
}

export default Header;

Header.propTypes = {
  onSetting: PropTypes.func.isRequired,
};
