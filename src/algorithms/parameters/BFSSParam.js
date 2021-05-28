/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';

const DEFAULT_STRING = 'abcdefgh';
const DEFAULT_PATTERN = 'efg';
const BFSS_SEARCH = 'Brute force String Search';
const BFSS_EXAMPLE = 'Please follow the example provided: abcd, ab';

function BFSSParam() {
  const [message, setMessage] = useState(null);
  const [string, setString] = useState(DEFAULT_STRING);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  return (
    <>
      <div className="form">
        <StringParam
          name="bruteForceStringSearch"
          buttonName="Search"
          mode="search"
          formClassName="formLeft"
          DEFAULT_STRING={string}
          DEFAULT_PATTERN={pattern}
          SET_STRING={setString}
          SET_PATTERN={setPattern}
          ALGORITHM_NAME={BFSS_SEARCH}
          EXAMPLE={BFSS_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      {/* render success/error message */}
      {message}
    </>
  );
}

export default BFSSParam;
