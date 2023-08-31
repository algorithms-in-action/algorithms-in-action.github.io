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
  successParamMsg, matrixValidCheck,
} from './ParamHelper';

import useParam from '../../../context/useParam';
import { closeInstructions } from '../../../components/mid-panel/helper';
import '../../../styles/Matrix.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import { ReactComponent as AddIcon } from '../../../assets/icons/add.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/minus.svg';

import ControlButton from '../../../components/common/ControlButton';

// SIM Mouse click
const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element) {
  // eslint-disable-next-line max-len
  mouseClickEvents.forEach((mouseEventType) => element.dispatchEvent(new MouseEvent(mouseEventType, {
    view: window, bubbles: true, cancelable: true, buttons: 1,
  })));
}

/**
 * This matrix param component can be used when
 * the param input accepts a matrix
 */
function PrimsMatrixParam({
  defaultSize,
  min,
  max,
  name,
  symmetric,
  mode,
  setMessage,
  ALGORITHM_NAME,
  EXAMPLE,
  EXAMPLE2,
}) {
  // const [size, setSize] = useState(defaultSize);
  const [size, setSize] = useState(defaultSize);

  // (size) affects number of columns.
  const columns1 = useMemo(() => makeColumnArray(2), [size]);
  const columns2 = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();
  const [data1, setData1] = useState(() => makeData(size, min, max, symmetric));
  const [originalData1, setOriginalData1] = useState(data1);

  // Second Table
  const [data2, setData2] = useState(() => makeData(size, min, max, symmetric));
  const [originalData2, setOriginalData2] = useState(data2);

  const [buttonMessage, setButtonMessage] = useState('Start');

  // reset the Table when the size changes
  useEffect(() => {
    const newData1 = makeData(size, min, max, symmetric);
    setData1(newData1);
    setOriginalData1(newData1);
  }, [size, min, max, symmetric]);

  // second table
  useEffect(() => {
    const newData2 = makeData(size, min, max, symmetric);
    setData2(newData2);
    setOriginalData2(newData2);
  }, [size, min, max, symmetric]);

  useEffect(() => {
    const element = document.querySelector('button[id="startBtnGrp"]');
    simulateMouseClick(element);
  }, []);

  // Reset the matrix to the inital set
  const resetData = () => {
    setMessage(null);
    setData1(originalData1);
    setData2(originalData2);
  };

  const updateTableSize = (newSize) => {
    setMessage(null);
    setSize(newSize);
  };

  // When cell renderer calls updateData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateData1 = (rowIndex, columnId, value) => {
    setData1((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  const updateData2 = (rowIndex, columnId, value) => {
    setData2((old) => old.map((row, index) => {
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
    data1.forEach((row) => {
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
    if (name === 'prim') {
      if (matrixValidCheck(matrix) === false) {
        setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE2));
        // eslint-disable-next-line consistent-return
        return [];
      }
    }

    return matrix;
  };

  // Run the animation
  const handleSearch = () => {
    closeInstructions(); // remove instruction
    setMessage(null);
    const matrix = getMatrix();

    if (matrix.length !== 0) {
      // setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name,
        mode,
        size,
        matrix,
      });
    //   setButtonMessage('Reset');
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <div className="matrixContainer">
      <div className="matrixButtonContainer">
        <button className="matrixBtn" onClick={() => updateTableSize(size + 2)}>
          Increase Graph Size
        </button>
        <button className="matrixBtn" onClick={() => updateTableSize(size - 1)}>
          Decrease Graph Size
        </button>
        <ControlButton
          icon={<RefreshIcon />}
          className="greyRoundBtn"
          id="refreshMatrix"
          onClick={resetData}
        />
        <button className="matrixBtn" onClick={handleSearch} id="startBtnGrp">
          {buttonMessage}
        </button>
      </div>
      <Table columns={columns1} data={data1} updateData={updateData1} algo={name} />
      <Table columns={columns2} data={data2} updateData={updateData2} algo={name}/>
    </div>
  );
}

export default PrimsMatrixParam;
