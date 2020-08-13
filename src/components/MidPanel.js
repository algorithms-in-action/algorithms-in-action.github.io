import React, { useContext } from 'react';
import { GlobalActions } from '../context/actions';
import { GlobalContext } from '../context/GlobalState';
import '../styles/MidPanel.scss';
import NextLineButton from './NextLineButton';

function MidPanel() {
  const { algorithm, dispatch } = useContext(GlobalContext);

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle">{algorithm.name}</div>
        <button type="button" className="quizButton">Quiz</button>
      </div>
      <div className="midPanelBody">
        {/* Animation Goes here */}
        {algorithm.graph.render()}
      </div>
      <div className="midPanelFooter">
        <div className="controlPanel">
          <NextLineButton />
          <button
            type="button"
            onClick={() => {
              dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'binaryTreeInsertion' });
            }}
          >
            Insertion
          </button>
        </div>
        <div className="parameterPanel">
          ADD: []; DELETE: [];SEARCH: [];
        </div>
        <div className="parameterPanel">Insert nodes: [5, 8, 10, 3, 1, 6, 9, 7, 2, 0, 4]</div>
      </div>
    </div>
  );
}


export default MidPanel;
