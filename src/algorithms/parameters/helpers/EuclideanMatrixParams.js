/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */

// Support for graphs with Euclidean (X-Y) coordinates defined for each
// node. In flux currently. Student version used tables for input of
// graphs - lots of screen real-estate.  Also a bunch of other problems
// and annoyances/limitations.  Working towards input of X-Y cordinates
// and edges/weights via text boxes, plus having predefined example
// graphs, allowing user-defined weights as well as Euclidean/Manhattan
// weights based on X-Y coordinates, etc. Old input method still
// supported if you scroll down - could delete eventually but doesn't do
// much harm if its off-screen.
// NOTE: There are (at least) three different representations for
// graphs: strings (the "new" one - comma separated pairs of numbers etc)
// the one for rendering tables (YUK!), and a more sensible 2D edge
// matrix (plus coordinates). These must be kept synchronised, and
// synchronised with the representation used for rendering the graph at
// certain points (a separate representation again with code elsewhere).
// It's a bit tricky because setState in React is asynchronous - if you
// call setState then immediately read the state it will be the old
// state returned.
// CURRENT STATUS:
// Text boxes for data input are there and there are sample graphs with
// switch to select them or random but data is not copied elsewhere.
// Data input from tables gets reflected in text boxes.
// TO DO:
// FiXXX BUG: sometimes if you try to edit a matrix cell with a backspace
// it "freezes" and you can't change it from zero (no idea why).
// Code to parse lists of pairs etc (can re-use work by
// Union-Find group) and convert to/from internal graph representation
// and copy this data elsewhere when button is pressed (maybe use
// sensible data structure for graph representation in the state and
// copy to/from other representations).
// Work more on input data display - use sccs for everything, define
// new classes etc instead of just reusing existing ones.
// Size adjustment should just trim/grow tables etc.
// Keep track of size for random graphs?
// Coordinates editing should change size?
// Example graphs should be passed in somehow (so they are algorithm
// specific).
// Optional start node and end nodes (algorithm specific)
// Sync initial data with rendered graph (seems like there are default
// functions for creating a random graph in the renderer but no way of
// getting from there to the data input display)
//
// Separate work on graph rendering - currently too small with decent
// range of X-Y values plus


