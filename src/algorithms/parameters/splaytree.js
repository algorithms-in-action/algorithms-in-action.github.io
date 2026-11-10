// minimal mods from BST - could change some names XXX
// XXX radio button behaviour could still be improved
/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { GlobalContext } from '../../context/GlobalState';
import { URLContext } from '../../context/urlState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';

import { singleNumberValidCheck } from './helpers/InputValidators';
import { 
  genUniqueRandSearchList,
  genUniqueRandNumList,
  balanceBSTArray,
  shuffleArray,
  sortAndInterleaveSearches,
  balancedAndInterleaveSearches
} from './helpers/InputBuilders';

import { errorParamMsg } from './helpers/ParamMsg';

import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers';

import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';
import SymbolListParam from './helpers/SymbolListParam';
import { reorderSplayInput } from './helpers/treeInput';

const DEFAULT_NODES = genUniqueRandSearchList(12, 1, 100);
//const DEFAULT_TARGET = '2';

const OPERATIONS = 'operations';
//const INSERTION = 'insertion';
//const SEARCH = 'search';

/** NOTE: Balanced functionality temporarily removed until clarification is
 * received on how to handle it with the new symbol list input.
 */
const UNCHECKED = {
  random: false,
  sorted: false,
  //balanced: false,
};

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

/** NOTE: Mode and Value removed as component now only requires 
 * combined list input to run insertion, search and deletion.
 */
function SplayTreeParam({list}) {
  //const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setlocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes } = useContext(URLContext);
  const [bstCase, setBSTCase] = useState(UNCHECKED);
  //const [localValue, setLocalValue] = useState(DEFAULT_TARGET);

  useEffect(() => {
    setNodes(localNodes);
    //setSearchValue(localValue);
    setBSTCase(UNCHECKED); // uncheck when nodes/values change
  }, [localNodes, setNodes]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'random':
        setlocalNodes(reorderSplayInput(localNodes, shuffleArray));
        break;
      case 'sorted':
        setlocalNodes(reorderSplayInput(localNodes, sortAndInterleaveSearches));
        break;
      case 'balanced':
        setlocalNodes(reorderSplayInput(localNodes, balancedAndInterleaveSearches));
        break;
      default:
    }

    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
  };

  /**
   * Custom search handler for Splay Tree — checks tree is not empty first.
   */
  
  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [bstCase]);

  return (
    <>
      <div className="form">
        {/* Symbol List input */}
        <SymbolListParam
          name = "splaytree"

          buttonName = "Insert, Search & Delete"

          allowDelete

          mode = "operations"

          formClassName = "formLeft"
          DEFAULT_VAL = {localNodes}
          SET_VAL = {setlocalNodes}

          REFRESH_FUNCTION = {() => genUniqueRandSearchList(12, 1, 100)}

          ALGORITHM_NAME = {OPERATIONS}

          setMessage = {setMessage}
        />
      </div>
      <p className="generalText">Use ?4 to search for 4 and !4 to delete 4. Use !-4 to delete negative four.</p>
      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.random}
            onChange={handleChange}
            name="random"
          />
        )}
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.sorted}
            onChange={handleChange}
            name="sorted"
          />
        )}
        label="Sorted"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.balanced}
            onChange={handleChange}
            name="balanced"
          />
        )}
        label="Balanced"
        className="checkbox"
      />
      
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
SplayTreeParam.propTypes = {
  list: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
};

SplayTreeParam.defaultProps = {
  list: null
};

export default withAlgorithmParams(SplayTreeParam);
