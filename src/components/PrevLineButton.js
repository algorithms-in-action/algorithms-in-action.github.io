/* eslint-disable no-prototype-builtins */
// eslint-disable-next-line import/named
import React, { useContext, useState, useEffect } from 'react';
import { Tooltip } from '@material-ui/core';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';
import '../styles/NextLineButton.scss';


function NextLineButton() {
  const { algorithm, dispatch } = useContext(GlobalContext);

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (algorithm.hasOwnProperty('visualisers')) {
      setDisabled(false);
    }
  }, [algorithm]);

  return (
    <Tooltip title="Please run the algorithm first" disableHoverListener={!disabled}>
      <span>
        <button
          type="button"
          className="nextLineButton"
          disabled={disabled}
          style={disabled ? { pointerEvents: 'none' } : {}}
          onClick={() => dispatch(GlobalActions.PREV_LINE)}
        >
          Prev Line
        </button>
      </span>
    </Tooltip>
  );
}

export default NextLineButton;
