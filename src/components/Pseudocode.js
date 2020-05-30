import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';
import LineNumHighLight from './LineNumHighLight';
import findBookmark from '../pseudocode/findBookmark';

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
        <tt>{findBookmark(algorithm.pseudocode, algorithm.bookmark).code}</tt>
        <LineNumHighLight />
      </div>
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
