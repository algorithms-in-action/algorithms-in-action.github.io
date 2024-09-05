/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam.js';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const HEAP_SORT = 'Heap Sort';
const HEAP_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function HeapsortParam({ mode, list }) { // add the parsing parameters for your algorithm: alg, mode, ...params
    // const { alg, mode, param } = useUrlParams();
    // const {list, value, xyCoords, edgeWeights, start, end, string, pattern, union} = parseParam(param);
    // const { alg, mode, list } = withAlgorithmParams(HeapsortParam);
    const [nodes, setNodes] = useState(list);
    const [message, setMessage] = useState(null);

    return (
        <>
            <div className="form">
                <ListParam
                    name="heapSort"
                    buttonName="Sort"
                    mode="sort"
                    formClassName="formLeft"
                    DEFAULT_VAL={nodes}
                    SET_VAL={setNodes}
                    ALGORITHM_NAME={HEAP_SORT}
                    EXAMPLE={HEAP_SORT_EXAMPLE}
                    setMessage={setMessage}
                />
            </div>
            {message}
        </>
    );
}

// Define the prop types for URL Params
HeapsortParam.propTypes = {
    alg: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    list: PropTypes.string.isRequired
};

export default withAlgorithmParams(HeapsortParam); // Export with the wrapper for URL Params


// function HeapsortParam() {
//   const [message, setMessage] = useState(null);
//   const [nodes, setNodes] = useState(DEFAULT_NODES);

//   return (
//     <>
//       <div className="form">
//         <ListParam
//           name="heapSort"
//           buttonName="Sort"
//           mode="sort"
//           formClassName="formLeft"
//           DEFAULT_VAL={nodes}
//           SET_VAL={setNodes}
//           ALGORITHM_NAME={HEAP_SORT}
//           EXAMPLE={HEAP_SORT_EXAMPLE}
//           setMessage={setMessage}
//         />
//       </div>

//       {/* render success/error message */}
//       {message}
//     </>
//   );
// }

// export default HeapsortParam;
