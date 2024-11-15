// Adapted from Quicksort - could rename a few things

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { genRandNumList, quicksortPerfectPivotArray } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

import { URLContext } from '../../context/urlState';


const DEFAULT_ARRAY_GENERATOR = genRandNumList.bind(null, 12, 1, 50);
const DEFAULT_ARR = DEFAULT_ARRAY_GENERATOR();
const MERGE_SORT = 'Merge Sort';
const MERGE_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';
const UNCHECKED = {
  random: false,
  sortedAsc: false,
  // bestCase: false,
  sortedDesc: false
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
})((props) => <Radio {...props} />)

function MergesortParam({ list }) {
  const [message, setMessage] = useState(null)

  const [array, setArray] = useState(list || DEFAULT_ARR)
  const { setNodes } = useContext(URLContext)

  const [QSCase, setQSCase] = useState({
    random: true,
    sortedAsc: false,
    // bestCase: false,
    sortedDesc: false
  });

  useEffect(() => {
    setNodes(array);
  }, [array]);

  // XXX best case definitely not needed; could skip choice of cases
  // function for choosing the type of input
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'sortedAsc':
        setArray([...array].sort(function (a, b) {
          return (+a) - (+b)
        }));
        break;
      case 'sortedDesc':
        setArray([...array].sort(function (a, b) {
          return (+b) - (+a)
        }));
        break;
      case 'random':
        setArray(DEFAULT_ARRAY_GENERATOR());
        break;
      case 'bestCase':
        setArray(quicksortPerfectPivotArray(Math.floor(Math.random() * 10), 25 + (Math.floor(Math.random() * 25))));
        break;
      default:
        break;
    }

    setQSCase({ ...UNCHECKED, [e.target.name]: true })

  }

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [QSCase],
  );

  return (
    <>
      <div className="form">
        <ListParam
          name="msort_arr_td"
          buttonName="Reset"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          REFRESH_FUNCTION={
            (() => {
              if (QSCase.sortedAsc) {
                return () => {
                  return (DEFAULT_ARRAY_GENERATOR().sort(function (a, b) {
                    return (+a) - (+b)
                  }));
                }
              }
              else if (QSCase.sortedDesc) {
                return () => {
                  return (DEFAULT_ARRAY_GENERATOR().sort(function (a, b) {
                    return (+b) - (+a)
                  }));
                }
              }
              else if (QSCase.bestCase) {
                return () => quicksortPerfectPivotArray(Math.floor(Math.random() * 10), 25 + (Math.floor(Math.random() * 25)));
              }
            })()
          }
          ALGORITHM_NAME={MERGE_SORT}
          EXAMPLE={MERGE_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Choose input format: &nbsp;&nbsp;</span>
      {/* create a checkbox for Random array elements */}
      <FormControlLabel
        control={
          <BlueRadio
            checked={QSCase.random}
            onChange={handleChange}
            name="random"
          />
        }
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={QSCase.sortedAsc}
            onChange={handleChange}
            name="sortedAsc"
          />
        }
        label="Sorted (ascending)"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={QSCase.sortedDesc}
            onChange={handleChange}
            name="sortedDesc"
          />
        }
        label="Sorted (descending)"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  )
}

// Define the prop types for URL Params
MergesortParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired
};

export default withAlgorithmParams(MergesortParam); // Export with the wrapper for URL Params
