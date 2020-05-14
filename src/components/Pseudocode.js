import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Pseudocode() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textArea">
      PseudoCode:
      {algorithm.text}
    </div>
  );
}

export default Pseudocode;
