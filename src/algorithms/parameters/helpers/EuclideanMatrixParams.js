/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */

// Support for graphs with Euclidean (X-Y) coordinates defined for each
// node. In flux currently. Student version used tables only for input of
// graphs - lots of screen real-estate.  Also a bunch of other problems
// and annoyances/limitations.  Now supports input of X-Y cordinates
// and edges/weights via text boxes, plus having predefined example
// graphs, allowing user-defined weights as well as Euclidean/Manhattan
// weights based on X-Y coordinates, etc. Also start node and end nodes
// (latter is optional - start nodes should be also). Old input method still
// supported if you scroll down - could delete eventually but doesn't do
// much harm if its off-screen, though it hides error messages.
// NOTE: There are (at least) three different representations for
// graphs: strings (the "new" one - comma separated pairs of numbers etc)
// the one for rendering tables (YUK!), and more sensible 2D edge
// matrix (plus coordinates). These must be kept synchronised, and
// synchronised with the representation used for rendering the graph at
// certain points (a separate representation again with code elsewhere).
// It's a bit tricky because setState in React is asynchronous - if you
// call setState then immediately read the state it will be the old
// state returned.  It's particularly tricky with size.  Basically,
// whenever anything is changed, you want to have the changed value in a
// local variable thats passed around as needed, rather than relying on
// the state version, which might be out of date. The flow of control
// through normal function calls + also the calls that are triggered
// through useEffect and UI interactions is also rather tricky.  Best
// minimise triggering if you want to not tax your brain too much.
// CURRENT STATUS:
// Text boxes for data input are there and there are sample graphs with
// switch to select them or random, coordinate data copied and size
// updated accordingly and edge/coordinate data is copied to tables.
// Data input from tables also gets reflected in text boxes.
// Example graphs passed in from algorithm; one random graph option
// added here. Input + editing of start node and optional end nodes
// (if the initial value is null, end nodes are not displayed and thus
// can't be changed). Temp changed to only have a single end node to
// re-use display code and avoid extra testing for A*. Optional
// weight and heuristic function toggles.
// TO DO:
// Work more on input data display - use sccs for everything, define
// new classes etc instead of just reusing existing ones, rethink some
// input methods (such as size + start) to reduce screen space required.
// Size adjustment should just trim/grow tables etc instead of
// regenerating a random graph each time. However, it would also be nice
// to easily generate new random graphs of a given size.
// Better random graph creation? Seems like there are default
// functions for creating a random graph in the renderer but no way of
// getting from there to the data input display - could get some ideas
// from that but it's not too bad as is.
// Rethink (and probably delete) stuff for re-setting values - doesn't
// seem like it's needed now.
// FiXXX BUG: sometimes if you try to edit a matrix cell with a backspace
// it "froze" and you couldn't change it from zero (no idea why; maybe
// it's fixed now - hasn't cropped up for a while??).
// A bunch of other things with XXX comments in code.

