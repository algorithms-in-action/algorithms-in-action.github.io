import React, { useContext } from 'react';
// eslint-disable-next-line import/named
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';

function NextLineButton() {
  const { dispatch } = useContext(GlobalContext);

  return (
    <button
      type="button"
      className="nextLineButton"
      onClick={() => dispatch(GlobalActions.NEXT_LINE)}
    >
      Next Line
    </button>
  );
}

export default NextLineButton;
