/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const PRIMS = 'Prim\'s';
const PRIMS_EXAMPLE = 'Example: 0,1';

function PrimsParam() {
  const [message, setMessage] = useState(null);
  const [size, setSize] = useState(DEFAULT_SIZE);

  return (
    <>
      <div className="matrixForm">
        {/* Size input */}
        <SingleValueParam
          name="prim"
          buttonName="Set"
          // TODO: replace mode for Prim's
          // mode="search"
          formClassName="singleInput"
          DEFAULT_VAL={DEFAULT_SIZE}
          ALGORITHM_NAME={PRIMS}
          EXAMPLE={PRIMS_EXAMPLE}
          setMessage={setMessage}
          setValue={setSize}
        />

        {/* Matrix input */}
        <MatrixParam
          size={size}
          ALGORITHM_NAME={PRIMS}
          EXAMPLE={PRIMS_EXAMPLE}
          setMessage={setMessage}
        />
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default PrimsParam;
