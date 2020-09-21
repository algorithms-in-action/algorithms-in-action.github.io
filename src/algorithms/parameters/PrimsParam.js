/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import SingleValueParam from './helpers/SingleValueParam';
import {
  singleNumberValidCheck,
  successParamMsg,
  errorParamMsg,
} from './helpers/ParamHelper';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const PRIMS = 'Prim\'s';
const PRIMS_EXAMPLE = 'Example: 0,1';

function PrimsParam() {
  const [message, setMessage] = useState(null);
  const [size, setSize] = useState(DEFAULT_SIZE);

  /**
   * For Prim's, since the first param is just to set the matrix's size, we don't want
   * to dispatch an algorithm only using the size, we need to implement a new handle
   * function instead of using the default one.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);
      setSize(target);
      setMessage(successParamMsg(PRIMS));
    } else {
      // when the input cannot be converted to a number
      setMessage(errorParamMsg(PRIMS, PRIMS_EXAMPLE));
    }
  };

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
          handleSubmit={handleSubmit}
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
