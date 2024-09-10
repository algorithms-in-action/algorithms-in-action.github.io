/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

const DEFAULT_SIZE = 4;
const TRANSITIVE_CLOSURE = 'Transitive Closure';
const TRANSITIVE_CLOSURE_EXAMPLE = 'Please follow the example provided: 0,1';

function TransitiveClosureParam({ mode, size, min, max}) {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="transitiveClosure"
        mode="tc"
        defaultSize={size || DEFAULT_SIZE}
        min={min || 0}
        max={max || 1}
        ALGORITHM_NAME={TRANSITIVE_CLOSURE}
        EXAMPLE={TRANSITIVE_CLOSURE_EXAMPLE}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
TransitiveClosureParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
};

export default withAlgorithmParams(TransitiveClosureParam); // Export with the wrapper for URL Params


