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
  successParamMsg, 
  matrixValidCheck, 
  makeSparseEdgeData,
  makeEdgeZerosData
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
  maxNodes,
  name,
  symmetric,
  mode,
  setMessage,
  ALGORITHM_NAME,
  EXAMPLE,
  EXAMPLE2,
  EXAMPLE3,
}) {
  // const [size, setSize] = useState(defaultSize);
  const [size, setSize] = useState(defaultSize);

  // (size) affects number of columns.
  const columns1 = useMemo(() => makeColumnCoords(size), [size]);
  const columns2 = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();

  // First table.
  const [coordinateData, setCoordinateData] = useState(() => makeRandomCoordinateData(size, 5, 6));
  const [originalCoordinateData, setOriginalCoordinateData] = useState(coordinateData);

  // Second Table
  const [edgeData, setEdgeData] = useState(() => makeSparseEdgeData(size));
  const [originalEdgeData, setOriginalEdgeData] = useState(edgeData);


  const [buttonMessage, setButtonMessage] = useState('Start');
  
  // With the button toggle Euclidean/Manhattan
  const [isEuclidean, setCalcMethod] = useState(true);
  const [isEuclideanButtonMessage, setCalcMethodButtonMessage] = useState('Euclidean');

  // Toggle data
  const listEdgeDataValueMessages = ['Default', '0s', '1s'];
  const [edgeDataValue, setEdgeDataIndex] = useState(0);
  const [edgeDataValueMessage, setEdgeDataMessage] = useState('0s');

  // Reset coordinate table when the size changes
  useEffect(() => {
    const newCoordinateData = makeRandomCoordinateData(size, 5, 6);
    setCoordinateData(newCoordinateData);
    setOriginalCoordinateData(newCoordinateData);
  }, [size, min, max, symmetric]);

  // Reset edge table when the size changes
  useEffect(() => {
    // const newEdgeData = makeData(size, 0, 1, symmetric);
    const newEdgeData = makeSparseEdgeData(size);
    setEdgeData(newEdgeData);
    setOriginalEdgeData(newEdgeData);
  }, [size, 1, 1, symmetric]);

  useEffect(() => {
    const element = document.querySelector('button[id="startBtnGrp"]');
    simulateMouseClick(element);
  }, []);

  // Reset the input table to the inital set
  const resetData = () => {
    setMessage(null);
    setCoordinateData(originalCoordinateData);
    setEdgeData(originalEdgeData);
    toggleEdgeData(0);
  };

  const toggleEdgeData = (index) => {
    if (index >= 3) {index = 0;}

    var edgeData;
    if (index === 1) {
      // Set edge table to all 0s.
      edgeData = makeEdgeZerosData(size);
    } 
    else if (index === 2) {
      // Set edge table to all 1s.
      edgeData = makeData(size, 1, 1, symmetric);
    } 
    else {
      // Set edge table to default edge table.
      edgeData = originalEdgeData;
    }
    setEdgeDataIndex(index);
    var nextIndex = index + 1;
    if (nextIndex >= 3) {nextIndex = 0;}
    setEdgeDataMessage(listEdgeDataValueMessages[nextIndex]);
    setEdgeData(edgeData);
  }

  // Sets table size.
  const updateTableSize = (newSize) => {
    if (newSize > maxNodes) {
      setMessage(errorParamMsg(ALGORITHM_NAME, "Number of nodes must not exceed " + maxNodes));
      return;
    } 
    else if (newSize < 3) {
      setMessage(errorParamMsg(ALGORITHM_NAME, "Number of nodes must not be lower than 3"));
      return;
    }
    setMessage(null);
    setSize(newSize);
  };

  // Changes edge calculation for euclidean distance to manhattan distance.
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
  const updateCoordinateData = (rowIndex, columnId, value) => {
    setCoordinateData((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  const updateEdgeData = (rowIndex, columnId, value) => {
    setEdgeData((old) => old.map((row, index) => {
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
    var validMatrix = true;
    coordinateData.forEach((row) => {
      const temp = [];
      for (const [_, value] of Object.entries(row)) {
        const maxValue = 100;  // Maximum value a coordinate can take.
        if (singleNumberValidCheck(value) && value < maxValue) {
          const num = parseInt(value, 10);
          temp.push(num);
        } else {
          // check value
          validMatrix = false;
        }
      }
      coords.push(temp);
    });
    if (validMatrix) {
      return coords;
    } else {
      return [];
    }

    
  };

  /**
   * Calculate the edge values of each edge.
   * @return {array} matrix of edge values.
   */
  const getEdgeValueMatrix = () => {
    const adjacent = [];
    edgeData.forEach((row) => {
      const temp = [];
      for (const [_, value] of Object.entries(row)) {
        if (singleNumberValidCheck(value)) {
          const num = parseInt(value, 10);
          temp.push(num);
        } else {
          return [];
        }
      }
      adjacent.push(temp);
    });

    const coords = getCoordinateMatrix();
    if (coords.length !== adjacent.length || coords[0].length !== adjacent[0].length) {
      return [];
    }

    // Calculate edge values of each node.
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
          return [];
        }

      }
      
      edges.push(temp_edges);
    }

    if (edges.length !== size || edges[0].length !== size) return [];
    if (name === 'prim') {
      if (matrixValidCheck(edges) === false) {
        // check symmetry and return null if not
        return null;
      }
    }
    return edges;
  };

  // Dispatches run function of algorithm, passing required information as parameters.
  const handleSearch = () => {
    closeInstructions(); // remove instruction
    setMessage(null);

    const coordsMatrix = getCoordinateMatrix();
    const edgeValueMatrix = getEdgeValueMatrix();
    
    if (coordsMatrix.length == 0) {
      // Error on input from coords matrix
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE3));
    } else if (edgeValueMatrix == null) {
      // Error on symmetry from coords matrix
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE2));
    } else if (edgeValueMatrix.length == 0) {
      // Error on input from edge value matrix
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    } else {
      // setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name,
        mode,
        size,
        coordsMatrix,
        edgeValueMatrix
      });
    }
  };

  return (
    <div className="matrixContainer">
      <div className="matrixButtonContainer">
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
        <div className="bLineButtonContainer">
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

        <button className="algorithmBtn" onClick={() => toggleEdgeData(edgeDataValue + 1)}>
          Reset Edges to: {edgeDataValueMessage}
        </button>
      </div>

      <div className="coord">
        <text className="titles"> Coordinates (X,Y) </text>
        <Table columns={columns1} data={coordinateData} updateData={updateCoordinateData} algo={name} />
      </div>
      
      <div className="edge">
        <text className="titles"> Edges (0 or 1)</text>
        <Table columns={columns2} data={edgeData} updateData={updateEdgeData} algo={name} />
      </div>
      
    </div>
  );
}

export default EuclideanMatrixParams;
