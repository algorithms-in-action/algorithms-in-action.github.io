/* eslint-disable no-prototype-builtins */
// eslint-disable-next-line import/named
import React, { useContext, useState, useEffect } from 'react';
import { Tooltip } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/NextLineButton.scss';
import { ReactComponent as PrevIcon } from '../../resources/icons/arrow.svg';


function NextLineButton() {
  const { algorithm, dispatch } = useContext(GlobalContext);

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (algorithm.hasOwnProperty('visualisers')) {
      setDisabled(false);
    }
  }, [algorithm]);

  return (
  // <Tooltip title="Please run the algorithm first" disableHoverListener={!disabled}>
    <span>
      <button
        type="button"
        className={disabled ? 'btnDisabled prev' : 'btnActive prev'}
        disabled={disabled}
        style={disabled ? { pointerEvents: 'none' } : {}}
        onClick={() => dispatch(GlobalActions.PREV_LINE)}
      >
        <PrevIcon />
      </button>
    </span>
  // </Tooltip>
  );
}

export default NextLineButton;
