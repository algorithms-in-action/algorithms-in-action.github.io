/* eslint-disable no-prototype-builtins */
import React, { useContext, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Slider } from '@material-ui/core';
import ControlButton from './ControlButton';
import useInterval from '../../context/useInterval';
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
  const { chunker } = algorithm;
  const currentChunk = chunker ? chunker.currentChunk : -1;

  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [playing, setPlaying] = useState(false);

  const prev = () => {
    dispatch(GlobalActions.PREV_LINE);
  };

  const next = () => {
    dispatch(GlobalActions.NEXT_LINE);
  };

  const pause = () => {
    setPlaying(false);
  };

  // needs to check if there any chunks left first
  const play = () => {
    const canPlay = chunker && chunker.isValidChunk(currentChunk + 1);
    if (canPlay) {
      next();
      setPlaying(true);
    } else {
      pause();
    }
  };

  /**
   * when click play button, calling play() based on the slider speed.
   * Using useInterval, play() now can read fresh states, otherwise play() will
   * stuck in the closure when this component first mount.
   * (e.g. currentChunk will always be 1)
   * @param {function} callback function that will be called in each interval
   * @param {number} delay millisecond delay between next call
   */
  useInterval(() => {
    play();
  }, playing ? 10000 / (Math.E ** speed) : null);

  const handleSliderChange = (event, newSpeed) => {
    setSpeed(newSpeed);
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
                value={speed}
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
            <ControlButton
              icon={<PlayIcon />}
              type="play"
              disabled={!(chunker && chunker.isValidChunk(currentChunk + 1))}
              onClick={() => play()}
            />
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
