/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const DFS = 'DFS\'s';
const DFS_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const DFS_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
function DFSParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="DFS"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={DFS}
        EXAMPLE={DFS_EXAMPLE}
        EXAMPLE2={DFS_EXAMPLE2}
        setMessage={setMessage} 
        unweighted
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default DFSParam;
