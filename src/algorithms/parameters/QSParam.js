/* eslint-disable no-unused-vars */
import React from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = genRandNumList(10, 1, 100);
const QUICK_SORT = 'quick Sort';
const QUICK_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function QuicksortParam() {
  return (
    <ListParam
      name="quickSort"
      mode="sort"
      DEFAULT_ARR={DEFAULT_ARR}
      ALGORITHM_NAME={QUICK_SORT}
      EXAMPLE={QUICK_SORT_EXAMPLE}
    />
  );
}

export default QuicksortParam;
