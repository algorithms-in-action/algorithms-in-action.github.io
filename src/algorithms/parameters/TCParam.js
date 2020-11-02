/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 4;
const TRANSITIVE_CLOSURE = 'Transitive Closure';
const TRANSITIVE_CLOSURE_EXAMPLE = 'Please follow the example provided: 0,1';

function TransitiveClosureParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="transitiveClosure"
        mode="tc"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={1}
        ALGORITHM_NAME={TRANSITIVE_CLOSURE}
        EXAMPLE={TRANSITIVE_CLOSURE_EXAMPLE}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default TransitiveClosureParam;
