import React, { useContext } from 'react';
import NextLineButton from './NextLineButton';
import PlayButton from './PlayButton';
import PrevLineButton from './PrevLineButton';
import SpeedSlider from './SpeedSlider';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/ControlPanel.scss';


function ControlPanel() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="container">
      <div className="controlPanel">
        <SpeedSlider />
        <div className="controlButtons">
          <PrevLineButton />
          <PlayButton />
          <NextLineButton />
        </div>
      </div>

      <div className="parameterPanel">
        { algorithm.param }
      </div>
    </div>
  );
}

export default ControlPanel;
