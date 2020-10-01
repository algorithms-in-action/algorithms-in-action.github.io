/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { GlobalActions } from '../../../context/actions';
import Table from './Table';
import {
  makeColumnArray,
  makeData,
  singleNumberValidCheck,
  errorParamMsg,
  successParamMsg,
} from './ParamHelper';

import useParam from '../../../context/useParam';

/**
 * This matrix param component can be used when
 * the param input accepts a matrix
 */
function MatrixParam({
  size,
  name,
  mode,
  setMessage,
  ALGORITHM_NAME,
  EXAMPLE,
}) {
  const columns = useMemo(
    () => makeColumnArray(size),
    [size],
  );
  const { dispatch } = useParam();
  const [data, setData] = useState(() => makeData(size));
  const [originalData, setOriginalData] = useState(data);

  // reset the Table when the size changes
  useEffect(() => {
    const newData = makeData(size);
    setData(newData);
    setOriginalData(newData);
  }, [size]);

  // Reset the matrix to the inital set
  const resetData = () => {
    setMessage(null);
    setData(originalData);
  };

  // When cell renderer calls updateData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateData = (rowIndex, columnId, value) => {
    setData((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  // Get and parse the matrix
  const getMatrix = () => {
    const matrix = [];
    data.forEach((row) => {
      const temp = [];
      for (const [_, value] of Object.entries(row)) {
        if (singleNumberValidCheck(value)) {
          const num = parseInt(value, 10);
          temp.push(num);
        } else {
          // when the input cannot be converted to a number
          setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
          return;
        }
      }
      matrix.push(temp);
    });

    if (matrix.length !== size || matrix[0].length !== size) return [];

    return matrix;
  };

  // Run the animation
  const handleSearch = () => {
    setMessage(null);
    const matrix = getMatrix();

    if (matrix.length !== 0) {
      setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'prim', mode: 'find', size, matrix,
      });
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <div>
      <button onClick={resetData}>Reset Data</button>
      <button onClick={handleSearch}>Run</button>
      <Table
        columns={columns}
        data={data}
        updateData={updateData}
      />
    </div>
  );
}

export default MatrixParam;
