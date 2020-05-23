import React from 'react';
import '../styles/MidPanel.scss';

function MidPanel() {
  return (
    <div className="midPanelContainer">
      <div className="midPanelHead">
        <div className="algorithmTitle">Binary Search Tree</div>
        <button type="button" className="quizButton">Quiz</button>
      </div>
      <div className="midPanelBody">
        Animation Goes here
      </div>
      <div className="midPanelTail">
        Buttons and Parameters goes here
      </div>
    </div>
  );
}

export default MidPanel;
