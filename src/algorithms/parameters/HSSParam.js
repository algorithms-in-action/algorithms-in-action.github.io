/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';

const DEFAULT_STRING = 'cddaadddabdda';
const DEFAULT_PATTERN = 'dddac';
const HSS_SEARCH = 'Horspool String Search';
const HSS_EXAMPLE = 'Enter lower case alphabetic character or space.';

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
