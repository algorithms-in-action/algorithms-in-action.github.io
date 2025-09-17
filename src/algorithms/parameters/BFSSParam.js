/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import StringParam from './helpers/StringParam';
import '../../styles/Param.scss';
import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';

import { URLContext } from '../../context/urlState';
import { EXAMPLES } from './helpers/ErrorExampleStrings';

const DEFAULT_STRING = 'dcaccdddabddac';
const DEFAULT_PATTERN = 'ddac';
const BFSS_SEARCH = 'Brute Force String Search';

function BFSSParam({ mode, string, pattern }) {
  const [message, setMessage] = useState(null);
  const [string_, setString] = useState(string || DEFAULT_STRING);
  const [pattern_, setPattern] = useState(pattern || DEFAULT_PATTERN);
  const { setNodes, setSearchValue } = useContext(URLContext);

  useEffect(() => {
    setNodes(string_);
    setSearchValue(pattern_);
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
          EXAMPLE={EXAMPLES.GEN_ONLY_LOWERCASE}
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
  pattern: PropTypes.string.isRequired,
};

export default withAlgorithmParams(BFSSParam);
