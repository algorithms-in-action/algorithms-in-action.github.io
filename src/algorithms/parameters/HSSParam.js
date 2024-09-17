/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

import { GlobalContext } from '../../context/GlobalState';

// const DEFAULT_STRING = 'cddaadddabdda';
// const DEFAULT_PATTERN = 'dddac';
const DEFAULT_STRING = 'dcaccdddabddac';
const DEFAULT_PATTERN = 'ddac';
const HSS_SEARCH = 'Horspool String Search';
const HSS_EXAMPLE = 'Enter lower case alphabetic character or space.';

function HSSParam({mode, string, pattern}) {
  const [message, setMessage] = useState(null);
  const [string_, setString] = useState(string || DEFAULT_STRING);
  const [pattern_, setPattern] = useState(pattern || DEFAULT_PATTERN);
  const { setNodes, setSearchValue } = useContext(GlobalContext);

  useEffect(() => {
    setNodes(string_); // sync with global state
    setSearchValue(pattern_)
  }, [string_, pattern_, setNodes, setSearchValue]);

  return (
    <>
      <div className="form">
        <StringParam
          name="horspoolStringSearch"
          buttonName="Search"
          mode="search"
          formClassName="formLeft"
          DEFAULT_STRING={string_}
          DEFAULT_PATTERN={pattern_}
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

// Define the prop types for URL Params
HSSParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  string: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired
};

export default withAlgorithmParams(HSSParam); // Export with the wrapper for URL Params
