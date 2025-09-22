/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import MatrixParam from './helpers/MatrixParam';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams, addURLGraph } from './helpers/urlHelpers'
import { EXAMPLES } from './helpers/ErrorExampleStrings';

const DEFAULT_SIZE = 4; // gets overwritten by GRAPH_EGS[0] now
const DEFAULT_START = null; // disable
const DEFAULT_END = null; // disable
const DEFAULT_HEUR = null; // disable
const DEFAULT_WEIGHT = 2; // weights "as input"
const TRANSITIVE_CLOSURE = 'Transitive Closure';
const TRANSITIVE_CLOSURE_EXAMPLE = EXAMPLES.GEN_NUMBERS_BETWEEN_0_1;
const GRAPH_EGS = [ // XXX think up better examples?
        { name: 'Graph 1',
          size: 4,
          coords: '10-13,20-13,20-3,10-3',
          edges: '1-1,2-2,3-3,4-4,1-2,2-3,3-4'
        },
        { name: 'Graph 2',
          size: 4,
          coords: '10-13,20-13,20-3,10-3',
          edges: '1-1,2-2,3-3,4-4,1-3,2-1,3-2,4-3'
        },
        { name: 'Graph 3',
          size: 5,
          coords: '6-9,15-16,20-10,17-2,8-2',
          edges: '1-2,2-1,2-3,3-4,4-5,5-3'
        }];

function TransitiveClosureParam({ mode, xyCoords, edgeWeights, size, start, end, heuristic, min, max }) {
  const [message, setMessage] = useState(null);
  let [start1, size1, graph_egs] =
         addURLGraph(GRAPH_EGS, xyCoords, edgeWeights, start, DEFAULT_START);

  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="transitiveClosure"
        mode="tc"
        defaultSize={ size1 }
        defaultStart={ start1 }
        defaultEnd={DEFAULT_END}
        defaultWeight = {DEFAULT_WEIGHT}
        defaultHeur = {DEFAULT_HEUR}
        min={min || 1}
        max={max || 49}
        graphEgs={ graph_egs }
        ALGORITHM_NAME={TRANSITIVE_CLOSURE}
        EXAMPLE={TRANSITIVE_CLOSURE_EXAMPLE}
        setMessage={setMessage}
        symmetric={false}
        circular={true}
        unweighted
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
TransitiveClosureParam.propTypes = {
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

export default withAlgorithmParams(TransitiveClosureParam); // Export with the wrapper for URL Params
