import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';
import '../styles/NextLineButton.scss';

function PlayButton() {
  const { dispatch, algorithm } = useContext(GlobalContext);

  const AutomaticExecution = () => {
    const interval = setInterval(() => {
      if (!algorithm.finished) {
        dispatch(GlobalActions.NEXT_LINE);
      }
    }, 100);
    return () => clearInterval(interval);
  };

  return (
    <button
      type="button"
      className="nextLineButton"
      onClick={() => AutomaticExecution()}
    >
      Play
    </button>
  );
}

export default PlayButton;
