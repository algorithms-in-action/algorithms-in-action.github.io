/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/Param.scss';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const HEAP_SORT = 'Heap Sort';
const HEAP_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function HeapsortParam() {
  const [message, setMessage] = useState(null);
  const { nodes, setNodes } = useContext(GlobalContext); // Get global nodes and setter
  const [localNodes, setLocalNodes] = useState(DEFAULT_NODES);

  useEffect(() => {
    setNodes(localNodes); // Sync with global state
  }, [localNodes, setNodes]);

  return (
    <>
      <div className="form">
        <ListParam
          name="heapSort"
          buttonName="Sort"
          mode="sort"
          formClassName="formLeft"
          DEFAULT_VAL={localNodes}
          SET_VAL={setLocalNodes}
          ALGORITHM_NAME={HEAP_SORT}
          EXAMPLE={HEAP_SORT_EXAMPLE}
          setMessage={setMessage}
        />
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default HeapsortParam;
