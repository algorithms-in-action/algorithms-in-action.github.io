/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const BFS = 'BFS\'s';
const BFS_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const BFS_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
function BFSParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="BFS"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={BFS}
        EXAMPLE={BFS_EXAMPLE}
        EXAMPLE2={BFS_EXAMPLE2}
        setMessage={setMessage}
        unweighted
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default BFSParam;
