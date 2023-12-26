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
  makeWeights,
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
 * (currently assumes matrix represents edge weights of a graph)
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
  EXAMPLE2, 
  unweighted
}) {
  // const [size, setSize] = useState(defaultSize); 
  
  const [size, setSize] = useState(defaultSize);
  const [endNode, setEndNode] = useState(defaultSize); 
  const [startNode, setStartNode] = useState(1);

  const columns = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();

  // modified this so that the graph is synchronized with the matrix at the start
  // XXX its not for Prims...
  const [data, setData] = useState(() => makeWeights(size, min, max, symmetric, unweighted));


  const [originalData, setOriginalData] = useState(data);
  const [buttonMessage, setButtonMessage] = useState('Restart');

  // reset the Table when the size changes
  useEffect(() => {
    const newData = makeWeights(size, min, max, symmetric, unweighted);
    setData(newData);
    setOriginalData(newData);
  }, [size, min, max, symmetric, unweighted]);

  useEffect(() => {
    const element = document.querySelector('button[id="startBtnGrp"]');
    simulateMouseClick(element);
  }, []);

  // Reset the matrix to the inital set
  const resetData = () => {
    setMessage(null);
    setData(originalData);
  };
  
  //The size does not go above 10 or below one
  const updateTableSize = (newSize) => {
    if (newSize >= 1 && newSize <= 10) {  
      setMessage(null);
      setSize(newSize); 
      //If the size decrease to a lower value than endNode, endNode should
      //decrease to that value
      if(endNode > newSize){
        setEndNode(newSize);
      } 

      if(startNode > newSize){
        setStartNode(newSize);
      } 

    } 
  };

  // When cell renderer calls updateData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateData = (rowIndex, columnId, value) => {
    
    // Check if the new value is the same as the old value
    if (data[rowIndex] && data[rowIndex][columnId] === value) {
      return; 
    }
    
    // Make a deep copy of the data
    const updatedData = JSON.parse(JSON.stringify(data));

    // Update the cell (a, b)
    if (updatedData[rowIndex]) {
        updatedData[rowIndex][columnId] = value;
    }

    // Only do the following if the name is NOT "transitiveClosure"
    if (name !== "transitiveClosure") {
        // Get the reversed column id (i.e., swap rowIndex and columnId)
        const reverseColumnId = `col${rowIndex}`;
        const reverseRowIndex = parseInt(columnId.replace('col', ''), 10);

        // Update the symmetric cell (b, a)
        if (updatedData[reverseRowIndex]) {
            updatedData[reverseRowIndex][reverseColumnId] = value;
        }
    } 


  
    // Update the state
    setData(updatedData);  
    
    //handleSearch();
  }; 

  useEffect(() => {
    handleSearch();
  }, [data]);

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
    if (name === 'primOld' || name === 'primNew') {
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
        endNode,  
        startNode,
      });
    //   setButtonMessage('Reset');
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };  
  
  useEffect(() => {
    handleSearch();
  }, [startNode]);
  useEffect(() => {
    handleSearch();
  }, [endNode]);  


  const increaseStartNode = () => {
    if (startNode < size) {
        setStartNode(prevStartNode => prevStartNode + 1);
    }
  };

  const decreaseStartNode = () => {
    if (startNode > 1) {
        setStartNode(prevStartNode => prevStartNode - 1);
    }
  };

  const increaseEndNode = () => {
    if (endNode < size) {
        setEndNode(prevEndNode => prevEndNode + 1);
    }
  };

  const decreaseEndNode = () => {
    if (endNode > 1) {
        setEndNode(prevEndNode => prevEndNode - 1);
    }
  }; 


  return (
    <div className="matrixContainer"> 
      <div className="matrixButtonContainer"> 
      {(name === "BFS" || name === "DFS" || name === "dijkstra"
       || name === "aStar") && (
          <div className="startNodeInputContainer">
          <label htmlFor="startNodeCounter" className="startNodeLabel">Start Node: </label>
          <button 
              onClick={() => decreaseStartNode()}
              disabled={startNode <= 1}
              className={`arrowBtn pointerCursor ${startNode <= 1 ? 'disabledBtn' : ''}`}
          >
              -
          </button>
          <span id="startNodeCounter" className="startNodeValue"> {startNode} </span>
          <button 
              onClick={() => increaseStartNode()}
              disabled={startNode >= size}
              className={`arrowBtn pointerCursor ${startNode >= size ? 'disabledBtn' : ''}`}
          >
              +
          </button>
      </div>
        )}
        
        
        {(name === "BFS" || name === "DFS" || name === "aStar" || name === "dijkstra") && (
          <div className="endNodeInputContainer">
          <label htmlFor="endNodeCounter" className="endNodeLabel">End Node: </label>
          <button 
              onClick={() => decreaseEndNode()}
              disabled={endNode <= 1}
              className={`arrowBtn pointerCursor ${endNode <= 1 ? 'disabledBtn' : ''}`}
          >
              -
          </button>
          <span id="endNodeCounter" className="endNodeValue"> {endNode} </span>
          <button 
              onClick={() => increaseEndNode()}
              disabled={endNode >= size}
              className={`arrowBtn pointerCursor ${endNode >= size ? 'disabledBtn' : ''}`}
          >
              +
          </button>
      </div>
        )}
        <button 
          className={`matrixBtn ${size == 10 ? 'disabledText' : ''}`} 
          onClick={() => updateTableSize(size + 1)}>
            Increase Graph Size
        </button>
        
        <button 
          className={`matrixBtn ${size == 1 ? 'disabledText' : ''}`} 
          onClick={() => updateTableSize(size - 1)}>
           Decrease Graph Size
        </button>
        <button className="matrixBtn" onClick={resetData}>
          Revert
        </button>
        
        
        

        <button className="matrixBtn" onClick={handleSearch} id="startBtnGrp">
          {buttonMessage}
        </button>
      </div> 

      

      <Table columns={columns} data={data} updateData={updateData} algo={name} />
    </div>
  );
  
}

export default MatrixParam;
/*
<ControlButton
          icon={<RefreshIcon />}
          className="greyRoundBtn"
          id="refreshMatrix"
          onClick={resetData}
        /> */

