/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-named-as-default */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Popup from 'reactjs-popup';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import ControlButton from '../common/ControlButton';
import ProgressBar from './ProgressBar';
import useInterval from '../../context/useInterval';
import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause.svg';
import { ReactComponent as PrevIcon, ReactComponent as NextIcon } from '../../assets/icons/arrow.svg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/ControlPanel.scss';
import 'reactjs-popup/dist/index.css';
import CodeBlock from '../../markdown/code-block';
import { useUrlParams } from '../../algorithms/parameters/helpers/urlHelpers';

const muiTheme = createTheme({
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
  const [explanation, setExplanation] = useState('');

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

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

  useEffect(() => {
    let text = '# Instructions \n\n\n';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < algorithm.instructions.length; i++) {
      text = `${text}## ${algorithm.instructions[i].title}\n\n\n`;
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < algorithm.instructions[i].content.length; j++) {
        text = `${text + (j + 1)}.\t${algorithm.instructions[i].content[j]}\n\n`;
      }
    }

    setExplanation(text);
  }, [algorithm.explanation, algorithm.instructions]);

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

  // I guess it makes sense to go here.
  const stepApplied = useRef(false);
  useEffect(() => {
    if (!algorithm?.chunker || stepApplied.current) return;
    let { step } = useUrlParams();

    if (step && !isNaN(step)) {
      const maxStep = algorithm.chunker.chunks.length - 1;
      const clampedStep = Math.max(0, Math.min(parseInt(step, 10), maxStep));

      // do while <. Starts at 1 if step=0.
      if (clampedStep > 0) dispatch(GlobalActions.NEXT_LINE, { stopAt: clampedStep });
    }

    stepApplied.current = true;
  }, [algorithm?.chunker]); // When algorithm chunker changes. Make sure it only
  // runs once however, do not want step param to influence every algorithm.

  return (
    <div className="controlContainer">
      <div className="controlPanel">
        <div className="rightControl">
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
        <div className="prcessbar">
          {/* Progress Status Bar */}
          <ProgressBar
            current={currentChunk}
            max={chunkerLength}
            state={algorithm}
            dispatch={dispatch}
          />
        </div>
      </div>
      <div className="parameterPanel">
        {algorithm.param}
      </div>

      <div className="InstructionPanel">
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <a className="close" onClick={closeModal}>
              &times;
            </a>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkToc]}
              components={{ code: CodeBlock }}
            >
              {explanation}
            </ReactMarkdown>
          </div>
        </Popup>
      </div>
    </div>
  );
}

export default ControlPanel;
