import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/MidPanel.scss';

function MidPanel() {
  const { algorithm } = useContext(GlobalContext);
  console.log(algorithm);

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle">{algorithm.name}</div>
        <button type="button" className="quizButton">Quiz</button>
      </div>
      <div className="midPanelBody">
        {/* Animation Goes here */}
        {algorithm.chunker && algorithm.chunker.getVisualisers().map((o) => o.render())}
      </div>
    </div>
  );
}


export default MidPanel;
