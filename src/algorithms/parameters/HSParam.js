/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import ListParam from './helpers/ListParam.js';
import { parseNodes, useUrlParams } from './helpers/urlHelpers'; // Assume these functions are exported from a helper file
import algorithms from '../../algorithms';
function HeapsortParam() {
    const { alg, mode, param } = useUrlParams();
    const initialNodes = parseNodes(param);
    const [nodes, setNodes] = useState(initialNodes);
    const [message, setMessage] = useState(null);

    console.log("Component State:", { alg, mode, nodes });  // Final check before rendering
    if (!alg || !mode || !(alg in algorithms && mode in algorithms[alg].pseudocode)) {
        return <div>Invalid algorithm or mode specified</div>;
    }

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

export default HeapsortParam;


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
