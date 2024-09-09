/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

const DEFAULT_SIZE = 5;
const DFS = 'DFS\'s';
const DFS_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const DFS_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
const DEFAULT_START = 5; // XXX null should disable
// const DEFAULT_END = null; // disable end nodes display/input
// XXX For now we support at most one end node
// const DEFAULT_END = [8,9] // XXX not currently supported
const DEFAULT_END = [0] // enable end node but start with none
// const DEFAULT_END = [10] // start with 10 as end node
const DEFAULT_HEUR = null;  // disable heuristic display/input
// const DEFAULT_HEUR = 0;  // 0 = Euclidean
const GRAPH_EGS = [ // XXX think up better examples?
        { name: 'Graph 1',
          size: 14,
          coords: '4-3,2-7,7-11,9-3,12-6,13-2,12-16,17-2,20-4,34-4,26-9,30-6,34-10,38-5',
          edges: '1-2-3,1-4-6,2-3-4,3-4-2,3-5-4,4-5-3,5-6-2,5-7-10,6-8-5,7-11-10,8-9-6,9-10-3,10-12-8,11-12-5,12-13-3,13-14-4'
        },
        { name: 'Graph 2',
          size: 17,
          coords: '2-13,6-6,7-11,9-15,12-2,15-6,16-12,19-5,25-7,23-16,28-14,29-10,35-13,36-6,40-15, 39-2,42-10',
          edges:
'1-2-10,1-4-4,2-3-6,3-4-10,3-5-5,4-7-3,5-6-7,6-7-8,7-8-2,7-9,8-9-3,9-10-5,9-11-7, 10-11-7,11-13-4,12-13-8,12-14-6,13-14-7,13-15-7,14-16-6,15-16-2,15-17-5,16-17-2'
        }];

function DFSParam({ mode, xyCoords, edgeWeights, size, start, end, heuristic, min, max }) {
  const [message, setMessage] = useState(null);
  const graph_egs = [
    { name: 'URL Input Graph',
      size: size || GRAPH_EGS[0].size,
      coords: xyCoords || GRAPH_EGS[0].coords,
      edges: edgeWeights || GRAPH_EGS[0].edges
    }
    ]
  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="DFS"
        mode= "find"
        defaultSize={ size || DEFAULT_SIZE }
        defaultStart={start || DEFAULT_START }
        defaultHeur = {heuristic || DEFAULT_HEUR }
        defaultEnd={ end || DEFAULT_END }
        min={ min || 1 }
        max={ max || 49 }
        graphEgs={graph_egs || GRAPH_EGS}
        symmetric
        ALGORITHM_NAME={DFS}
        EXAMPLE={DFS_EXAMPLE}
        EXAMPLE2={DFS_EXAMPLE2}
        setMessage={setMessage} 
        unweighted
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
DFSParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  heuristic: PropTypes.string.isRequired,
  xyCoords: PropTypes.string.isRequired,
  edgeWeights: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
};

export default withAlgorithmParams(DFSParam); // Export with the wrapper for URL Params


