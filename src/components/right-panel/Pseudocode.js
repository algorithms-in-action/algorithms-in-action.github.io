/* eslint-disable no-prototype-builtins */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import BottomButton from './BottomButton';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');

  const onExpand = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      dispatch(GlobalActions.COLLAPSE, { codeblockname: key, expandOrCollapase: true });
    });
  };

  const onCollapse = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      if (key !== 'Main') {
        dispatch(GlobalActions.COLLAPSE, { codeblockname: key, expandOrCollapase: false });
      }
    });
  };

  return (
    show ? (
      <>
        <LineNumHighLight fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
        <div className="btnPanel">
          <BottomButton onClick={onExpand} name="Expand All" />
          <BottomButton onClick={onCollapse} name="Collapse All" />
        </div>
      </>
    ) : null
  );
}

export default Pseudocode;
Pseudocode.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
