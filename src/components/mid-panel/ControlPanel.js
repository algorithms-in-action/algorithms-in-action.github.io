import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
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
        {/* <Typography id="discrete-slider" heigth={25}>
          Speed
        </Typography> */}
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
