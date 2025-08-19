import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function ParamMsg({ logWarning, logTag, logMsg }) {
  const warningCol = '#FB3640';
  const successCol = '#52AA5E';

  // Scroll logContainer into view
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [logTag, logMsg]); // Only when logMsg changes or appears for the first time.
  // logTag added as well for future iterations if we have logTag changing but not logMsg.

  return (
    <div ref={ref} className="logContainer">
      <span
        className="logTag"
        data-testid="logTag"
        style={logWarning ? { color: warningCol } : { color: successCol }}
      >
        { logTag }
      </span>
      <span className="logText">{ logMsg }</span>
    </div>
  );
}

ParamMsg.propTypes = ({
  logWarning: PropTypes.bool.isRequired,
  logTag: PropTypes.string.isRequired,
  logMsg: PropTypes.string.isRequired,
});

export default ParamMsg;
