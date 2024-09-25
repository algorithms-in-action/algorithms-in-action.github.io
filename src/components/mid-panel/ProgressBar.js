import React from 'react';
import PropTypes from 'prop-types';
import { GlobalActions } from '../../context/actions';
import '../../styles/ProgressBar.scss';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.lastX = null;

    this.max;
    this.current;
    this.viewable;
    this.next;
    this.prev;

    this.inner;
  }

  handleMouseDown(e) {
    this.handleMouseMove(e);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    e.preventDefault();
    let chunkNum;
    let searchRadius = 10;
    let rect = this.inner.getBoundingClientRect();
    let width = rect.right - rect.left;

    let x = e.clientX - rect.left;
    if (x <= 0) {
      chunkNum = 0;

    } else if (x >= width) {
      chunkNum = this.max - 1;

    } else {
      x = Math.round((x / width) * this.max);
      if (x === this.current) {
        return;
      }

      // search for the closest viewable chunk in a certain radius
      for (let i = 0; i <= searchRadius; i++) {
        if (i === 0) {
          if (this.viewable[x]) {
            chunkNum = x;
            break;
          }
          continue;
        }

        if (this.viewable[x + i]) {
          chunkNum = x + i;
          break;
        }

        if (this.viewable[x - i]) {
          chunkNum = x - i;
          break;
        }
      }
    }

    if (this.viewable[chunkNum]) {
      if (chunkNum > this.current) {
        this.next({stopAt: chunkNum, playing: false});
      }
      if (chunkNum < this.current && chunkNum !== this.max - 1) {
        this.prev({stopAt: chunkNum, playing: false});
      }
    }
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  refresh() {
    this.forceUpdate();
  }

  render() {
    const { current, max, state, dispatch } = this.props;
    const node = {
      rectPrimary: document.querySelector('.mux-lpi-rect--primary'),
      buffer: document.querySelector('.mux-lpi-buffer'),
      inner: document.querySelector('.mux-lpi-inner'),
      thumb: document.querySelector('.progressThumb'),
    };
    this.inner = node.inner;

    this.max = max;
    this.current = current;
    this.viewable = (state.chunker !== undefined) ?
      state.chunker.viewable :
      null;

    this.prev = (playing) => {
      dispatch(GlobalActions.PREV_LINE, playing);
    };

    this.next = (playing) => {
      dispatch(GlobalActions.NEXT_LINE, playing);
    };

    function setTransform(ref, value) {
      if (ref !== null) {
        const { style } = ref;
        style.transform = value;
        style.WebkitTransform = value;
        style.MozTransform = value;
        style.OTransform = value;
        style.MSTransform = value;
      }
    }

    const setProgress = (ref, val) => {
      setTransform(ref, `scaleX(${val})`);
    }

    function setBuffer(ref, val) {
      setTransform(ref, `scaleX(${val})`);
    }

    const setThumb = (thumb, value) => {
      if (thumb !== null) {
        const { style } = thumb;
        let x = 0;

        if (this !== undefined) {
          x = value * this.inner.offsetWidth;
        }
        let transform = `translateX(${x}px)`;

        style.transform = transform;
        style.WebkitTransform = transform;
        style.MozTransform = transform;
        style.OTransform = transform;
        style.MSTransform = transform;
      }
    }

    setProgress(node.rectPrimary, parseFloat(current / max, 10));
    setBuffer(node.buffer, 1);
    setThumb(node.thumb, parseFloat(current / max, 10));


    return (
        <div
          role="progressbar"
          className="mux-lpi"
          tabIndex={0}
          onMouseDown={this.handleMouseDown}
        >
          <div className="mux-lpi-padding" />
          <div className="mux-lpi-inner">
            <div className="progressLable" id="progressLabel">
              <div className="innerText">
                {
                  // if the user enters a valid input and clicks on LOAD
                  // the progress bar displays the percentage of progress
                  // convert the lines of code to percentge by multiplying the division by 100
                  `Progress: ${Math.round((current / max) * 100, 2)} %`
                  // if the user does not enter a valid input, initialise the progress bar as not loaded
                }
              </div>
            </div>
            <div className="progressThumb">
              <div className="innerThumb" />
            </div>
            <div className="mux-lpi-buffer" />
            <div className="mux-lpi-rect mux-lpi-rect--primary">
              <span className="mux-lpi-rect-inner" />
            </div>
          </div>
        </div>
    );
  }
}

export default ProgressBar;
ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
