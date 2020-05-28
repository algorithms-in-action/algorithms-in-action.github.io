import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import findBookmark from '../pseudocode/findBookmark';

function LineExplanation() {
  const { algorithm } = useContext(GlobalContext);
  return (
    <div className="lineExplanation">
      <tt>{findBookmark(algorithm.pseudocode, algorithm.bookmark).explanation}</tt>
    </div>
  );
}

export default LineExplanation;
