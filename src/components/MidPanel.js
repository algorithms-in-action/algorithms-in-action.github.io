import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import '../styles/MidPanel.scss';
import BSTParameter from './parameters/BSTParameter';

function MidPanel() {
  const { algorithm } = useContext(GlobalContext);
  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle">{algorithm.name}</div>
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
          <BSTParameter />
        </div>
      </div>
    </div>
  );
}

export default MidPanel;
