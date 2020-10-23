import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/About.scss';
import logo from '../../assets/logo.svg';


function Header() {
  return (
    <>
      <div className="abHeader">
        <div className="logo">
          <img src={logo} alt="logo" />
          <h1>Algorithms in Action</h1>
        </div>

        <div className="title">
          An All New Algorithm Visualiser
        </div>
        <div className="subtitle">
          Designed by students, for students.
        </div>
        <Link className="start" to="/">Start Now</Link>
      </div>

    </>

  );
}

export default Header;
