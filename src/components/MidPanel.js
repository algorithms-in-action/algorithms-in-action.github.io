import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import '../styles/MidPanel.scss';
import NextLineButton from './NextLineButton';
import * as Param from './parameters';

function MidPanel() {
  const { algorithm } = useContext(GlobalContext);

  const RenderParamComponent = (id) => {
    let component;

    switch (id) {
      case 'binarySearchTree':
        component = <Param.BSTParam />;
        break;
      case 'quicksort':
        component = <Param.QuicksortParam />;
        break;
      case 'heapsort':
        component = <Param.HeapsortParam />;
        break;
      case 'transitiveClosure':
        component = <Param.TransitiveClosureParam />;
        break;
      case 'kmp':
        component = <Param.KMPParam />;
        break;
      default:
        break;
    }

    return component;
  };

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
          <NextLineButton />
        </div>
        <div className="parameterPanel">
          { RenderParamComponent(algorithm.id) }
        </div>
      </div>
    </div>
  );
}

export default MidPanel;
