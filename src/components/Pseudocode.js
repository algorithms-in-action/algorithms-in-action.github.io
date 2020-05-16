import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textArea">
      PseudoCode:
      {algorithm.text}
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
