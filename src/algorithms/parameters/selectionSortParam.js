/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { genRandNumList } from './helpers/InputBuilders';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';
import { URLContext } from '../../context/urlState';

const DEFAULT_ARRAY_GENERATOR = genRandNumList.bind(null, 12, 1, 99);
const DEFAULT_ARR = DEFAULT_ARRAY_GENERATOR();

const SELECTION_SORT = 'Selection Sort';
const SELECTION_SORT_EXAMPLE = 'Example: 5,3,8,1,2';

const UNCHECKED = {
  random: false,
  sortedAsc: false,
  nearlySorted: false,
  sortedDesc: false,
};

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
  root: {
    color: '#2289ff',
    '&$checked': { color: '#027aff' },
  },
  checked: {},
})((props) => <Radio {...props} />);

function SelectionSortParam({ list }) {
  const [message, setMessage] = useState(null);
  const [array, setArray] = useState(list || DEFAULT_ARR);
  const { setNodes } = useContext(URLContext);

  const [selCase, setSelCase] = useState({
    random: true,
    sortedAsc: false,
    nearlySorted: false,
    sortedDesc: false,
  });

  useEffect(() => { setNodes(array); }, [array, setNodes]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'sortedAsc': {
        const arrAsc = [...array].sort((a, b) => (+a) - (+b));
        setArray(arrAsc);
        break;
      }
      case 'sortedDesc': {
        const arrDesc = [...array].sort((a, b) => (+b) - (+a));
        setArray(arrDesc);
        break;
      }
      case 'nearlySorted': {
        const arrNearly = nearlySortedArray(
            Math.floor(Math.random() * 8) + 10,
            1,
            99,
            1 + Math.floor(Math.random() * 2)
        );
        setArray(arrNearly);
        break;
      }
      case 'random':
      default: {
        const arrRand = DEFAULT_ARRAY_GENERATOR();
        setArray(arrRand);
        break;
      }
    }
    setSelCase({ ...UNCHECKED, [e.target.name]: true });
  };

  useEffect(() => {
    const btn = document.getElementById('startBtnGrp');
    if (btn) btn.click();
  }, [selCase]);

  return (
      <>
        <div className="form">
          <ListParam
              name="selectionSort"
              buttonName="Reset"
              mode="sort"
              formClassName="formLeft"
              DEFAULT_VAL={array}
              SET_VAL={setArray}
              REFRESH_FUNCTION={(() => {
                if (selCase.sortedAsc)
                  return () => DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+a) - (+b));
                if (selCase.sortedDesc)
                  return () => DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+b) - (+a));
                if (selCase.nearlySorted)
                  return () =>
                      nearlySortedArray(
                          Math.floor(Math.random() * 8) + 10,
                          1,
                          99,
                          1 + Math.floor(Math.random() * 2)
                      );
                return () => DEFAULT_ARRAY_GENERATOR(); // random
              })()}
              ALGORITHM_NAME={SELECTION_SORT}
              EXAMPLE={SELECTION_SORT_EXAMPLE}
              setMessage={setMessage}
          />
        </div>

        <span className="generalText">Choose input format: &nbsp;&nbsp;</span>

        <FormControlLabel
            control={<BlueRadio checked={selCase.random} onChange={handleChange} name="random" />}
            label="Random"
            className="checkbox"
        />
        <FormControlLabel
            control={<BlueRadio checked={selCase.sortedAsc} onChange={handleChange} name="sortedAsc" />}
            label="Sorted (ascending)"
            className="checkbox"
        />
        <FormControlLabel
            control={<BlueRadio checked={selCase.sortedDesc} onChange={handleChange} name="sortedDesc" />}
            label="Sorted (descending)"
            className="checkbox"
        />
        <FormControlLabel
            control={<BlueRadio checked={selCase.nearlySorted} onChange={handleChange} name="nearlySorted" />}
            label="Ideal (nearly sorted)"
            className="checkbox"
        />

        {message}
      </>
  );
}

SelectionSortParam.propTypes = {
  alg: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
};

export default withAlgorithmParams(SelectionSortParam);
