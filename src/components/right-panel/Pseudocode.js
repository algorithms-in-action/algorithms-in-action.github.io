/* eslint-disable no-prototype-builtins */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import ButtonPanel from './ButtonPanel';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');

  const [isExpanded, setIsExpanded] = useState(false);

  const onExpand = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      dispatch(GlobalActions.COLLAPSE, key);
    });
    setIsExpanded(!isExpanded);
  };

  return (
    show ? (
      <>
        <LineNumHighLight fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
        <ButtonPanel isExpanded={isExpanded} onExpand={onExpand} />
      </>
    ) : null
  );
}

export default Pseudocode;
Pseudocode.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
