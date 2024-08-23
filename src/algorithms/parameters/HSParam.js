/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import ListParam from './helpers/ListParam.js';
import PropTypes from 'prop-types'; // Import PropTypes
import { withAlgorithmParams } from './helpers/urlHelpers'
function HeapsortParam({ alg, mode, list }) {
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
                    mode={mode}
                    formClassName="formLeft"
                    DEFAULT_VAL={nodes}
                    SET_VAL={setNodes}
                    ALGORITHM_NAME="Heap Sort"
                    EXAMPLE="Please follow the example provided: 0,1,2,3,4"
                    setMessage={setMessage}
                />
            </div>
            {message}
        </>
    );
}

// Define the prop types
HeapsortParam.propTypes = {
    alg: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    list: PropTypes.string.isRequired
};

export default withAlgorithmParams(HeapsortParam);


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
