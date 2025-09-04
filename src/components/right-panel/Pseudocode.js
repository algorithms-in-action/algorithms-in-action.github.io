/* eslint-disable no-prototype-builtins */
import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import BottomButton from './BottomButton';
import LineExplanation from './LineExplanation';
import { useUrlParams } from '../../algorithms/parameters/helpers/urlHelpers';

function Pseudocode({ fontSize, fontSizeIncrement }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');
  var explanation = "";

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

  // I guess it makes sense to go here
  const expandApplied = useRef(false);
  useEffect(() => {
    if (!algorithm?.chunker || expandApplied.current) return;

    let { expand } = useUrlParams();

    try {
      // expand is expected to be a JSON string from the URL
      const expandState = JSON.parse(expand);

      const algoKey = algorithm.id?.name;
      const collapseState = algorithm.collapse?.[algoKey] || {};

      // Loop over modes (insertion, search, etc.)
      Object.entries(expandState).forEach(([modeName, blocks]) => {
          // Loop over blocks inside each mode
          if (!collapseState[modeName]) return;

          Object.entries(blocks).forEach(([blockName, shouldExpand]) => {
          // ensure this block actually exists in collapse tree
          if (blockName in collapseState[modeName] && 
              typeof shouldExpand === "boolean") {
            dispatch(GlobalActions.COLLAPSE, {
              codeblockname: blockName,
              expandOrCollapase: shouldExpand,
            });
          }
        });
      });
    } catch (err) {
      console.error("Invalid expand param:", expand, err);
    }

    expandApplied.current = true; // ensure it only runs once
  }, [algorithm?.chunker]);

  return (
    show ? (
      <>
        <LineNumHighLight fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
        <div className="btnPanel">
          <BottomButton onClick={onExpand} name="Expand All" />
          <BottomButton onClick={onCollapse} name="Collapse All" />
        </div>
        { explanation ? (
        <LineExplanation explanation={explanation} fontSize={fontSize} fontSizeIncrement={fontSizeIncrement}/>
        ) : ''}
      </>
    ) : null
  );
}

export default Pseudocode;
Pseudocode.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
