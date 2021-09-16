/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';

const DEFAULT_STRING = 'abcdefgh';
const DEFAULT_PATTERN = 'efg';
const HSS_SEARCH = 'Horspool String Search';
const HSS_EXAMPLE = 'Please follow the example provided: abcd, ab';

function HSSParam() {
  const [message, setMessage] = useState(null);
  const [string, setString] = useState(DEFAULT_STRING);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  return (
    <>
      <div className="form">
        <StringParam
          name="horspoolStringSearch"
          buttonName="Search"
          mode="search"
          formClassName="formLeft"
          DEFAULT_STRING={string}
          DEFAULT_PATTERN={pattern}
          SET_STRING={setString}
          SET_PATTERN={setPattern}
          ALGORITHM_NAME={HSS_SEARCH}
          EXAMPLE={HSS_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      {/* render success/error message */}
      {message}
    </>
  );
}

export default HSSParam;
