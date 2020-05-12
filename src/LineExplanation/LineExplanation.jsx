import React from 'react';
import './LineExplanation.css';
import { lineTest } from '../pseudocodes.json';

function LineExplanation() {
  return (
    <div className="LineExplanation">
      <textarea className="LineExplanation-Title" value="Line Explanation" rows="1" />
      <textarea className="LineExplanation-TextArea" value={lineTest} rows="3" />
    </div>
  );
}

export default LineExplanation;
