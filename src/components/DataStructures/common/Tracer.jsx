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
      <RendererClass key={this.key} title={this.title} data={this} />
    );
  }

  set() {
  }

  reset() {
    this.set();
  }
}

export default Tracer;
