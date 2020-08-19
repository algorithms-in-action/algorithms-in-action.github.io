import React, { useContext } from 'react';
import { fireEvent } from '@testing-library/react';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';
import '../styles/NextLineButton.scss';

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function PlayButton() {
  const { dispatch, algorithm } = useContext(GlobalContext);

  const AutomaticExecution = () => {
    if (!algorithm.finished) {
      dispatch(GlobalActions.NEXT_LINE);
    }
    sleep(100).then(() => {
      fireEvent.click(document.getElementById('PlayButton'));
    });
  };

  return (
    <button
      type="button"
      className="nextLineButton"
      id="PlayButton"
      onClick={() => AutomaticExecution()}
    >
      Play
    </button>
  );
}

export default PlayButton;
