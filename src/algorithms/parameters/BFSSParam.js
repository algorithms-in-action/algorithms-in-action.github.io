/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

import { URLContext } from '../../context/urlCreator';

const DEFAULT_STRING = 'dcaccdddabddac';
const DEFAULT_PATTERN = 'ddac';
const BFSS_SEARCH = 'Brute force String Search';
const BFSS_EXAMPLE = 'Enter lower case alphabetic character or space.';

function BFSSParam( { mode, string, pattern } ) {
  const [message, setMessage] = useState(null);
  const [string_, setString] = useState( string || DEFAULT_STRING );
  const [pattern_, setPattern] = useState( pattern || DEFAULT_PATTERN );
  const { setNodes, setSearchValue } = useContext(URLContext);

  useEffect(() => {
    setNodes(string_); // sync with global state
    setSearchValue(pattern_)
  }, [string_, pattern_]);

  return (
    <>
      <div className="form">
        <StringParam
          name="bruteForceStringSearch"
          buttonName="SEARCH"
          mode="search"
          formClassName="formLeft"
          DEFAULT_STRING={string_}
          DEFAULT_PATTERN={pattern_}
          SET_STRING={setString}
          SET_PATTERN={setPattern}
          ALGORITHM_NAME={BFSS_SEARCH}
          EXAMPLE={BFSS_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      {/* render success/error message */}
      <text className="message">{message}</text>
    </>
    
  );
}

// Define the prop types for URL Params
BFSSParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  string: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired
};

export default withAlgorithmParams(BFSSParam); // Export with the wrapper for URL Params



