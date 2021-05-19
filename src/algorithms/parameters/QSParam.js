/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { genRandNumList } from './helpers/ParamHelper';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = genRandNumList(8, 1, 99);
const QUICK_SORT = 'Quick Sort';
const QUICK_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

const BlueCheckbox = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox {...props} />);

function QuicksortParam() {
  const [message, setMessage] = useState(null);
  const [array, setArray] = useState(DEFAULT_ARR);
  return (
    <>
      <div className="form">
        <ListParam
          name="quickSort"
          buttonName="Sort"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={array}
          SET_VAL={setArray}
          ALGORITHM_NAME={QUICK_SORT}
          EXAMPLE={QUICK_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>
      Choose pivot using : &nbsp;&nbsp;
      {/* create a checkbox for Rightmost */}
      <FormControlLabel
        control={(
          <BlueCheckbox
            name="rightmost"
            className="checkbox"
            checked
          />
        )}
        label="Rightmost"
      />
      {/* create a checkbox for Median of Three */}
      <FormControlLabel
        control={(
          <BlueCheckbox
            name="medianofthree"
            className="checkbox"
          />
        )}
        label="Median of Three"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

export default QuicksortParam;
