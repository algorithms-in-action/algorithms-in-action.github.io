/* eslint-disable no-prototype-builtins */
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import LineNumHighLight from './LineNumHighLight';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');
  return (
    show ? (
      <>
        <LineNumHighLight />
      </>
    ) : null
  );
}

export default Pseudocode;
