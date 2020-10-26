/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const PRIMS = 'Prim\'s';
const PRIMS_EXAMPLE = 'Example: 0,1';

function PrimsParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      <div className="matrixForm">

        {/* Matrix input */}
        <MatrixParam
          name="prim"
          mode="find"
          defaultSize={DEFAULT_SIZE}
          min={0}
          max={9}
          symmetric
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
