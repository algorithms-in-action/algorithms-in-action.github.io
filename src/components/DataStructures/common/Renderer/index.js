/* eslint-disable no-multiple-empty-lines */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-properties */
/* eslint-disable space-unary-ops */
/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React from 'react';
import styles from './Renderer.module.scss';
import Ellipsis from '../Ellipsis/index';
import { classes } from '../util';

class Renderer extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this._handleMouseDown = this.handleMouseDown;
    this._handleWheel = this.handleWheel;
    this.togglePan(false);
    this.toggleZoom(false);

    this.lastX = null;
    this.lastY = null;
    this.centerX = 0;
    this.centerY = 0;
    this.zoom = 1;
    this.zoomFactor = 1.001;
    this.zoomMax = 20;
    this.zoomMin = 1 / 200;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  togglePan(enable = !this.handleMouseDown) {
    this.handleMouseDown = enable ? this._handleMouseDown : undefined;
  }

  toggleZoom(enable = !this.handleWheel) {
    this.handleWheel = enable ? this._handleWheel : undefined;
  }

  handleMouseDown(e) {
    const { clientX, clientY } = e;
    this.lastX = clientX;
    this.lastY = clientY;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { clientX, clientY } = e;
    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;
    this.centerX -= dx;
    this.centerY -= dy;
    this.refresh();
    this.lastX = clientX;
    this.lastY = clientY;
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleWheel(e) {
    //e.preventDefault();
    const { deltaY } = e;
    this.zoom *= Math.pow(this.zoomFactor, deltaY);
    this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, this.zoom));
    this.refresh();
  }

  toString(value) {
    switch (typeof(value)) {
      case 'number':
        return [Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER, 0x7fffffff].includes(value) ? '∞' :
          [Number.NEGATIVE_INFINITY, Number.MIN_SAFE_INTEGER, -0x80000000].includes(value) ? '-∞' :
            Number.isInteger(value) ? value.toString() :
              value.toFixed(3);
      case 'boolean':
        return value ? 'T' : 'F';
      default:
        return value;
    }
  }

  refresh() {
    this.forceUpdate();
  }

  renderData() {
    return null;
  }

  render() {
    const { className, title } = this.props;
    const zoomPref = true;
    return (
      <div
        className={classes(styles.renderer, className)}
        onMouseDown={zoomPref ? this.handleMouseDown : null}
        onWheel={zoomPref ? this.handleWheel : null}
      >
        <Ellipsis className={styles.title}>{title}</Ellipsis>
        { this.renderData() }
      </div>
    );
  }
}

export default Renderer;

