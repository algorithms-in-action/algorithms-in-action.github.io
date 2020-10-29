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
import { closeInstructions } from '../../../components/mid-panel/helper';
import '../../../styles/Matrix.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import { ReactComponent as AddIcon } from '../../../assets/icons/add.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/minus.svg';

import ControlButton from '../../../components/common/ControlButton';


/**
 * This matrix param component can be used when
 * the param input accepts a matrix
 */
function MatrixParam({
  defaultSize,
  min,
  max,
  name,
  symmetric,
  mode,
  setMessage,
  ALGORITHM_NAME,
  EXAMPLE,
}) {
  // const [size, setSize] = useState(defaultSize);
  const [size, setSize] = useState(defaultSize);

  const columns = useMemo(
    () => makeColumnArray(size),
    [size],
  );
  const { dispatch } = useParam();
  const [data, setData] = useState(() => makeData(size, min, max, symmetric));
  const [originalData, setOriginalData] = useState(data);

  // reset the Table when the size changes
  useEffect(() => {
    const newData = makeData(size, min, max, symmetric);
    setData(newData);
    setOriginalData(newData);
  }, [size, min, max, symmetric]);

  // Reset the matrix to the inital set
  const resetData = () => {
    setMessage(null);
    setData(originalData);
  };

  const updateTableSize = (newSize) => {
    setMessage(null);
    setSize(newSize);
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
    closeInstructions(); // remove instruction
    setMessage(null);
    const matrix = getMatrix();

    if (matrix.length !== 0) {
      setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name, mode, size, matrix,
      });
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <div className="matrixContainer">
      <div className="matrixButtonContainer">
        {/* <button
          className="matrixBtn"
          disabled={size <= 2}
          onClick={() => updateTableSize(size - 1)}
        >
          -
        </button>
        <button
          className="matrixBtn"
          onClick={() => updateTableSize(size + 1)}
        >
          +
        </button> */}
        {/* <button
          className="matrixBtn"
          onClick={resetData}
        >
          Reset
        </button> */}
        <ControlButton
          icon={<MinusIcon />}
          className="greyRoundBtn"
          id="decreaseMatrix"
          onClick={() => updateTableSize(size - 1)}
        />
        <ControlButton
          icon={<AddIcon />}
          className="greyRoundBtn"
          id="increaseMatrix"
          onClick={() => updateTableSize(size + 1)}
        />
        <ControlButton
          icon={<RefreshIcon />}
          className="greyRoundBtn"
          id="refreshMatrix"
          onClick={resetData}
        />
        <button
          className="matrixBtn"
          onClick={handleSearch}
        >
          Load
        </button>
      </div>

      <div className="matrixTable">
        <Table
          columns={columns}
          data={data}
          updateData={updateData}
        />
      </div>
    </div>
  );
}

export default MatrixParam;
