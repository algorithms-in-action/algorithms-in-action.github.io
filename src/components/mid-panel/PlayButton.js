/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { Tooltip } from '@material-ui/core';
import { fireEvent } from '@testing-library/react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/NextLineButton.scss';
import { ReactComponent as PlayIcon } from '../../resources/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../resources/icons/pause.svg';
import algorithms from '../../algorithms';

let speed;
// Function used to force the thread to sleep for n milliseconds.
export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function setTime(value) {
  speed = ((0.5 ** (value * 2)) * 10000);
}

function PlayButton() {
  const { dispatch, algorithm } = useContext(GlobalContext);
  const [play, setPlay] = useState(false);

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (algorithm.hasOwnProperty('visualisers')) {
      setDisabled(false);
    }
  }, [algorithm]);


  /* After button being clicked, the state of the execution is checked.
  * If the algorithm is finished, nothing happens.
  * Otherwise, it simulates the pressing of the button,
  * making it proceed to the next line.
  */

  // YUou cannot pause it
  // you can stop when algorithm is finished.
  const AutomaticExecution = () => {
    if (!algorithm.finished) {
      dispatch(GlobalActions.NEXT_LINE);
      sleep(speed).then(() => {
        fireEvent.click(document.getElementById('PlayButton'));
      });
    }
  };


  const PauseExecution = () => {
    // setPlay(false);
    // console.log('Pause');
  };

  return (
    <Tooltip title="Please run the algorithm first" disableHoverListener={!disabled}>
      <span>

        {/* <button
          type="button"
          className="btnActive play"
          id="PauseButton"
          onClick={() => PauseExecution()}
        >
          <PauseIcon />
        </button> */}

        <button
          type="button"
          className={disabled ? 'btnDisabled' : 'btnActive play'}
          id="PlayButton"
          data-testid="PlayButton"
          disabled={disabled}
          style={disabled ? { pointerEvents: 'none' } : {}}
          onClick={() => AutomaticExecution()}
        >
          <PlayIcon />
        </button>


      </span>
    </Tooltip>
  );
}

export default PlayButton;
