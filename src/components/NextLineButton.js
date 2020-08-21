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
    if (Object.keys(algorithm.tree).length) {
      setDisabled(false);
    }
  }, [algorithm.tree]);

  return (
    <Tooltip title="Please insert nodes first" disableHoverListener={!disabled}>
      <span>
        <button
          type="button"
          className="nextLineButton"
          disabled={disabled}
          style={disabled ? { pointerEvents: 'none' } : {}}
          onClick={() => dispatch(GlobalActions.NEXT_LINE)}
        >
          Next Line
        </button>
      </span>
    </Tooltip>
  );
}

export default NextLineButton;
