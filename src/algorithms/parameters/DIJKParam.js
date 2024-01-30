/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../../styles/Param.scss';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';

const DEFAULT_START = 1; // XXX null should disable
const DEFAULT_END = null; // disable end nodes display/input
const DEFAULT_SIZE = 5;
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
const DIJK = 'Dijkstra\'s';
const DIJK_EXAMPLE = 'Please provided positive numbers: 0,1'; //TODO
const DIJK_EXAMPLE2 = 'Please enter the symmetrical value in matrix'; //TODO
function DijkstraParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="dijkstra"
        mode="find"
        defaultSize={DEFAULT_SIZE}
        defaultStart={DEFAULT_START}
        defaultEnd={DEFAULT_END}
        graphEgs={GRAPH_EGS}
        min={0}
        max={9}
        symmetric
        ALGORITHM_NAME={DIJK}
        EXAMPLE={DIJK_EXAMPLE}
        EXAMPLE2={DIJK_EXAMPLE2}
        setMessage={setMessage}
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default DijkstraParam;
