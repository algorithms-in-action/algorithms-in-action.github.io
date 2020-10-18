/* eslint-disable no-prototype-builtins */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import LineNumHighLight from './LineNumHighLight';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');
  return (
    show ? (
      <>
        <LineNumHighLight fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
      </>
    ) : null
  );
}

export default Pseudocode;
Pseudocode.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