import React, { useState, useEffect, useMemo } from 'react';
import { GlobalActions } from '../../../context/actions';
import Table from './Table';
import {
  makeColumnArray,
  makeColumnCoords,
  makeXYCoords,
  makeWeights,
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
import ListParam from './ListParam';
import '../../../styles/Param.scss';

// Example graphs XXX refine this; probably want different examples for
// different algorithms so these should be defined in the algorithm
// files and imported/passed in here.
// For some algorithms we need to specify start and end nodes also;
// ideally these should be displayed differently. XXX
// Might want different random graphs for different algorithms at
// some point...
const GRAPHCHOICENUM = 3; // number of graph choice options
const GRAPHCHOICERAND = 0; // random graph
const graphChoiceName = ['Random', 'Example 1', 'Example 2'];
// const graphChoice = 0; // DEFAULT

const SIZE_EG1 = 5;
const COORDS_TXT_EG1 = '1-1,3-4,4-1,6-5,7-8';
const EDGES_TXT_EG1 = '1-2,1-4,2-3,2-4,1-5-9,4-5,3-5';

const SIZE_EG2 = 6;
const COORDS_TXT_EG2 = '1-2,3-2,5-1,6-5,7-8,9-3';
const EDGES_TXT_EG2 = '1-3-5,3-4,2-4-4,1-5-9,4-5,3-5,3-6-8';

const SIZE_RANDOM = SIZE_EG2;  // could change
const SIZE_EGS = [SIZE_RANDOM, SIZE_EG1, SIZE_EG2];
// COORDS etc for random graphs will be generated; use anything here
const COORDS_EGS = ['1-1', COORDS_TXT_EG1, COORDS_TXT_EG2];
const EDGES_EGS = ['1-1', EDGES_TXT_EG1, EDGES_TXT_EG2];
const COORDS_EXAMPLE =
 "Please follow example: 1-1,3-4,4-1,6-6 giving the X-Y coordinates for each of the nodes in the graph.";
const EDGES_EXAMPLE =
 "Please follow example: 1-2,1-3,2-3,3-2-6,3-4-7 giving NodeA-NodeB-Weight for each in the graph; -Weight is optional and defaults to 1.";

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
  unweighted
}) {
  // const [size, setSize] = useState(defaultSize);
  const [size, setSize] = useState(defaultSize);
 
  // With the button toggle Euclidean/Manhattan/As Input
  const WEIGHTCALCMAX = 3; // number of weight calculation options
  const W_EUCLIDEAN = 0;
  const W_MANHATTAN = 1;
  const W_INPUT = 2; // as defined by input
  const weightCalcName = ['Euclidean', 'Manhattan', 'As input'];
  const [weightCalc, setCalcMethod] = useState(W_EUCLIDEAN);

  // (size) affects number of columns.
  const columns1 = useMemo(() => makeColumnCoords(size), [size]);
  const columns2 = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();

  // Old version with a table of X-Y coordinates and matrix of edge
  // weights:
  // X&Y coordinate table
  const [data1, setData1] = useState(() => makeXYCoords(size, min, max));
  const [originalData1, setOriginalData1] = useState(data1);

  // Edge weight table
  // XXX use 0-2 for weights for now so reduce number of edges - should
  // have bigger max but more zeros (non-zero can be replaced by
  // Euclid or Manhattan anyway)
  const [data2, setData2] = useState(() => makeWeights(size, 0, 2, symmetric, unweighted));
  const [originalData2, setOriginalData2] = useState(data2);

  // New version of graph input:
  // Text list of pairs for X-Y coordinates, eg 1-4,3-4,4-1,6-5,7-8
  // and text list or pairs/triples for edges/weights,
  // eg 1-2,1-3-10,2-3-12,3-4,3-5 where first two numbers are nodes
  // and third is weight (if third is missing, weight defaults to 1)
  // The following breaks something, somehow...
  // const [edgesTxt, setEdgesTxt] = useState(getEdgeList(data2));
  // but the initial values get reset somewhere or other
  const [coordsTxt, setCoordsTxt] = useState('');
  const [edgesTxt, setEdgesTxt] = useState('');
  const [graphChoice, setgraphChoice] = useState(GRAPHCHOICERAND);

  // XXX why is this 'Start' but 'Restart' in MatrixParam.js???
  const [buttonMessage, setButtonMessage] = useState('Start');

  // reset the XY coordinates when the size changes
  // XXX Could just trim/extend
  useEffect(() => {
    const newData1 = makeXYCoords(size, min, max);
    setData1(newData1);
    setCoordsTxt(getCoordinateList(newData1));
    setOriginalData1(newData1);
  }, [size, min, max, symmetric, unweighted]);

  // reset the edge weight matrix when the size changes
  // XXX Could just trim/extend
  useEffect(() => {
    const newData2 = makeWeights(size, 0, 2, symmetric, unweighted);
    setData2(newData2);
    setEdgesTxt(getEdgeList(newData2));
    setOriginalData2(newData2);
  }, [size, min, max, symmetric, unweighted]);

  // synchonise input data with rendered graph etc
  // if graph data or weightCalc change
  useEffect(() => {
    // const element = document.querySelector('button[id="startBtnGrp"]');
    // simulateMouseClick(element);
    handleSearch();
  }, [data1, data2, weightCalc]);

  // Reset the matrix to the inital set
  // XXX Not sure if we want this?
  const resetData = () => {
    setMessage(null);
    setData1(originalData1);
    setData2(originalData2);
    setCoordsTxt(getCoordinateList(originalData1));
    setEdgesTxt(originalData2);
  };

  const handleCoords = () => {
    setMessage('under construction');
  };

  // change graph choice; Note setData1 etc are asynchronous
  const changeGraphChoice = (graphChoice) => {
    graphChoice = (graphChoice + 1) % GRAPHCHOICENUM;
    setgraphChoice(graphChoice);
    // if we change size here it triggers a bunch of other things we
    // don't want so we avoid setSize.  XXX would be nice to display
    // size without triggering things (possibly when we handle example
    // graphs properly everything will be ok)
    // setSize(SIZE_EGS[graphChoice]);
    if (graphChoice === GRAPHCHOICERAND) {
      const edges = makeWeights(size, 0, 2, symmetric, unweighted);
      const coords = makeXYCoords(size, min, max);
      setData1(coords);
      setCoordsTxt(getCoordinateList(coords));
      setData2(edges);
      setEdgesTxt(getEdgeList(edges));
    } else {
      setCoordsTxt(COORDS_EGS[graphChoice]);
      setEdgesTxt(EDGES_EGS[graphChoice]);
      // XXX copy to other representations (data1, data2)
    }
  };

  // XXX currently just affects random graph generation but should allow
  // example graphs to be edited with this also
  const updateTableSize = (newSize) => {
    setMessage(null);
    setSize(newSize);
  };

  // change weight calculation method
  const changeCalcMethod = (state) => {
    setMessage(null);
    setCalcMethod((state+1) % WEIGHTCALCMAX);
  };

  // When cell renderer calls updateData1, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateData1 = (rowIndex, columnId, value) => {
    const newData1 = data1.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...data1[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    });
    setData1(newData1);
    setCoordsTxt(getCoordinateList(newData1));
  };

  // When cell renderer calls updateData2, we'll use
  // the rowIndex, columnId and new value to update the
  // original data + symmetric cell if flag set
  const updateData2 = (rowIndex, columnId, value) => {
    let rowIndexMirror = -1;
    let columnIdMirror = 'colXYZZY';
    if (symmetric) {
      rowIndexMirror = parseInt(columnId.substring(3,columnId.length, 10));
      columnIdMirror = 'col' + rowIndex;
    }
    const newData2 = data2.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...data2[rowIndex],
          [columnId]: value,
        };
      } else if (index === rowIndexMirror) { // only true if symmetric
        return {
          ...data2[rowIndexMirror],
          [columnIdMirror]: value,
        };
      }
      return row;
    });
    setData2(newData2);
    setEdgesTxt(getEdgeList(newData2));
  };

  // Get and parse the coordinates of each node
  const getCoordinateMatrix = () => {
    const coords = [];
    data1.forEach((row) => {
      const temp = [];
      for (const [_, value] of Object.entries(row)) {
        if (singleNumberValidCheck(value)) {
          const num = parseInt(value, 10);
          temp.push(num);
        } else {
          setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
          return;
        }
      }
      coords.push(temp);
    });
    // XXX move/copy this elsewhere?
    // set pair list version of coordinates to that in table
    // setCoordsTxt(getCoordinateList(data1));
    return coords;
  };

  // Get coordinates from table and build list text (string)
  const getCoordinateList = (data1) => {
    let coordsTxt = ``;
    data1.forEach((row) => {
      coordsTxt += row.col0 + `-` + row.col1 + `,`;
    });
    coordsTxt = coordsTxt.substring(0,coordsTxt.length-1); // strip final `,`
    return coordsTxt;
  };

  // Get and parse the edges from table; recompute weights depending on
  // weightCalc flag (maybe this should be a parameter)
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
    // XXX should figure out an appropriate error message if things are
    // screwed up
    const coords = getCoordinateMatrix();
    if (coords.length !== adjacent.length || coords.length !== adjacent[0].length || coords[0].length !== 2) {
      return [];
    }

    const edges = [];

    for (let i = 0; i < coords.length; i++) {
      const temp_edges = [];
      
      for (let j = 0; j < coords.length; j++) {
        let distance = 0;
        if (adjacent[i][j] !== 0) {
          if (weightCalc === W_EUCLIDEAN) {
            // Calculate *rounded up* Euclidean Distance
            // Want to avoid floating point + have the option of
            // admissible and inadmissible heuristics in A*
            // XXX move to separate function
            distance = Math.ceil(Math.sqrt(Math.pow(coords[j][0] - coords[i][0], 2) + Math.pow(coords[j][1] - coords[i][1], 2)));
          } else if (weightCalc === W_MANHATTAN) {
            distance = Math.abs(coords[j][0] - coords[i][0]) + Math.abs(coords[j][1] - coords[i][1]);
          } else { // W_INPUT
            distance = adjacent[i][j];
          }
        }
        // If adjacent push distance, otherwise push 0
        temp_edges.push(distance);
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

  // Get edges from table and build list text (string)
  const getEdgeList = (data2) => {
    let edgesTxt = ``;
    for (var rowNum = 0; rowNum < size; rowNum++) {
      for (const [colId, val] of Object.entries(data2[rowNum])) {
        if (val !== '0') {
          const colNum = parseInt(colId.substring(3,colId.length, 10));
          if (!(rowNum == colNum || (symmetric && colNum < rowNum))) {
            edgesTxt += (rowNum+1).toString() + `-` + (colNum+1).toString();
            if (val !== '1') {
              edgesTxt += `-` + val;
            }
            edgesTxt += `,`;
          }
        }
      }
    }
    edgesTxt = edgesTxt.substring(0,edgesTxt.length-1); // strip final `,`
    return edgesTxt;
  };

  // synchonises input data with rendered graph etc for animation
  // XXX better to call this handleStart/...; no longer need Start
  // button now as this is called via useEffect 
  const handleSearch = () => {
    closeInstructions(); // remove instruction
    setMessage(null);

    // XXX graph display is different from data display on startup
    // for some reason; works after clicking on START which
    // runs this code.  Maybe next two lines need to be copied
    // elsewhere or this function should be called?

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
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE)); // FIX message
    }
  };

  return (
  <>
      <div className="matrixButtonContainer">
        <div className="sLineButtonContainer">
  <div className="form">
        <button className="graphChoiceBtn" onClick={() => changeGraphChoice(graphChoice)}>
          Graph: {graphChoiceName[graphChoice]}
        </button>
        <div className="sLineButtonContainer">
          <button className="sizeBtn" onClick={() => updateTableSize(size - 1)}>
            −
          </button>
          <span className='size'>Num Nodes: {size}</span>
          <button className="sizeBtn" onClick={() => updateTableSize(size + 1)}>
            +
          </button>
          
        </div>
        <button className="algorithmBtn" onClick={() => changeCalcMethod(weightCalc)}>
          Edge Weight: {weightCalcName[weightCalc]}
        </button>
  </div>
  <div className="disabled">
        <ListParam
          name="graphCoords"
          buttonName="Set&nbsp;X-Y&nbsp;Coordinates"
          formClassName="formLeft"
          mode="search"
          DEFAULT_VAL={coordsTxt}
          SET_VAL={setCoordsTxt}
          REFRESH_FUNCTION={() => COORDS_TXT_EG1}
          ALGORITHM_NAME={ALGORITHM_NAME}
          EXAMPLE={COORDS_EXAMPLE}
          setMessage={setMessage}
        />
  </div>
  <div className="disabled">
        <ListParam
          name="graphEdges"
          buttonName="Set&nbsp;Edges/Weights"
          formClassName="formLeft"
          mode="search"
          DEFAULT_VAL={edgesTxt}
          SET_VAL={setEdgesTxt}
          REFRESH_FUNCTION={() => EDGES_TXT_EG1}
          ALGORITHM_NAME={ALGORITHM_NAME}
          EXAMPLE={EDGES_EXAMPLE}
          setMessage={setMessage}
        />
  </div>
        </div>
      </div>
    <div className="matrixContainer">

      <div className="coord">
        <text className="titles"> Coordinates (X,Y) </text>
        <Table columns={columns1} data={data1} updateData={updateData1} algo={name} />
      </div>
      
      <div className="edge">
        <text className="titles"> Edges (0,1)</text>
        <Table columns={columns2} data={data2} updateData={updateData2} algo={name} />
      </div>

    </div>
  </>
  );
}

export default EuclideanMatrixParams;
