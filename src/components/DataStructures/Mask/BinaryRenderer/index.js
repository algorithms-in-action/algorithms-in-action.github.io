import React, { useCallback } from 'react';
import styles from './BinaryRenderer.module.scss';
import PropTypes from 'prop-types';

// renders integers as binary (by default), or other base, with optional
// highlighting of some digits
const BinaryRenderer = ({ header, data, maxBits, highlight, base = 2,
emphasise = false, compact = false, groupSize = 0 }) => {
  const binary = useCallback(() => {
    let binaryString = data.toString(base);
    if (binaryString.length < maxBits) {
      binaryString = binaryString.padStart(maxBits, '0');
    }
    const digits = binaryString.split('').map((bit, index) => {
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
    if (!groupSize) return digits;
    return Array.from({ length: Math.ceil(digits.length / groupSize) }, (_, index) => (
      <span className={styles.digitGroup} key={index}>
        {digits.slice(index * groupSize, (index + 1) * groupSize)}
      </span>
    ));
  }, [data, maxBits, highlight, base, groupSize]);

  let titleStyle;
  if (emphasise)
    titleStyle = styles.emphTitle;
  else
    titleStyle = styles.title;
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <div className={`${styles.outline} ${groupSize ? styles.grouped : ''}`}>
        {binary()}
      </div>
      <div className={titleStyle}>
        {header}
      </div>
    </div>
  );
}

BinaryRenderer.propTypes = ({
  header: PropTypes.string.isRequired,
  data: PropTypes.number.isRequired,
  maxBits: PropTypes.number,
  highlight: PropTypes.array,
  base: PropTypes.number,
  emphasise: PropTypes.boolean,
  compact: PropTypes.bool,
  groupSize: PropTypes.number,
});

export default BinaryRenderer;
