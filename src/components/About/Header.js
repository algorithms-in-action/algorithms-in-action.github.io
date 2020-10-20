import React from 'react';
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
        <a type="button" className="start" href="/">Start Now</a>
      </div>

    </>

  );
}

export default Header;
