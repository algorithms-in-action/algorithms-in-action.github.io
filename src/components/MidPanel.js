import React from 'react';
import '../styles/MidPanel.scss';

function MidPanel() {
  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle">Binary Search Tree</div>
        <button type="button" className="quizButton">Quiz</button>
      </div>
      <div className="midPanelBody">
        {/* Animation Goes here */}
      </div>
      <div className="midPanelFooter">
        <div className="controlPanel">
          Play button, Next button
        </div>
        <div className="parameterPanel">
          ADD: []; DELETE: [];SEARCH: [];
        </div>
      </div>
    </div>
  );
}

export default MidPanel;
