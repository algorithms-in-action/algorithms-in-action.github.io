/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_ARR = genRandNumList(10, 1, 100);
const HEAP_SORT = 'heap Sort';
const HEAP_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function HeapsortParam() {
  return (
    <ListParam
      name="heapSort"
      mode="sort"
      DEFAULT_ARR={DEFAULT_ARR}
      ALGORITHM_NAME={HEAP_SORT}
      EXAMPLE={HEAP_SORT_EXAMPLE}
    />
  );
}

export default HeapsortParam;
