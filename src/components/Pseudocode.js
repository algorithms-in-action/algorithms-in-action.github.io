/* eslint-disable linebreak-style */
import React from 'react';
import LineExplanation from './LineExplanation';
import LineNumHighLight from './LineNumHighLight';

function Pseudocode() {
  return (
    <div className="textArea-pseudocode">
      <LineNumHighLight />
      <LineExplanation />
    </div>
  );
}

export default Pseudocode;
