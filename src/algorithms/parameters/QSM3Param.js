/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import { genRandNumList, quicksortPerfectPivotArray } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = genRandNumList(12, 1, 50);
const QUICK_SORT = 'Quick Sort Median of Three';
const QUICK_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';
const UNCHECKED = {
  random: false,
  sortedAsc: false,
  bestCase: false,
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

function QuicksortParam() {
  const [message, setMessage] = useState(null)
  const [array, setArray] = useState(DEFAULT_ARR)
  const [QSM3Case, setQSM3Case] = useState({
    random: true,
    sortedAsc: false,
    bestCase: false,
    sortedDesc: false
  });

    

  // function for choosing the type of pivot (median of three)
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'sortedAsc':
        setArray(array.sort(function(a,b) {
         return (+a) - (+b)
        }));
        break;
      case 'sortedDesc':
        setArray(array.sort(function(a,b) {
          return (+b) - (+a)
         }));
         break;
      case 'random':
        setArray(genRandNumList(12, 1, 50));
        break;
      case 'bestCase':
        setArray(quicksortPerfectPivotArray(Math.floor(Math.random() * 10), 25+(Math.floor(Math.random()*25))));
        break;
      default:
        break;
    }

    setQSM3Case({ ...UNCHECKED, [e.target.name]: true })

  }

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [QSM3Case],
  );

  return (
    <>
      <div className="form">
        <ListParam
          name="quickSortM3"
          buttonName="Sort"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          REFRESH_FUNCTION={
            (() => {
              if (QSM3Case.sortedAsc) {
                return () => {
                  return (genRandNumList(12, 1, 50).sort(function (a,b) {
                    return (+a) - (+b)
                 }));
                }
              }
              else if (QSM3Case.sortedDesc) {
                return () => {
                  return (genRandNumList(12, 1, 50).sort(function (a,b) {
                    return (+b) - (+a)
                 }));
                }
              }
              else if(QSM3Case.bestCase) {
                return () => quicksortPerfectPivotArray(Math.floor(Math.random() * 10), 25+(Math.floor(Math.random()*25)));
              }
            })()
          }
          ALGORITHM_NAME={QUICK_SORT}
          EXAMPLE={QUICK_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Choose input format: &nbsp;&nbsp;</span>
      {/* create a checkbox for Random array elements */}
      <FormControlLabel
        control={
          <BlueRadio
            checked={QSM3Case.random}
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
            checked={QSM3Case.sortedAsc}
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
            checked={QSM3Case.sortedDesc}
            onChange={handleChange}
            name="sortedDesc"
          />
        }
        label="Sorted (descending)"
        className="checkbox"
      />
      {/* create a checkbox for Median of Three */}
      <FormControlLabel
        control={
          <BlueRadio
            checked={QSM3Case.bestCase}
            onChange={handleChange}
            name="bestCase"
          />
        }
        label="Ideal"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  )
}

export default QuicksortParam
