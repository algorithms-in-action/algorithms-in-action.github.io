import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/AppReducer';

function NextLineButton() {
  const { dispatch } = useContext(GlobalContext);

  return (
    <button
      type="button"
      className="nextLineButton"
      onClick={() => dispatch({ type: GlobalActions.NEXT_LINE })}
    >
      Next Line
    </button>
  );
}

export default NextLineButton;
