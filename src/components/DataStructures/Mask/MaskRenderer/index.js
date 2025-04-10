import React from 'react';
import Renderer from '../../common/Renderer';
import styles from './MaskRenderer.module.scss';
import BinaryRenderer from '../BinaryRenderer';

class MaskRenderer extends Renderer {
  constructor(props) {
    super(props)
    this.centerX = 0;
    this.centerY = 0;
    this.zoom = 100;
    this.elementRef = React.createRef();
    this.togglePan(true);
    this.toggleZoom(true);
  }

  // display key in decimal, base 4 (optional) and binary plus
  // mask in binary; some (non-decimal) digits highlighted
  renderData() {
    const { binaryData, maskData, maxBits, highlight, addBase4 } = this.props.data;
    let extra = <div/>;
    if (addBase4) {
       console.log([highlight,highlight.map((b) => Math.trunc(parseInt(b)/2))]);
        extra =
            <BinaryRenderer
              header={"Base 4"}
              emphasise={true}
              data={binaryData}
              maxBits={maxBits/2}
              highlight={highlight.map((b) => Math.trunc(parseInt(b)/2))}
              base={4}
            />
    }
    return (
      <div className={styles.container}>
        <BinaryRenderer
          header={"Decimal"}
          data={binaryData}
          highlight={[]}
          base={10}
        />
        {extra}
        <BinaryRenderer
          header={"Binary"}
          emphasise={!addBase4}
          data={binaryData}
          maxBits={maxBits}
          highlight={highlight}
        />
        <BinaryRenderer
          header={"Mask"}
          data={maskData}
          maxBits={maxBits}
          highlight={highlight}
        />
      </div>
    );
  }
}

export default MaskRenderer;
