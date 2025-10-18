import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/*
  File contains the component to be filled in the message
  container of components, it can represent a success
  or error message, see bottom of file for those helper
  wrapper components.
*/

function ParamMsg({ logWarning, logTag, logMsg }) {
  const warningCol = '#FB3640';
  const successCol = '#52AA5E';

  // Scroll logContainer into view
  const ref = useRef(null);

  // Every render scroll into view.
  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  });

  return (
    <div 
      className="logContainer"
      ref={(el) => {
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      }}
    >
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

// Not used currently.
export const successParamMsg = (type) => (
  <ParamMsg
    logWarning={false}
    logTag=""
    logMsg=""
  />
);

/**
 *
 * @param {string} example optional provided
 * @param {string} reason optional provided, if not provide, use default value
 */
export const errorParamMsg = (
  reason,
  example,
) => (
  <ParamMsg
    logWarning
    logTag="Oops..."
    logMsg={`${reason}${example ? `\n${example}` : ''}`}
  />
);