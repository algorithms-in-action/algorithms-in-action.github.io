import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Header.scss';
import logo from '../../assets/logo.svg';


function Header({ onSetting }) {
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
