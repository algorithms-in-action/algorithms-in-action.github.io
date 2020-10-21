/* eslint-disable no-prototype-builtins */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import ButtonPanel from './ButtonPanel';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');


  const onExpand = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      dispatch(GlobalActions.COLLAPSE, key);
    });
  };

  return (
    show ? (
      <>
        <LineNumHighLight fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
        <ButtonPanel onExpand={onExpand} />
      </>
    ) : null
  );
}

export default Pseudocode;
Pseudocode.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
