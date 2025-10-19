import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/About.scss';
import logo from '../../assets/logo.svg';
import { getDefaultMode } from "../../algorithms/masterList";
import { DEFAULT_ALGORITHM } from '../../context/actions';

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

        {
        /* 
          Maintainers want to use URL as source of truth for collapse plugins. Requires
          alg and mode in query params.
        */
        }
        <Link
          className="start"
          to={{
            pathname: "/animation",
            search: `?alg=${DEFAULT_ALGORITHM}&mode=${getDefaultMode(DEFAULT_ALGORITHM)}`,
          }}
        >
          Start Now
        </Link>
      </div>

    </>

  );
}

export default Header;