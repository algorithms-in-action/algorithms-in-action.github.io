/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 7;
const TRANSITIVE_CLOSURE = 'Transitive Closure';
const TRANSITIVE_CLOSURE_EXAMPLE = 'Example: 0,1';

function TransitiveClosureParam() {
  const [message, setMessage] = useState(null);
  const [size, setSize] = useState(DEFAULT_SIZE);

  return (
    <>
      <div className="matrixForm">
        {/* Size input */}
        <SingleValueParam
          name="transitiveClosure"
          buttonName="Set"
          // TODO: replace mode for Transitive Closure
          // mode="search"
          formClassName="singleInput"
          DEFAULT_VAL={DEFAULT_SIZE}
          ALGORITHM_NAME={TRANSITIVE_CLOSURE}
          EXAMPLE={TRANSITIVE_CLOSURE_EXAMPLE}
          setMessage={setMessage}
          setValue={setSize}
        />

        {/* Matrix input */}
        <MatrixParam
          size={size}
          ALGORITHM_NAME={TRANSITIVE_CLOSURE}
          EXAMPLE={TRANSITIVE_CLOSURE_EXAMPLE}
          setMessage={setMessage}
        />
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default TransitiveClosureParam;
