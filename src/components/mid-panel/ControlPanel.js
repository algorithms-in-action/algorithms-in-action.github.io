/* eslint-disable no-prototype-builtins */
import React, { useContext, useState, useEffect } from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Slider, Tooltip } from '@material-ui/core';
import ControlButton from './ControlButton';
// import NextLineButton from './NextLineButton';
// import SpeedSlider from './SpeedSlider';
// import PlayButton from './PlayButton';
// import PrevLineButton from './PrevLineButton';
import { ReactComponent as PlayIcon } from '../../resources/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../resources/icons/pause.svg';
import { ReactComponent as PrevIcon, ReactComponent as NextIcon } from '../../resources/icons/arrow.svg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

import '../../styles/ControlPanel.scss';

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: '#027AFF',
      },
      track: {
        color: '#3392FF',
      },
      rail: {
        color: '#B5B5B5',
      },
      mark: {
        color: '#F7F7F7',
      },
      markActive: {
        color: '#F7F7F7',
      },
    },
  },
});

const DEFAULT_SPEED = 3;

function ControlPanel() {
  const { algorithm, dispatch } = useContext(GlobalContext);

  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(DEFAULT_SPEED);
  const [playing, setPlaying] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    // setTime(value);
  };


  useEffect(() => {
    if (algorithm.hasOwnProperty('visualisers')) {
      setDisabled(false);
    }
  }, [algorithm]);

  const prev = () => {
    console.log('prev');
    dispatch(GlobalActions.PREV_LINE);
  };

  const play = () => {
    console.log('play');
    setPlaying(true);
  };

  const pause = () => {
    console.log('pause');
    setPlaying(false);
  };

  const next = () => {
    console.log('next');
    dispatch(GlobalActions.NEXT_LINE);
  };

  return (
    <div className="container">
      <div className="controlPanel">
        {/* Speed Slider */}
        <div className="sliderContainer">
          <div className="slider">
            <ThemeProvider theme={muiTheme}>
              <Slider
                placeholder="slider"
                defaultValue={3}
                // onLoad={setTime(value)}
                value={value}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={5}
                onChange={handleSliderChange}
              />
            </ThemeProvider>
          </div>
        </div>

        <div className="controlButtons">
          {/* Prev Button */}
          <ControlButton icon={<PrevIcon />} type="prev" disabled={disabled} onClick={() => prev()} />

          {/* Play/Pause Button */}
          {playing ? (
            <ControlButton icon={<PauseIcon />} type="pause" disabled={disabled} onClick={() => pause()} />
          ) : (
            <ControlButton icon={<PlayIcon />} type="play" disabled={disabled} onClick={() => play()} />
          )}

          {/* Next Button */}
          <ControlButton icon={<NextIcon />} type="next" disabled={disabled} onClick={() => next()} />
        </div>
      </div>

      <div className="parameterPanel">
        { algorithm.param }
      </div>
    </div>
  );
}

export default ControlPanel;
