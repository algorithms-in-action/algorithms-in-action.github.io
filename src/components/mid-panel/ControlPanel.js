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
let timerId;

function ControlPanel() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const { chunker } = algorithm;
  const currentChunk = chunker ? chunker.currentChunk : -1;

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

  useEffect(() => {
    setPlaying(playing);
  }, [playing]);

  const prev = () => {
    dispatch(GlobalActions.PREV_LINE);
  };

  const next = () => {
    dispatch(GlobalActions.NEXT_LINE);
  };

  const pause = () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = undefined;
      setPlaying(false);
    }
  };

  const play = () => {
    // clear any existing timer first
    pause();
    console.log(currentChunk);
    console.log(algorithm.chunker.currentChunk);
    const canPlay = chunker && chunker.isValidChunk(algorithm.chunker.currentChunk + 1);
    console.log(algorithm.finished);
    if (canPlay) {
      next();
      const interval = 4000 / (Math.E ** value);
      timerId = window.setTimeout(() => play(), interval);
      setPlaying(true);
    }
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
          <ControlButton
            icon={<PrevIcon />}
            type="prev"
            disabled={!(chunker && chunker.isValidChunk(currentChunk - 1))}
            onClick={() => prev()}
          />

          {/* Play/Pause Button */}
          {playing ? (
            <ControlButton icon={<PauseIcon />} type="pause" onClick={() => pause()} />
          ) : (
            <ControlButton icon={<PlayIcon />} type="play" disabled={disabled} onClick={() => play()} />
          )}

          {/* Next Button */}
          <ControlButton
            icon={<NextIcon />}
            type="next"
            disabled={!(chunker && chunker.isValidChunk(currentChunk + 1))}
            onClick={() => next()}
          />
        </div>
      </div>

      <div className="parameterPanel">
        { algorithm.param }
      </div>
    </div>
  );
}

export default ControlPanel;
