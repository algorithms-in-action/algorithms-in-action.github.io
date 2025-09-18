import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';
import ListParam from './helpers/ListParam';
import { URLContext } from '../../context/urlState';

const DEFAULT_ARRAY_GENERATOR = genRandNumList.bind(null, 12, 1, 99);
const DEFAULT_ARR = DEFAULT_ARRAY_GENERATOR();

function insertionSortParam({ list }){
    const [array, setArray] = useState(list || DEFAULT_ARR);
    const { setNodes } = useContext(URLContext);

    useEffect(() => { setNodes(array); }, [array]);

    return(

        <div className="form">
            <ListParam
                name = "insertionSort"
                buttonName="Reset"
                mode = "sort"
                formClassName="formLeft"
                DEFAULT_VAL={array}
                SET_VAL={setArray}
            />
        </div>
    );
}

insertionSortParam.propTypes = {
  list: PropTypes.string.isRequired
};

export default withAlgorithmParams(insertionSortParam);
