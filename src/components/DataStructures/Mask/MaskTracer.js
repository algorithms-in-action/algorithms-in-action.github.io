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
