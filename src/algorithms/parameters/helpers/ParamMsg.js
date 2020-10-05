import React from 'react';
import PropTypes from 'prop-types';


function ParamMsg({ logWarning, logTag, logMsg }) {
  const warningCol = '#FB3640';
  const successCol = '#52AA5E';
  return (
    <div className="logContainer">
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
