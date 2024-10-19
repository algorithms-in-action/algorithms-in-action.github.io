/* eslint-disable class-methods-use-this */
import React from 'react';
import Renderer from './Renderer/index';

class Tracer {
  constructor(key, getObject, title, options) {
    this.key = key;
    this.getObject = getObject;
    this.title = title;
    if (options !== undefined) {
      this.arrayItemMagnitudes = options.arrayItemMagnitudes;
      this.largestValue = options.largestValue;
      this.size = options.size;
    }
    this.init();
    this.reset();
  }

  getRendererClass() {
    return Renderer;
  }

  init() {
  }

  render() {
    const RendererClass = this.getRendererClass();
    return (
      <RendererClass
        key={this.key}
        title={this.title}
        data={this}
        size={this.size}
      />
    );
  }

  set() {
  }

  // set visualiser size multiplier
  setSize(size) {
    this.size = size;
  }

  /**
   * Change the zoom of the visualizer
   * @param {*} zoom the new zoom
   */
  setZoom(zoom) {
    this.newZoom = zoom;
    window.setTimeout(() => {this.newZoom = undefined}, 200)
  }

  reset() {
    this.set();
  }
}

export default Tracer;
