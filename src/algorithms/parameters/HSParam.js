/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { genRandNumList } from './helpers/ParamHelper';

import ListParam from './helpers/ListParam.js';
import PropTypes from 'prop-types'; // Import this for URL Param
import { withAlgorithmParams } from './helpers/urlHelpers' // Import this for URL Param

import { GlobalContext } from '../../context/GlobalState';
import '../../styles/Param.scss';


const DEFAULT_NODES = genRandNumList(10, 1, 100);
const HEAP_SORT = 'Heap Sort';
const HEAP_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';


function HeapsortParam({ list }) { // add the parsing parameters for your algorithm: alg, mode, ...params
    // const { alg, mode, param } = useUrlParams();
    // const {list, value, xyCoords, edgeWeights, start, end, string, pattern, union} = parseParam(param);
    // const { alg, mode, list } = withAlgorithmParams(HeapsortParam);
    const DEFAULT_NODES = genRandNumList.bind(null, 12, 1, 50); // Define the default list of nodes
    const [localNodes, setLocalNodes] = useState(list || DEFAULT_NODES);
    const [message, setMessage] = useState(null);
    const { nodes, setNodes } = useContext(GlobalContext);
  
    useEffect(() => {
      setNodes(localNodes); // Sync with global state
    }, [localNodes, setNodes]);
  
    return (
        <>
            <div className="form">
                <ListParam
                    name="heapSort"
                    buttonName="Sort"
                    mode="sort"
                    formClassName="formLeft"
                    DEFAULT_VAL={localNodes}
                    SET_VAL={setLocalNodes}
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
    mode: PropTypes.string,
    list: PropTypes.string
};

export default withAlgorithmParams(HeapsortParam); // Export with the wrapper for URL Params
