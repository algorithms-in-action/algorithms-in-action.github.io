import React, { useContext } from 'react';
import ReactMarkDown from 'react-markdown';
import { GlobalContext } from '../context/GlobalState';

function Explanation() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textArea">
      <ReactMarkDown source={algorithm.text} />
    </div>
  );
}

export default Explanation;
