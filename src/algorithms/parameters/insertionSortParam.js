/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';

import { URLContext } from '../../context/urlState';

const DEFAULT_ARRAY_GENERATOR = genRandNumList.bind(null, 12, 1, 99);
const DEFAULT_ARR = DEFAULT_ARRAY_GENERATOR();

const INSERTION_SORT = 'Insertion Sort';
const INSERTION_SORT_EXAMPLE = 'Please follow the example provided: 5,2,4,6,1,3';

const UNCHECKED = { random: false, sortedAsc: false, bestCase: false, sortedDesc: false };

function nearlySortedArray(n = 12, min = 1, max = 99, swaps = 2) {
  const arr = genRandNumList(n, min, max).sort((a, b) => (+a) - (+b));
  for (let s = 0; s < swaps; s += 1) {
    const i = Math.floor(Math.random() * n);
    const j = Math.floor(Math.random() * n);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BlueRadio = withStyles({
  root: { color: '#2289ff', '&$checked': { color: '#027aff' } },
  checked: {},
})((props) => <Radio {...props} />);

function InsertionSortParam({ list }) {
  const [message, setMessage] = useState(null);
  const [array, setArray] = useState(list || DEFAULT_ARR);
  const { setNodes } = useContext(URLContext);

  const [ISCase, setISCase] = useState({
    random: true,
    sortedAsc: false,
    bestCase: false,
    sortedDesc: false,
  });

  useEffect(() => { setNodes(array); }, [array, setNodes]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'sortedAsc':
        setArray([...array].sort((a, b) => (+a) - (+b)));
        break;
      case 'sortedDesc':
        setArray([...array].sort((a, b) => (+b) - (+a)));
        break;
      case 'random':
        setArray(DEFAULT_ARRAY_GENERATOR());
        break;
      case 'bestCase':
        setArray(nearlySortedArray(Math.floor(Math.random() * 8) + 10, 1, 99, 1 + Math.floor(Math.random() * 2)));
        break;
      default:
        break;
    }
    setISCase({ ...UNCHECKED, [e.target.name]: true });
  };

  useEffect(() => {
    const btn = document.getElementById('startBtnGrp');
    if (btn) btn.click();
  }, [ISCase]);

  return (
    <>
      <div className="form">
        <ListParam
          name="insertionSort"
          buttonName="Reset"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          REFRESH_FUNCTION={(() => {
            if (ISCase.sortedAsc) return () => DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+a) - (+b));
            if (ISCase.sortedDesc) return () => DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+b) - (+a));
            if (ISCase.bestCase)  return () => nearlySortedArray(Math.floor(Math.random() * 8) + 10, 1, 99, 1 + Math.floor(Math.random() * 2));
            return () => DEFAULT_ARRAY_GENERATOR(); // random
          })()}
          ALGORITHM_NAME={INSERTION_SORT}
          EXAMPLE={INSERTION_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>

      <span className="generalText">Choose input format: &nbsp;&nbsp;</span>

      <FormControlLabel control={<BlueRadio checked={ISCase.random}    onChange={handleChange} name="random" />}    label="Random"              className="checkbox" />
      <FormControlLabel control={<BlueRadio checked={ISCase.sortedAsc} onChange={handleChange} name="sortedAsc" />} label="Sorted (ascending)"  className="checkbox" />
      <FormControlLabel control={<BlueRadio checked={ISCase.sortedDesc}onChange={handleChange} name="sortedDesc" />}label="Sorted (descending)" className="checkbox" />
      <FormControlLabel control={<BlueRadio checked={ISCase.bestCase}  onChange={handleChange} name="bestCase" />}  label="Ideal (nearly sorted)" className="checkbox" />

      {message}
    </>
  );
}

InsertionSortParam.propTypes = {
  alg: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
};

export default withAlgorithmParams(InsertionSortParam);
