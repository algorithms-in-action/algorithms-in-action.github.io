/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = "abcdefgh, efg";
const BFST_SEARCH = 'Brute force String Search';
const BFST_EXAMPLE = 'Please follow the example provided: abcd, ab';

function BFSSParam() {
  const [message, setMessage] = useState(null);
  const [array, setArray] = useState(DEFAULT_ARR);
  return (
    <>
      <div className="form">
        <StringParam
          name="bruteForceStringSearch"
          buttonName="Search"
          mode="search"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          ALGORITHM_NAME={BFST_SEARCH}
          EXAMPLE={BFST_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      {/* render success/error message */}
      {message}
    </>
  );
}

export default BFSSParam;
