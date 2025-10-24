/* eslint-disable no-unused-vars */
// XXX copied from DFSrec - may need more mods
import React, { useState } from 'react';
import MatrixParam from './helpers/MatrixParam';
import '../../styles/Param.scss';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams, addURLGraph } from './helpers/urlHelpers'
import { EXAMPLES } from './helpers/ErrorExampleStrings';

const DEFAULT_SIZE = 5;
const gwrap = 'ConxexHull'; // is this used anywhere???
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
          size: 7,
          coords: '33-10,2-7,11-7,14-11,22-7,19-4,21-15',
          // coords: '4-3,2-7,7-11,9-3,12-6,13-2,12-16,17-2,20-4,34-4,26-9,30-6,34-10,38-5',
          edges: ''
        },
        { name: 'Graph 2',
          size: 17,
          coords: '2-13,6-6,7-11,9-15,12-2,15-6,16-12,19-5,25-7,23-16,28-14,29-10,35-13,36-6,40-15, 39-2,42-10',
          edges: ''
        }];

function gwrapParam({ mode, xyCoords, edgeWeights, size, start, end, heuristic, min, max }) {
  const [message, setMessage] = useState(null);
  let [start1, size1, graph_egs] =
         addURLGraph(GRAPH_EGS, xyCoords, edgeWeights, start, DEFAULT_START);

  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="gwrap"
        mode="find"
        defaultSize={ size1 }
        defaultStart={ start1 }
        defaultHeur = {DEFAULT_HEUR}
        defaultEnd={end || DEFAULT_END}
        min={min || 1}
        max={max || 49}
        graphEgs={graph_egs}
        symmetric
        ALGORITHM_NAME={gwrap}
        EXAMPLE={EXAMPLES.GEN_NUMBERS_BETWEEN_0_1}
        EXAMPLE2={EXAMPLES.GEN_SYMMETRIC_MATRIX}
        setMessage={setMessage} 
        unweighted
      />

      {/* render success/error message */}
      {message}
    </>
  );
}    


// Define the prop types for URL Params
gwrapParam.propTypes = {
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

export default withAlgorithmParams(gwrapParam); // Export with the wrapper for URL Params
