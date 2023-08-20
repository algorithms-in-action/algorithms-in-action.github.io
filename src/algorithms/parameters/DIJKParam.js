/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const DIJK = 'Prim\'s';
const PRIMS_EXAMPLE = 'Please follow the example provided: 0,1';
const PRIMS_EXAMPLE2 = 'Please enter the symmetrical value in matrix';
function DijkstraParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="prim"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={DIJK}
        EXAMPLE={PRIMS_EXAMPLE}
        EXAMPLE2={PRIMS_EXAMPLE2}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default DijkstraParam;