import React, { useState, useEffect, useMemo } from 'react';
import { GlobalActions } from '../../../context/actions';
import Table from './Table';
import {
  makeColumnArray,
  makeColumnCoords,
  makeXYCoords,
  makeWeights,
  euclidean,
  manhattan,
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
// XXX ListParam used here - better to use something simpler - see
// comments elsewhere (search for ListParam)
import ListParam from './ListParam';
import '../../../styles/Param.scss';


// We have an initial graph that is generated randomly (we could add
// other graph here that are independent of the algorithm) and other
// example graphs (passed in from algorithm) are appended onto these
// XXX best use graph 1 as the default if any sample graphs are supplied
// and random graph otherwise (messy to do init like this; not sure
// where to trigger graph change, so we assume there is at least 1 graph
// supplied)
const GRAPHCHOICERAND = 0; // choice 0 is random graph
let namesEgsInit = ['Random'];
const SIZE_RANDOM = 6;  // size for random graphs - could change
const sizeEgsInit = [SIZE_RANDOM];
// COORDS etc for random graphs will be generated; use anything here
const coordsEgsInit = ['1-1'];
const edgesEgsInit = ['1-2'];

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

// This is now used for initialisation in EuclideanMatrixParams so it needs
// to be outside that function and needs extra parameters passed in
// It returns [data1, size] in case the size has to change; data1 being
// null if there is an error
// Note: if the new size differs from the old size we must also call
// setData2 or we get into an inconsistent state and the new graph
// is not rendered until that is done
const coordTxt2Data1 = (value, size, ALGORITHM_NAME, setMessage) => {
  const textInput = value.replace(/\s+/g, '');
 
  if (isListofTuples(textInput, 2, 2)) {
    const coordMatrix =
      textInput
        .split(',')
        .map((pair) => pair.trim().split('-')) ;
    const newSize = coordMatrix.length;
    let newData1 = [];
    for (let i=0; i < coordMatrix.length; i++) {
      const xyArray = coordMatrix[i];
      newData1.push({col0: xyArray[0], col1: xyArray[1]});
    }
    return [newData1, newSize];
  } else {
    setMessage(errorParamMsg(ALGORITHM_NAME, COORDS_EXAMPLE));
    return [null, size];
  }
};

// This is now used for initialisation in EuclideanMatrixParams so it needs
// to be outside that function and needs extra parameters passed in
// XXX returns null if there is an error - SHOULD CHECK RETURN VALUE!
const edgeTxt2Data2 = (value, size, unweighted, symmetric, setMessage, ALGORITHM_NAME) => {
  const textInput = value.replace(/\s+/g, '');
  // accept pairs and triples; pairs are padded out with default
  // weight of 1; XXX should check node values are in 1 to size
  if (isListofTuples(textInput, 2, 3)) {
    // edgeList represented as 2D array
    let edgeList =
      textInput
        .split(',')
        .map((pair) => pair.trim().split('-')) ;
    const newSize = edgeList.length;
    let newData2 = [];
    for (let i = 0; i < size; i += 1) {
      const data = {};
      for (let j = 0; j < size; j += 1) {
        data[`col${j}`] = searchEdgeList(edgeList, i+1, j+1, unweighted, symmetric);
      }
      newData2.push(data);
    }

    return newData2;
  } else {
    setMessage(errorParamMsg(ALGORITHM_NAME, EDGES_EXAMPLE));
    return null;
  }
};


/**
 * This matrix param component can be used when
 * the param input accepts a matrix
 */
function EuclideanMatrixParams({
  defaultSize,
  defaultStart,
  defaultEnd,
  // XXX should have defaultWeight = 0 (=Euclidean) defined in the
  // graph traversal parameters; included explicitly in Warshall's
  defaultWeight = 0, // in case defaultWeight not defined
  defaultHeur,
  graphEgs,
  min,
  max,
  name,
  symmetric,
  mode,
  setMessage,
  ALGORITHM_NAME,
  EXAMPLE,
  EXAMPLE2,
  unweighted,
  circular
}) {

  // XXX these get re-evaluated when anything much changes - could
  // possibly redesign so that doesn't happen; the difficulty is that
  // they depend on graphEgs, which is passed in as a parameter.  It
  // would also be nicer to initialize all these together (something I
  // wrote code for initially but for some reason it didn't quite work)
  let graphChoiceNum = 1+graphEgs.length; // number of graph choice options
  // let sizeEgs = [SIZE_RANDOM, 5, 4];
  // let coordsEgs = ['1-1', COORDS_TXT_EG1, COORDS_TXT_EG2];
  // let edgesEgs = ['1-1', EDGES_TXT_EG1, EDGES_TXT_EG2];
  let sizeEgs = graphEgsSizes(graphEgs);
  let coordsEgs = graphEgsCoords(graphEgs);
  let edgesEgs = graphEgsEdges(graphEgs);
  let namesEgs = graphEgsNames(graphEgs);
  // Now use Example graph 0 passed in rather than random initially
  const [size, setSize] = useState(graphEgs[0].size);

  // Button toggles Euclidean/Manhattan/As Input for weights
  const WEIGHTCALCMAX = 3; // number of weight calculation options
  const W_EUCLIDEAN = 0;
  const W_MANHATTAN = 1;
  const W_INPUT = 2; // as defined by input
  const weightCalcName = ['Euclidean', 'Manhattan', 'As input'];
  const [weightCalc, setCalcMethod] = useState(defaultWeight);

  // Button toggles Euclidean/Manhattan for heuristic
  const HEURCALCMAX = 2; // number of heuristic calculation options
  const H_EUCLIDEAN = 0;
  const H_MANHATTAN = 1;
  const heurCalcName = ['Euclidean', 'Manhattan'];
  const [heurCalc, setHeurCalc] = useState(H_EUCLIDEAN);

  // (size) affects number of columns.
  const columns1 = useMemo(() => makeColumnCoords(size), [size]);
  const columns2 = useMemo(() => makeColumnArray(size), [size]);
  // window.alert(columns.Header);
  const { dispatch } = useParam();

  // Old version with a table of X-Y coordinates and matrix of edge
  // weights:
  // X&Y coordinate table
  // Now use Example graph 0 passed in rather than random initially
  //const [data1, setData1] = useState(() => makeXYCoords(size, min, max));
  const [data1, setData1] =
    useState(() => coordTxt2Data1(graphEgs[0].coords, graphEgs[0].size, ALGORITHM_NAME, setMessage)[0]);
  // best delete saving of original data
  const [originalData1, setOriginalData1] = useState(data1);

  // Edge weight table
  // We use 1-10 for weights here and elsewhere (should define consts for
  // these instead); these are the weights for edges - makeWeights has a
  // separate way of determining if an edge should exist.
  // const [data2, setData2] = useState(() => makeWeights(size, 1, 10, symmetric, unweighted));
  const [data2, setData2] =
    useState(() => edgeTxt2Data2(graphEgs[0].edges, graphEgs[0].size, unweighted, symmetric, setMessage, ALGORITHM_NAME));
  // best delete saving of original data
  const [originalData2, setOriginalData2] = useState(data2);

  // New version of graph input:
  // Text list of pairs for X-Y coordinates, eg 1-4,3-4,4-1,6-5,7-8
  // and text list or pairs/triples for edges/weights,
  // eg 1-2,1-3-10,2-3-12,3-4,3-5 where first two numbers are nodes
  // and third is weight (if third is missing, weight defaults to 1)
  const [coordsTxt, setCoordsTxt] = useState(graphEgs[0].coords);
  const [edgesTxt, setEdgesTxt] = useState(graphEgs[0].edges);
  const [startNode, setStartNode] = useState(defaultStart);
  // XXX not sure if endNodesTxt needs to be in State
  const [endNodesTxt, setEndNodesTxt] = useState(nums2Txt(defaultEnd));
  const [endNodes, setEndNodes] = useState((defaultEnd===null?[]:defaultEnd));
  // const [graphChoice, setgraphChoice] = useState(GRAPHCHOICERAND);
  const [graphChoice, setgraphChoice] = useState(1);

//   // reset the XY coordinates when the size changes
//   // (now done in updateTableSize - this is probably not needed XXX)
//   useEffect(() => {
//     const newData1 = makeXYCoords(size, min, max);
//     setData1(newData1);
//     setCoordsTxt(getCoordinateList(newData1));
//     setOriginalData1(newData1);
//   }, [min, max, symmetric, unweighted]);
// 
//   // reset the edge weight matrix when the size changes
//   // (now done in updateTableSize - this is probably not needed XXX)
//   // XXX Best just trim/extend
//   useEffect(() => {
//     const newData2 = makeWeights(size, 1, 10, symmetric, unweighted);
//     setData2(newData2);
//     setEdgesTxt(getEdgeList(newData2, size));
//     setOriginalData2(newData2);
//   }, [min, max, symmetric, unweighted]);

  // synchonise input data with rendered graph etc
  // if graph data etc change
  useEffect(() => {
    // const element = document.querySelector('button[id="startBtnGrp"]');
    // simulateMouseClick(element);
    handleSearch();
  }, [size, startNode, endNodes, data1, data2, weightCalc, heurCalc]);

  // change graph choice; Note setData1 etc are asynchronous
  // newSize is passed in for random graphs; if it is zero the default
  // size for random graphs is used (XXX could use previous size?)
  const changeGraphChoice = (graphChoice, newSize) => {
    graphChoice = (graphChoice + 1) % graphChoiceNum;
    setgraphChoice(graphChoice);
    if (newSize === 0) {
       newSize = sizeEgs[graphChoice];
    }
    // some repeated code from updateTableSize here...
    setSize(newSize);
    if (newSize < startNode)
        setStartNode(newSize);
    // remove and end nodes > newSize
    if (endNodes.some((e) => e > newSize)) {
      let newEndNodes = endNodes.filter((e) => e <= newSize);
      if (newEndNodes.length === 0 && ALGORITHM_NAME === 'A* Algorithm')
        newEndNodes = [newSize];
      setEndNodesTxt(nums2Txt(newEndNodes));
      setEndNodes(newEndNodes);
    }
    if (graphChoice === GRAPHCHOICERAND) {
      const edges = makeWeights(newSize, 1, 10, symmetric, unweighted, circular);
      const coords = makeXYCoords(newSize, min, max, circular);
      setData1(coords);
      setCoordsTxt(getCoordinateList(coords));
      setData2(edges);
      setEdgesTxt(getEdgeList(edges, newSize));
    } else {
      setCoordsTxt(coordsEgs[graphChoice]);
      setEdgesTxt(edgesEgs[graphChoice]);
      // setMessage(errorParamMsg(ALGORITHM_NAME, coordsEgs[graphChoice]));
      // let newData1 = null;
      // let s1 = null;
      let [newData1, s1] = coordTxt2Data1(coordsEgs[graphChoice], newSize, ALGORITHM_NAME, setMessage);
      if (newData1 !== null)
        setData1(newData1);
      setData2(edgeTxt2Data2(edgesEgs[graphChoice], newSize, unweighted, symmetric, setMessage, ALGORITHM_NAME));
    }
  };

  // Update number of nodes
  // useEffect() triggers handleSearch() to update animation
  // XXX currently generates new random graph - best avoid so
  // any displayed graph can be edited with this easily
  // XXX alternative to explicit size adjustment is just editing the
  // coordinates to add/delete some (which works), but it would be nice
  // to generate new random graphs of any size (thats still a bit
  // cumbersome with the current setup)
  // XXX maybe we should have a text box for the size instead of + and -
  const updateTableSize = (newSize, circular=false) => {
    if (newSize < 1) return;
    if (newSize < startNode)
        setStartNode(newSize);
    // remove and end nodes > newSize
    // A* must have end node so we pick size if needed
    if (endNodes.some((e) => e > newSize)) {
      let newEndNodes = endNodes.filter((e) => e <= newSize);
      if (newEndNodes.length === 0 && ALGORITHM_NAME === 'A* Algorithm')
          newEndNodes = [newSize];
      setEndNodesTxt(nums2Txt(newEndNodes));
      setEndNodes(newEndNodes);
    }
    setMessage(null);
    // make new random graph (updating data1 and data2)
    // This also calls setSize (see XXX note above)
    // Note changeGraphChoice takes the previous graph choice as it's
    // first argument and increments it (with modulo) to get new choice
    changeGraphChoice(GRAPHCHOICERAND-1, newSize);
  };

  // Update start node
  // useEffect() triggers handleSearch() to update animation
  const updateStartNode = (newStart) => {
    if (newStart < 1 || newStart > size) return;
    setMessage(null);
    setStartNode(newStart);
    // handleSearch();
  };

  // Update (single) end node; we just use modulo size+1, zero
  // representing no end node; special case for A* where an end node is
  // required
  // useEffect() triggers handleSearch() to update animation
  const updateEndNode = (newEnd) => {
    newEnd = (newEnd + size+1) % (size+1);
    if (newEnd === 0 && ALGORITHM_NAME === 'A* Algorithm')
      newEnd = size;
    setMessage(null);
    setEndNodes([newEnd]);
    // handleSearch();
  };

  // change weight calculation method
  const changeCalcMethod = (state) => {
    setMessage(null);
    setCalcMethod((state+1) % WEIGHTCALCMAX);
  };

  // change weight calculation method
  const changeHeurCalc= (state) => {
    setMessage(null);
    setHeurCalc((state+1) % HEURCALCMAX);
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

  // set up a function to call if node is moved with mouse (see
  // components/DataStructures/Graph/GraphRenderer/index.js) so
  // coordinates here can be updated
  const moveNode = (nodeID, x, y) => {
    const newData1 = data1.map((row, index) => {
      if (index === nodeID) {
        return {
          ...data1[nodeID],
          ['col0']: x.toString(),
          ['col1']: y.toString(),
        };
      }
      return row;
    });
    setData1(newData1);
    setCoordsTxt(getCoordinateList(newData1));
  }

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
    setEdgesTxt(getEdgeList(newData2, size));
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
            distance = euclidean(coords[j][0], coords[j][1], coords[i][0], coords[i][1]);
          } else if (weightCalc === W_MANHATTAN) {
            distance = manhattan(coords[j][0], coords[j][1], coords[i][0], coords[i][1]);
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
  const getEdgeList = (data2, size) => {
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

    const coordsMatrix = getCoordinateMatrix();
    const edgeValueMatrix = getEdgeValueMatrix();

    if (edgeValueMatrix.length !== 0) {
      // setMessage(successParamMsg(ALGORITHM_NAME));
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name,
        mode,
        size,
        startNode,
        endNodes,
        heuristicFn,
        coordsMatrix,
        edgeValueMatrix,
        moveNode
      });
    //   setButtonMessage('Reset');
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE)); // FIX message
    }
  };

  // Handle text input for coordinates
  // modified from the Union-Find code (that team seemed to know what
  // they were doing!)
  // XXX ListParam is used. It stores a comma separated list as an array
  // of strings, which we don't really want for coordinates or edges.
  // Using an array for edgesTxt, but only when the edges are edited is
  // horrible and we use a hack here to convert it back to a string.
  // We should really have something like ListParam that doesn't mess
  // about with things.
  const handleXYTxt = (e) => {
    e.preventDefault();
    setMessage(null);
    const [newData1, newSize] = coordTxt2Data1(e.target[0].value, size, ALGORITHM_NAME, setMessage);
    if (newData1 !== null)
      setData1(newData1);
    setSize(newSize);
    // some repeated code from updateTableSize here...
    if (newSize < startNode)
        setStartNode(newSize);
    // remove and end nodes > newSize
    if (endNodes.some((e) => e > newSize)) {
      let newEndNodes = endNodes.filter((e) => e <= newSize);
      if (newEndNodes.length === 0 && ALGORITHM_NAME === 'A* Algorithm')
        newEndNodes = [newSize];
      setEndNodesTxt(nums2Txt(newEndNodes));
      setEndNodes(newEndNodes);
    }
    // console.log('handleXYTxt');
    // console.log(edgesTxt);
    // XXX ListParam hack - see above
    let edgesTxt1 = edgesTxt;
    if (typeof edgesTxt !== "string")
      edgesTxt1 = edgesTxt.join();
    // console.log(edgesTxt1);
    if (newSize !== size) {
      setData2(edgeTxt2Data2(edgesTxt1, newSize, unweighted, symmetric, setMessage, ALGORITHM_NAME));
    }
  }

  // Handle text input for edges/weights
  // XXX ListParam used - see above
  const handleEdgeTxt = (e) => {
    e.preventDefault();
    setMessage(null);
    setData2(edgeTxt2Data2(e.target[0].value, size, unweighted, symmetric, setMessage, ALGORITHM_NAME));
  }

  // XXX Temporarily not used as we just support a single end node in
  // the same way as the start node
  // Handle text input for coordinates
  // As above
  const handleEndNodesTxt = (e) => {
    e.preventDefault();
    setMessage(null);
    const newEndNodes = endTxt2EndNodes(e.target[0].value, size);
    if (newEndNodes !== null)
      setEndNodes(newEndNodes);
  }

  // converts '1,2,3' into [1,2,3] etc; checks numbers are <= size
  // XXX should have method to restrict how many (eg, some algorithms
  // must have just one, others can have several)
  const endTxt2EndNodes = (value, size) => {
    const textInput = value.replace(/\s+/g, '');
  
    if (isListofTuples(textInput, 1, 1)) {
      const endNodes =
        textInput
          .split(',')
          .map((s) => parseInt(s, 10));
      if (!(endNodes.some((val) => val > size))) // check is NaN also?
        return endNodes;
    }
    setMessage(errorParamMsg(ALGORITHM_NAME, 'Input a list of comma-separated node numbers, eg 1,2'));
    return null;
  };

  // Heuristic function (for A Star); could possibly move the heuristic
  // function stuff elsewhere but for layout it's handy to have it here and
  // it's easier to get at the state here and pass the function.  Uses the
  // XY coordinates of the nodes (possibly could generalise some time)
  const heuristicFn = (x1, y1, x2, y2) => {
    if (heurCalc === H_EUCLIDEAN)
      return euclidean(x1, y1, x2, y2);
    else
      return manhattan(x1, y1, x2, y2);
  };


  // XXX need to fix sccs for some things, don't need refresh buttons
  // Better for size and start node to be single editable text box
  // instead of + and - buttons(?) -> space for end nodes on same line?
  // End nodes are optional (not used in all algorithms); should do the
  // same for start node
  let endNodeDiv = '';
  let endButton = '';
  if (defaultEnd !== null)
    // Temp disabled version supporting multiple end nodes
 // endNodeDiv = 
 //     (<div className="disabled">
 //       <ListParam
 //         name="EndNodes"
 //         buttonName="Set&nbsp;End&nbsp;Nodes"
 //         formClassName="formLeft"
 //         mode="search"
 //         handleSubmit={handleEndNodesTxt}
 //         DEFAULT_VAL={endNodesTxt}
 //         SET_VAL={setEndNodesTxt}
 //         REFRESH_FUNCTION={() => ''}
 //         ALGORITHM_NAME={ALGORITHM_NAME}
 //         EXAMPLE={COORDS_EXAMPLE}
 //         setMessage={setMessage}
 //       />
 //     </div>);
    // XXX would be nice to display ' ' instead of '0'
    endButton =
        (<div className="sLineButtonContainer">
          <button className="endBtn" onClick={() => updateEndNode(endNodes[0] - 1)}>
            −
          </button>
          <span className='size'>End: {endNodes[0]}</span>
          <button className="sizeBtn" onClick={() => updateEndNode(endNodes[0] + 1)}>
            +
          </button>
        </div>);

  let startButton = '';
  if (defaultStart !== null)
    startButton =
        (<div className="sLineButtonContainer">
          <button className="startBtn" onClick={() => updateStartNode(startNode - 1)}>
            −
          </button>
          <span className='size'>Start: {startNode}</span>
          <button className="sizeBtn" onClick={() => updateStartNode(startNode + 1)}>
            +
          </button>
          
        </div>);
 
  let weightButton = '';
  if (!unweighted)
    weightButton = 
        (<button className="algorithmBtn" onClick={() => changeCalcMethod(weightCalc)}>
          Weights: {weightCalcName[weightCalc]}
        </button>);
  let heurButton = '';
  if (defaultHeur !== null)
    heurButton = 
        (<button className="algorithmBtn" onClick={() => changeHeurCalc(heurCalc)}>
          Heuristic: {heurCalcName[heurCalc]}
        </button>);

  return (
  <>
      <div className="matrixButtonContainer">
        <div className="sLineButtonContainer">
  <div className="form">
        <button className="graphChoiceBtn" onClick={() => changeGraphChoice(graphChoice, 0)}>
          {namesEgs[graphChoice]}
        </button>
        <div className="sLineButtonContainer">
          <button className="sizeBtn" onClick={() => updateTableSize(size - 1)}>
            −
          </button>
          <span className="size">Size: {size}</span>
          <button className="sizeBtn" onClick={() => updateTableSize(size + 1)}>
            +
          </button>
          
        </div>
        {weightButton}
        {heurButton}
        {startButton}
        {endButton}
  </div>
  {endNodeDiv}
  <div className="disabled">
        <ListParam
          name="graphCoords"
          buttonName="Set&nbsp;X-Y&nbsp;Coordinates"
          formClassName="formLeft"
          mode="search"
          handleSubmit={handleXYTxt}
          DEFAULT_VAL={coordsTxt}
          SET_VAL={setCoordsTxt}
          REFRESH_FUNCTION={() => '1,1'}
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
          handleSubmit={handleEdgeTxt}
          DEFAULT_VAL={edgesTxt}
          SET_VAL={setEdgesTxt}
          REFRESH_FUNCTION={() => '1-2'}
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

// check if string is list of pairs/triples etc of numbers
// XXX could generalise a bit and use for other code, eg Union Find
function isListofTuples(value, minLen, maxLen) {
  if (!value) return false;

  // ensuring only allowable characters
  if (!/^[0-9,-\s]+$/.test(value)) return false;

  // splits the string into an array of tuples
  const tuples = value.split(',').map((tuple) => tuple.trim());

  // checks if each tuple is valid
  for (let i = 0; i < tuples.length; i++) {
    const tuple = tuples[i].split('-');

    // checks minLen up to maxLen values in tuple
    if (tuple.length < minLen || tuple.length > maxLen) return false;

    // checks if each value in pair is in domain
    // XXX could do better here
    if (tuple.some((val) => isNaN(val))) return false;
  }
  return true;
}

// searches through edge list represented as a 2D array and returns
// weight if there is an edge between i and j, otherwise zero
function searchEdgeList(edgeList, i, j, unweighted, symmetric) {
  for (var r = 0; r < edgeList.length; r++) {
    const node1 = edgeList[r][0];
    const node2 = edgeList[r][1];
    let weight = (edgeList[r].length == 2? '1' : edgeList[r][2]);
    if (unweighted && weight > 0) {
      weight = '1';
    }
    if (i == node1 && j == node2) {
      return weight;
    }
    if (symmetric && i == node2 && j == node1) {
      return weight;
    }
  }
  return '0';
}

// XXX not much point in sizeEgs etc as random graphs have to be handled
// as a special case generally anyway

// Extract sizes from graphEgs param; add to random
const graphEgsSizes = (graphEgs) => {
  let sizeEgs = [...sizeEgsInit];
  const nExtras = graphEgs.length;
  for (let i = 0; i < nExtras; i++) {
    const graphEg = graphEgs[i];
    sizeEgs.push(graphEg.size);
  }
  return sizeEgs;
}

// Extract coords from graphEgs param; add to random
const graphEgsCoords = (graphEgs) => {
  let coordsEgs = [...coordsEgsInit];
  const nExtras = graphEgs.length;
  for (let i = 0; i < nExtras; i++) {
    const graphEg = graphEgs[i];
    coordsEgs.push(graphEg.coords);
  }
  return coordsEgs;
}

// Extract edges from graphEgs param; add to random
const graphEgsEdges = (graphEgs) => {
  let edgesEgs = [...edgesEgsInit];
  const nExtras = graphEgs.length;
  for (let i = 0; i < nExtras; i++) {
    const graphEg = graphEgs[i];
    edgesEgs.push(graphEg.edges);
  }
  return edgesEgs;
}

// Extract edges from graphEgs param; add to random
const graphEgsNames = (graphEgs) => {
  let namesEgs = [...namesEgsInit];
  const nExtras = graphEgs.length;
  for (let i = 0; i < nExtras; i++) {
    const graphEg = graphEgs[i];
    namesEgs.push(graphEg.name);
  }
  return namesEgs;
}

  // converts [1,2,3] into '1,2,3' etc
  const nums2Txt = (nums) => {
    if (nums === null) return '';
    let txt = ``;
    nums.forEach((n) => {
      txt += n + `,`;
    });
    txt = txt.substring(0,txt.length-1); // strip final `,`
    return txt;
  };

