// eslint-disable-next-line import/no-unresolved
import Tracer from '../common/Tracer';
import MaskRenderer from './MaskRenderer/index';

class MaskTracer extends Tracer {
  getRendererClass() {
    return MaskRenderer;
  }

  init() {
    super.init();
    this.maxBits = 0;
    this.binaryData = 0;
    this.maskData = 0;
    this.highlight = [];
    this.addBase4 = false;
  }

  // XXX extract all data so we can use it for mouse click update
  // (must be a better way to hook into things...?)
  getMaskData() {
    return {binaryData:this.binaryData, maskData:this.maskData,
      maxBits:this.maxBits, highlight:this.highlight, addBase4:this.addBase4};
  }

  setAddBase4(b) {
    this.addBase4 = b;
  }

  setMaxBits(bits) {
    this.maxBits = bits;
  }

  setBinary(data) {
    this.binaryData = data;
  }

  setMask(maskDecimal, maskIndex) {
    this.maskData = maskDecimal;
    this.highlight = typeof maskIndex === "number" ? [maskIndex] : maskIndex;
  }
}

export default MaskTracer;
