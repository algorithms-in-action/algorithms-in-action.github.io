/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = genRandNumList(8, 1, 99);
const QUICK_SORT = 'Quick Sort';
const QUICK_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

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
      {/* render success/error message */}
      {message}
    </>
  );
}

export default QuicksortParam;
