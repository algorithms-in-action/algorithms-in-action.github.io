/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import EuclideanMatrixParams from './helpers/EuclideanMatrixParams';
import '../../styles/Param.scss';

const DEFAULT_SIZE = 5;
const PRIMS = 'New Prim\'s';
// XXX fix up error messages some time
const PRIMS_EXAMPLE = 'Please enter positive edge weights (or 0 for no edge)';
const PRIMS_EXAMPLE2 = 'Please enter the symmetrical value in matrix';
function PRIMParam() {
  const [message, setMessage] = useState(null);

  return (
    <>
      {/* Matrix input */}
      <EuclideanMatrixParams
        name="prim"
        mode="find"
        defaultSize={DEFAULT_SIZE}
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
