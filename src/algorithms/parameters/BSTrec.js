/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { genRandNumList, quicksortPerfectPivotArray } from './helpers/InputBuilders';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';

import { URLContext } from '../../context/urlState';
import { EXAMPLES } from './helpers/ErrorExampleStrings';

const DEFAULT_ARRAY_GENERATOR = genRandNumList.bind(null, 12, 1, 99);
const DEFAULT_ARR = DEFAULT_ARRAY_GENERATOR();
const HEAP_SORT = 'Heap Sort';

const UNCHECKED = {
  random: false,
  sortedAsc: false,
  sortedDesc: false,
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

function MergesortParam({ list }) {
  const [message, setMessage] = useState(null);
  const [array, setArray] = useState(list || DEFAULT_ARR);
  const { setNodes } = useContext(URLContext);

  const [QSCase, setQSCase] = useState({
    random: true,
    sortedAsc: false,
    sortedDesc: false,
  });

  useEffect(() => {
    setNodes(array);
  }, [array]);

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
        setArray(
          quicksortPerfectPivotArray(
            Math.floor(Math.random() * 10),
            25 + Math.floor(Math.random() * 25),
          ),
        );
        break;
      default:
        break;
    }

    setQSCase({ ...UNCHECKED, [e.target.name]: true });
  };

  useEffect(() => {
    document.getElementById('startBtnGrp').click();
  }, [QSCase]);

  return (
    <>
      <div className="form">
        <ListParam
          name="heapSort"
          buttonName="Reset"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          REFRESH_FUNCTION={
            (() => {
              if (QSCase.sortedAsc) {
                return () =>
                  DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+a) - (+b));
              }
              if (QSCase.sortedDesc) {
                return () =>
                  DEFAULT_ARRAY_GENERATOR().sort((a, b) => (+b) - (+a));
              }
              if (QSCase.bestCase) {
                return () =>
                  quicksortPerfectPivotArray(
                    Math.floor(Math.random() * 10),
                    25 + Math.floor(Math.random() * 25),
                  );
              }
            })()
          }
          ALGORITHM_NAME={HEAP_SORT}
          EXAMPLE={EXAMPLES.GEN_LIST_PARAM}
          setMessage={setMessage}
        />
      </div>
      <span className="generalText">Choose input format: &nbsp;&nbsp;</span>
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
      {message}
    </>
  );
}

MergesortParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
};

export default withAlgorithmParams(MergesortParam);
