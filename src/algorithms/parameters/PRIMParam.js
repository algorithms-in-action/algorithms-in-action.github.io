/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const DEFAULT_START = 1; // XXX null should disable
const DEFAULT_END = null; // disable end nodes display/input
// const DEFAULT_END = [2,4]
const PRIMS = 'New Prim\'s';
// XXX fix up error messages some time and change from 'EXAMPLE'
const PRIMS_EXAMPLE = 'Please enter positive edge weights (or 0 for no edge)';
const PRIMS_EXAMPLE2 = 'Please enter the symmetrical value in matrix';
const GRAPH_EGS = [ // XXX think up better examples
        { name: 'Example 1',
          size: 5,
          coords: '5-5, 15-15, 25-13, 30-4, 45-15',
          edges: '1-2,1-4,2-3,2-4,1-5-9,4-5,3-5'
        },
        { name: 'Example 2',
          size: 4,
          coords: '5-9, 15-15, 23-4, 32-12',
          edges: '1-3-5,1-4-4,3-4,2-4-4'
        }];

const SIZE_EG1 = 5;
const COORDS_TXT_EG1 = '5-5, 15-18, 25-16, 35-4, 45-20';
const EDGES_TXT_EG1 = '1-2,1-4,2-3,2-4,1-5-9,4-5,3-5';

const SIZE_EG2 = 4;
const COORDS_TXT_EG2 = '5-10, 15-20, 23-4, 32-17';
const EDGES_TXT_EG2 = '1-3-5,1-4-4,3-4,2-4-4';

function PRIMParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="prim"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        defaultStart={DEFAULT_START}
        defaultEnd={DEFAULT_END}
        // XXX
        // min&max for weights originally, then used for X&Y coordinates
        // as well (DOH!) (maybe avoid for weights in the future but
        // beware legacy use of min and max in weight-related code!)
        // Best avoid 0 so we don't get edges along axes.
        // max around 50 ideal *if we can fix size of display* so it fits ok
        // - means precision is reasonably but both Manhattan and
        // Euclidean distances are at most two digits. Using something
        // smaller for now due to display size being a mystery...
        min={1}
        // max={9}
        max={49}
        graphEgs={GRAPH_EGS}
        symmetric
        ALGORITHM_NAME={PRIMS}
        EXAMPLE={PRIMS_EXAMPLE}
        EXAMPLE2={PRIMS_EXAMPLE2}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default PRIMParam;
