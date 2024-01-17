/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const ASTAR = 'A* Algorithm';
const ASTAR_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const ASTAR_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
function ASTParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <MatrixParam
        name="aStar"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={ASTAR}
        EXAMPLE={ASTAR_EXAMPLE}
        EXAMPLE2={ASTAR_EXAMPLE2}
        setMessage={setMessage} 
        
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default ASTParam;
