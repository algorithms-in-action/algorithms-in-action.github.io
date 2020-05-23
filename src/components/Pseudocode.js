import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import LineExplanation from './LineExplanation';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textAreaContainer">
      <div className="textArea">
        {algorithm.text}
        this is pseudocode
      </div>
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
