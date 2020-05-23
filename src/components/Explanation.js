import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';


function Explanation() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textAreaContainer">
      <div className="textArea">
        {algorithm.text}
        this is explanation
      </div>
    </div>
  );
}

export default Explanation;
