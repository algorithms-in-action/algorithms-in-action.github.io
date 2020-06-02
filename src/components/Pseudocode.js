import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';
import LineNumHighLight from './LineNumHighLight';
import findBookmark from '../pseudocode/findBookmark';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);
  return (
    <div className="textAreaContainer">
      <LineNumHighLight />
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
