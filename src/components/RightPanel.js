import React from 'react';
import '../styles/RightPanel.scss';
import CodeExplanation from './CodeExplanation';
import LineExplanation from './LineExplanation';

function RightPanel() {
  return (
    <div className="rightPanelContainer">
      <CodeExplanation />
      <LineExplanation />
    </div>
  );
}

export default RightPanel;
