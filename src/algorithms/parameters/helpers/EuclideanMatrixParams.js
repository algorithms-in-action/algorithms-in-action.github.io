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
  makeColumnCoords,
  makeData,
  makeRandomCoordinateData,
  singleNumberValidCheck,
  errorParamMsg,
  successParamMsg, matrixValidCheck,
} from './ParamHelper';

import useParam from '../../../context/useParam';
import { closeInstructions } from '../../../components/mid-panel/helper';
import '../../../styles/EuclideanMatrix.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import { ReactComponent as AddIcon } from '../../../assets/icons/add.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/minus.svg';

import ControlButton from '../../../components/common/ControlButton';
import { template } from 'lodash';

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
function EuclideanMatrixParams({
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
  const columns1 = useMemo(() => makeColumnCoords(size), [size]);
  const columns2 = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();

  // First table.
  const [data1, setData1] = useState(() => makeRandomCoordinateData(size, 4, 5));
  const [originalData1, setOriginalData1] = useState(data1);

  // Second Table
  const [data2, setData2] = useState(() => makeData(size, 0, 1, symmetric));
  const [originalData2, setOriginalData2] = useState(data2);

  const [buttonMessage, setButtonMessage] = useState('Start');
  
  // With the buton toggle Euclidean/Manhattan
  const [isEuclidean, setCalcMethod] = useState(true);
  const [isEuclideanButtonMessage, setCalcMethodButtonMessage] = useState('Euclidean');

  // Reset first table when the size changes
  useEffect(() => {
    const newData1 = makeRandomCoordinateData(size, 4, 5);
    setData1(newData1);
    setOriginalData1(newData1);
  }, [size, min, max, symmetric]);

  // Reset second table when the size changes
  useEffect(() => {
    const newData2 = makeData(size, 0, 1, symmetric);
    setData2(newData2);
    setOriginalData2(newData2);
  }, [size, 1, 1, symmetric]);

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

  const changeCalcMethod = (state) => {
    setMessage(null);
    setCalcMethod(state);
    if (state === true) {
      setCalcMethodButtonMessage('Euclidean');
    } else {
      setCalcMethodButtonMessage('Manhattan');
    }
    
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

  // Get and parse the coordinates of each node
  const getCoordinateMatrix = () => {
    const coords = [];
    data1.forEach((row) => {
      const temp = [];
      for (const [_, value] of Object.entries(row)) {
        const maxValue = 100;  // Maximum value a coordinate can take.
        if (singleNumberValidCheck(value) && value < maxValue) {
          const num = parseInt(value, 10);
          temp.push(num);
        } else {
          setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
          return;
        }
      }
      coords.push(temp);
    });
    return coords;
  };

  // Get and parse the edges between nodes of 0s and 1s
  const getEdgeValueMatrix = () => {

    const adjacent = [];
    data2.forEach((row) => {
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
      adjacent.push(temp);
    });
    // Calculate edges based on adjacent matrix
    const coords = getCoordinateMatrix();
    if (coords.length !== adjacent.length || coords[0].length !== adjacent[0].length) {
      return [];
    }

    const edges = [];
    for (let i = 0; i < coords.length; i++) {
      const temp_edges = [];
      for (let j = 0; j < coords.length; j++) {
        let distance = 0;
        if (isEuclidean === true) {
          // Calculate Euclidean Distances
          distance = Math.sqrt(Math.pow(coords[j][0] - coords[i][0], 2) + Math.pow(coords[j][1] - coords[i][1], 2));
        } else {
          // Calculate Manhattan Distances
          distance = Math.abs(coords[j][0] - coords[i][0]) + Math.abs(coords[j][1] - coords[i][1]);
        }

        // Ensure distance is a positive integer.
        distance = Math.ceil(distance);

        // If adjacent push distance if not then 0
        if (adjacent[i][j] === 1) {
          temp_edges.push(distance);
        } else if (adjacent[i][j] === 0) {
          temp_edges.push(0);
        } else {
          setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE2));
          return [];
        }

      }
      
      edges.push(temp_edges);
    }

    if (edges.length !== size || edges[0].length !== size) return [];
    if (name === 'prim') {
      if (matrixValidCheck(edges) === false) {
        setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE2));
        // eslint-disable-next-line consistent-return
        return [];
      }
    }
    return edges;
  };

  // Run the animation
  const handleSearch = () => {
    closeInstructions(); // remove instruction
    setMessage(null);

    const coordsMatrix = getCoordinateMatrix();
    const edgeValueMatrix = getEdgeValueMatrix();

    if (edgeValueMatrix.length !== 0) {
      // setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name,
        mode,
        size,
        coordsMatrix,
        edgeValueMatrix
      });
    //   setButtonMessage('Reset');
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <div className="matrixContainer">
      <div className="matrixButtonContainer">
        <div className="sLineButtonContainer">
          <button className="sizeBtn" onClick={() => updateTableSize(size - 1)}>
            −
          </button>
          <span className='size'>Num Nodes: {size}</span>
          <button className="sizeBtn" onClick={() => updateTableSize(size + 1)}>
            +
          </button>
          
        </div>

        <button className="algorithmBtn" onClick={() => changeCalcMethod(!isEuclidean)}>
          Edge Weight: {isEuclideanButtonMessage}
        </button>

        <div className="sLineButtonContainer">
          <button className="matrixBtn" onClick={handleSearch} id="startBtnGrp">
            {buttonMessage}
          </button>
          <ControlButton
            icon={<RefreshIcon />}
            className="greyRoundBtn"
            id="refreshMatrix"
            onClick={resetData}/>
          
        </div>
      </div>

      <div className="coord">
        <text className="titles"> Coordinates (X,Y) </text>
        <Table columns={columns1} data={data1} updateData={updateData1} algo={name} />
      </div>
      
      <div className="edge">
        <text className="titles"> Edges (0 or 1)</text>
        <Table columns={columns2} data={data2} updateData={updateData2} algo={name} />
      </div>
      
    </div>
  );
}

export default EuclideanMatrixParams;
