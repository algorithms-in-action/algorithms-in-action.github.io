import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';
import { findBookmarkInProcedure } from '../pseudocode/utils';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textAreaContainer">
      <div className="textArea">
        At bookmark:
        {algorithm.bookmark}
        <br />
        Current pseudocode line:
        <br />
        <tt>{findBookmarkInProcedure(algorithm.pseudocode, algorithm.bookmark).code}</tt>
      </div>
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
