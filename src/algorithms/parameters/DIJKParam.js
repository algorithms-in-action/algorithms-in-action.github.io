/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const DIJK = 'Dijkstra\'s';
const DIJK_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const DIJK_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
function DijkstraParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="dijkstra"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={DIJK}
        EXAMPLE={DIJK_EXAMPLE}
        EXAMPLE2={DIJK_EXAMPLE2}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default DijkstraParam;
