import React from 'react';
import LineExplanation from './LineExplanation';
import LineNumHighLight from './LineNumHighLight';

function Pseudocode() {
  return (
    <div className="textAreaContainer">
      <LineNumHighLight />
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
