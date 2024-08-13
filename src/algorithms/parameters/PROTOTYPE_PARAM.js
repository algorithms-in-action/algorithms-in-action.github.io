/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { genRandNumList } from './helpers/ParamHelper';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const PROTOTYPE = 'Prototype';
const EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';

function PROTOTYPE_PARAM() {
    const [message, setMessage] = useState(null);
    const [nodes, setNodes] = useState(DEFAULT_NODES);

    return (
        <>
            <div className="form">
                <ListParam
                    name="PROTOTYPE"
                    buttonName="Sort"
                    mode="sort"
                    formClassName="formLeft"
                    DEFAULT_VAL={nodes}
                    SET_VAL={setNodes}
                    ALGORITHM_NAME={PROTOTYPE}
                    EXAMPLE={EXAMPLE}
                    setMessage={setMessage}
                />
            </div>

            {/* render success/error message */}
            {message}
        </>
    );
}

export default {PROTOTYPE_PARAM};
