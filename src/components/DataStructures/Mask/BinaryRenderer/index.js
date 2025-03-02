import React, { useCallback } from 'react';
import styles from './BinaryRenderer.module.scss';
import PropTypes from 'prop-types';

// renders integers as binary (by default), or other base, with optional
// highlighting of some digits
export const unboxedDigits = (data, maxBits, highlight, base) => {
  let binaryString = data.toString(base);
  if (binaryString.length < maxBits) {
    binaryString = binaryString.padStart(maxBits, '0');
  }
  return binaryString.split('').map((bit, index) => {
    // If index is on highlight, return a highlighted span, else just
    // return a normal span. Need to adjust the index as the string
    // starts at 0, but the 0th position is the last bit
    const adjustedIndex = binaryString.length - index - 1;
    return (
      <span key={index} className={highlight.includes(adjustedIndex) ? styles.highlighted : ""}>
        {bit}
      </span>
    );
  });
}

// As above with wrappers
const BinaryRenderer = ({id, header, data, maxBits, highlight, base = 2 }) => {
  // const binary = useCallback(() => {
  const binary = () => {
    return unboxedDigits(data, maxBits, highlight, base);
  }
  // }, [data, maxBits, highlight, base]);

  return (
    <div className={styles.container}>
      <div className={styles.outline} id={id}>
        {binary()}
      </div>
      <div className={styles.title}>
        {header}
      </div>
    </div>
  );
}

BinaryRenderer.propTypes = ({
  id: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  data: PropTypes.number.isRequired,
  maxBits: PropTypes.number,
  highlight: PropTypes.array,
  base: PropTypes.number,
});

export default BinaryRenderer;
