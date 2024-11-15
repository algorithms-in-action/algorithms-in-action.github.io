/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const PRIMS = 'Old Prim\'s';
const PRIMS_EXAMPLE = 'Please follow the example provided: 0,1';
const PRIMS_EXAMPLE2 = 'Please enter the symmetrical value in matrix';
function OldPrimsParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="primOld"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={PRIMS}
        EXAMPLE={PRIMS_EXAMPLE}
        EXAMPLE2={PRIMS_EXAMPLE2}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default OldPrimsParam;
