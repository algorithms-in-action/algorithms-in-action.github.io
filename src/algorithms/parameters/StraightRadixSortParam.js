/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { URLContext } from '../../context/urlState';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers';
import '../../styles/Param.scss';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_MODE = 'sort';
const Straight_RADIX_SORT = 'Straight Radix Sort';
const MSDRS_SORT_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function StraightRadixSortParam({ mode, list }) {
    const [message, setMessage] = useState(null);
    const [localNodes, setLocalNodes] = useState(list || DEFAULT_NODES);
    const { setNodes } = useContext(URLContext);

    useEffect(() => {
        setNodes(localNodes);
    }, [localNodes]);

    return (
        <>
            <div className="form">
                <ListParam
                    name="radixSortStraight"
                    buttonName="Sort"
                    mode={mode || DEFAULT_MODE}
                    formClassName="formLeft"
                    DEFAULT_VAL={localNodes}
                    SET_VAL={setLocalNodes}
                    ALGORITHM_NAME={Straight_RADIX_SORT}
                    EXAMPLE={MSDRS_SORT_EXAMPLE}
                    setMessage={setMessage}
                />
            </div>

            {/* render success/error message */}
            {message}
        </>
    );
}

StraightRadixSortParam.propTypes = {
    alg: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    list: PropTypes.string.isRequired,
}

export default withAlgorithmParams(StraightRadixSortParam);
