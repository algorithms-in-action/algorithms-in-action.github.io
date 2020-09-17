/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';

// const DEFAULT_ARR = genRandNumList(10, 1, 100);
// const HEAP_SORT = 'heap Sort';
// const HEAP_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function TransitiveClosureParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <MatrixParam />

        {/* Search input */}
        <SingleValueParam
          name="binarySearchTree"
          mode="search"
          // formClassName="formRight"
          // DEFAULT_VAL={DEFAULT_TARGET}
          // ALGORITHM_NAME={SEARCH}
          // EXAMPLE={SEARCH_EXAMPLE}
          // handleSubmit={handleSearch}
          // setMessage={setMessage}
        />
      </div>

      {/* render success/error message */}
      {message}
    </>


  );
}

export default TransitiveClosureParam;
