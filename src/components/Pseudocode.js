import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';
import findBookmark from '../pseudocode/findBookmark';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);
  // console.log(algorithm);
  return (
    <div className="textAreaContainer">
      <div className="textArea">
        At bookmark:
        {algorithm.bookmark.step}
        <br />
        Current pseudocode line:
        <br />
        <tt>{findBookmark(algorithm.pseudocode, algorithm.bookmark).code}</tt>
      </div>
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
