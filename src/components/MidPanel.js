import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import '../styles/MidPanel.scss';
import NextLineButton from './NextLineButton';
import PrevLineButton from './PrevLineButton';

function MidPanel() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle">{algorithm.name}</div>
        <button type="button" className="quizButton">Quiz</button>
      </div>
      <div className="midPanelBody">
        {algorithm.chunker.getVisualisers()[0].render()}
      </div>
      <div className="midPanelFooter">
        <div className="controlPanel">
          <NextLineButton />
          <PrevLineButton />
        </div>
        <div className="parameterPanel">
          ADD: []; DELETE: [];SEARCH: [];
        </div>
      </div>
    </div>
  );
}


export default MidPanel;
