/* eslint-disable no-prototype-builtins */
import React, { useContext, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Slider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ControlButton from '../common/ControlButton';
import ProgressBar from './ProgressBar';
import useInterval from '../../context/useInterval';
import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause.svg';
import { ReactComponent as PrevIcon, ReactComponent as NextIcon } from '../../assets/icons/arrow.svg';
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

const DEFAULT_SPEED = 50;

function ControlPanel() {
  // eslint-disable-next-line
  const { algorithm, dispatch } = useContext(GlobalContext);
  const { chunker } = algorithm;
  const currentChunk = chunker ? chunker.currentChunk : -1;
  const chunkerLength = chunker ? chunker.chunks.length : -1;

  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [playing, setPlaying] = useState(false);

  const prev = (isPlaying = false) => {
    dispatch(GlobalActions.PREV_LINE, isPlaying);
  };

  const next = (isPlaying = false) => {
    dispatch(GlobalActions.NEXT_LINE, isPlaying);
  };

  const pause = () => {
    dispatch(GlobalActions.TOGGLE_PLAY, false);
    setPlaying(false);
  };

  // needs to check if there any chunks left first
  const play = () => {
    const canPlay = chunker && chunker.isValidChunk(currentChunk + 1);
    if (canPlay) {
      // dispatch(GlobalActions.TOGGLE_PLAY, true);
      // I could have used this to update the global state that the animation is playing,
      // however this means we will call two dispatches (TOGGLE_PLAY and NEXT_LINE) in a
      // very short interval, but setState() updates asynchronously, so state does not change
      // as expected.
      next(true);
      setPlaying(true);
    } else {
      pause();
    }
  };

  const handleClickPlay = () => {
    play();
    if (algorithm.name === 'Quicksort') {
      // setQuicksortPlay(true)
      sessionStorage.setItem('quicksortPlay', true);
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
  }, playing ? 2000 - (19 * speed) : null);
  const handleSliderChange = (event, newSpeed) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="controlContainer">
      <div className="controlPanel">
        {/* Speed Slider */}
        <div className="speed">
          <div className="innerSpeed">
            {/* Label the speed slider as SPEED */}
            SPEED
          </div>
        </div>
        <div className="sliderContainer">
          <div className="slider">
            <ThemeProvider theme={muiTheme}>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Slider
                    value={speed}
                    onChange={handleSliderChange}
                    aria-labelledby="continuous-slider"
                  />
                </Grid>
              </Grid>
            </ThemeProvider>
          </div>
        </div>
        <div className="rightControl">
          {/* Progress Status Bar */}
          <ProgressBar
            current={currentChunk}
            max={chunkerLength}
          />
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
                onClick={handleClickPlay}
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
      </div>
      <div className="parameterPanel">
        {algorithm.param}
      </div>
    </div>
  );
}

export default ControlPanel;
