/* eslint-disable no-prototype-builtins */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import LineNumHighLight from './LineNumHighLight';
import ButtonPanel from './ButtonPanel';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');

  const [isExpanded, setIsExpanded] = useState(false);

  const onExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      alert('CONDENSE');
    } else {
      alert('EXPAND');
    }
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
