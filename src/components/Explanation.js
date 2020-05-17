import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Explanation() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textArea">
      Explanation:
      {algorithm.text}
    </div>
  );
}

export default Explanation;
