/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';

import { withStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import { errorParamMsg } from './helpers/ParamMsg';
import { URLContext } from '../../context/urlState';

import SingleValueParam from './helpers/SingleValueParam';
import ListParam from './helpers/ListParam';

import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';
import { validateTextInput } from './helpers/InputValidators';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const DEFAULT_UNION = ['1-2', '3-4', '2-4', '1-5', '6-8', '3-6'];
const DEFAULT_FIND = '2';

const ALGORITHM_NAME = 'Union Find';
const FIND = 'Find';
const UNION = 'Union';

const FIND_EXAMPLE = EXAMPLES.UF_FIND;
const UNION_EXAMPLE = EXAMPLES.UF_UNION;

// button styling
const BlueRadio = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio {...props} />);

function UFParam({ mode, union, value, compress }) {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [unions, setUnions] = useState(union || DEFAULT_UNION);
  const [pathCompressionEnabled, setPathCompressionEnabled] = useState(() => {
    if (typeof compress === "string" ) {
      if (compress.toLowerCase() === "true") return true;
      if (compress.toLowerCase() === "false") return false;
    }
    return true; // default
  });

  const [localValue, setLocalValue] = useState(DEFAULT_FIND);
  const { 
    setNodes, 
    setSearchValue,  
    setCompressed
  } = useContext(URLContext);

  useEffect(() => {
    setNodes(unions);
    setSearchValue(localValue);
    setCompressed(pathCompressionEnabled);
  }, [unions, localValue, pathCompressionEnabled]);

  // toggling path compression (i.e., a boolean value)
  const handleChange = () => {
    setPathCompressionEnabled((prevState) => !prevState);
  };

  // validating input before find submission
  const handleFind = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    setLocalValue(inputValue);

    let nan = isNaN(inputValue);
    let inDomain = N_ARRAY.includes(inputValue)
    // eslint-disable-next-line no-restricted-globals
    if (!(nan || !inDomain)) {
      const target = {
        arg1: parseInt(inputValue, 10),
        arg2: pathCompressionEnabled,
      };

      const visualiser = algorithm.chunker.visualisers;
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'unionFind',
        mode: 'find',
        visualiser,
        target,
      });
      setMessage(null);
    } else {
      setMessage(errorParamMsg(nan ? ERRORS.GEN_POSITIVE_INT : ERRORS.GEN_NUMBER_NOT_IN_DOMAIN, FIND_EXAMPLE));
    }
  };

  const handleUnion = (e) => {
    e.preventDefault();

    const textInput = e.target[0].value.replace(/\s+/g, '');
    const { valid, error} = validateTextInput(textInput, N_ARRAY);
    if (valid) {
      const target = {
        arg1: textInput
          .split(',')
          .map((pair) => pair.trim().split('-').map(Number)),
        arg2: pathCompressionEnabled,
      };

      // running animation
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'unionFind',
        mode: 'union',
        target,
      });
      setMessage(null);
    } else {
      setMessage(errorParamMsg(error, UNION_EXAMPLE));
    }
  };

  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [pathCompressionEnabled]);

  return (
    <>
      <div className="form">
        <ListParam
          name="unionFind"
          buttonName="Union"
          mode="union"
          formClassName="formLeft"
          DEFAULT_VAL={unions}
          SET_VAL={setUnions}
          handleSubmit={handleUnion}
          REFRESH_FUNCTION={() => DEFAULT_UNION}
          ALGORITHM_NAME={UNION}
          EXAMPLE={UNION_EXAMPLE}
          setMessage={setMessage}
        />

        <SingleValueParam
          name="unionFind"
          buttonName="Find"
          mode="find"
          formClassName="formRight"
          DEFAULT_VAL={value || DEFAULT_FIND}
          ALGORITHM_NAME={FIND}
          EXAMPLE={FIND_EXAMPLE}
          handleSubmit={handleFind}
          setMessage={setMessage}
        />
      </div>

      <span className="generalText">Path compression: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={
          <BlueRadio
            checked={pathCompressionEnabled === true}
            onChange={handleChange}
            name="on"
          />
        }
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={pathCompressionEnabled === false}
            onChange={handleChange}
            name="off"
          />
        }
        label="Off"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
UFParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  union: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  compress: PropTypes.string,
};

export default withAlgorithmParams(UFParam); // Export with the wrapper for URL Params
