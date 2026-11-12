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
import SymbolListParam from './helpers/SymbolListParam';
import '../../styles/Param.scss';
import { binaryOperationListValidCheck } from './helpers/InputValidators';
import {
  genUniqueRandSearchList,
  shuffleArray,
  sortAndInterleaveSearches,
  balancedAndInterleaveSearches,
} from './helpers/InputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';

import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';

// e.g. 85,1,88,?67,67: a key is inserted, ?key searches for it
const DEFAULT_NODES = genUniqueRandSearchList(10, 1, 100);
const EXAMPLE = '5,7,?5,2';
const OPERATIONS = 'operations';

const UNCHECKED = {
  random: false,
  sorted: false,
  balanced: false,
};

const BlueRadio = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
})((props) => <Radio {...props} />);

function BSTParam({ list }) {
  const { dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [localNodes, setlocalNodes] = useState(list || DEFAULT_NODES);
  const { setNodes } = useContext(URLContext);
  const [bstCase, setBSTCase] = useState(UNCHECKED);

  useEffect(() => {
    setNodes(localNodes);
    setBSTCase(UNCHECKED);
  }, [localNodes, setNodes]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'random':
        setlocalNodes(shuffleArray(localNodes));
        break;
      case 'sorted':
        setlocalNodes(sortAndInterleaveSearches(localNodes));
        break;
      case 'balanced':
        setlocalNodes(balancedAndInterleaveSearches(localNodes));
        break;
      default:
    }
    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    const { valid, error, operations } = binaryOperationListValidCheck(inputValue);
    if (valid) {
      dispatch(GlobalActions.RUN_ALGORITHM, { name: 'dst', mode: OPERATIONS, operations });
      setMessage(null);
    } else {
      setMessage(errorParamMsg(error, EXAMPLE));
    }
  };

  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [bstCase]);

  return (
    <>
      <div className="form">
        <SymbolListParam
          name="dst"
          buttonName="Insert & Search"
          mode={OPERATIONS}
          formClassName="formLeft"
          DEFAULT_VAL={localNodes}
          SET_VAL={setlocalNodes}
          REFRESH_FUNCTION={() => genUniqueRandSearchList(10, 1, 100)}
          ALGORITHM_NAME={OPERATIONS}
          handleSubmit={handleSubmit}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={<BlueRadio checked={bstCase.random} onChange={handleChange} name="random" />}
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={<BlueRadio checked={bstCase.sorted} onChange={handleChange} name="sorted" />}
        label="Sorted"
        className="checkbox"
      />
      <FormControlLabel
        control={<BlueRadio checked={bstCase.balanced} onChange={handleChange} name="balanced" />}
        label="Balanced"
        className="checkbox"
      />
      {message}
    </>
  );
}

BSTParam.propTypes = {
  list: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

BSTParam.defaultProps = {
  list: null,
};

export default withAlgorithmParams(BSTParam);
