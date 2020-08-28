import React from 'react';
import PropTypes from 'prop-types';


function ParamMsg({ logWarning, logTag, logMsg }) {
  const warningCol = '#DC0707';
  const successCol = '#40980B';
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
