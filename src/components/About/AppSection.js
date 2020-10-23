import React from 'react';
import { AlgorithmNum } from '../../algorithms';

function AppSection() {
  return (
    <>
      <div className="appSection">
        <div className="innerContainer">
          <div className="title">Now Showing</div>
          <span className="bigTitle">
            {AlgorithmNum || 5}
            {' '}
            New Algorithms!
          </span>
          <div className="subtitle">
            with more coming soon.
          </div>
          <div className="dotdot" />
        </div>
      </div>


    </>
  );
}

export default AppSection;
