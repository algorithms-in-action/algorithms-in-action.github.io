import React, { useState } from 'react';
import '../../styles/Param.scss';
import ListParam from "./helpers/ListParam";
import {genRandNumList} from "./helpers/ParamHelper";

const DEFAULT_LIST = genRandNumList(10, 1, 100);
const PROTOTYPE_TEXT = 'Linked List Prototype';
const EXAMPLE_TEXT = 'PARAMETER/example';

function PrototypeParam() {

    const [message, setMessage] = useState(null);
    const [values, setValues] = useState(DEFAULT_LIST);

    return (
        <>
            <div className="form">
                    <ListParam
                    name='Linked List Prototype'
                    buttonName="Sort"
                    mode="sort"
                    formClassName="formLeft"
                    DEFAULT_VAL={values}
                    SET_VAL={setValues}
                    ALGORITHM_NAME={PROTOTYPE_TEXT}
                    EXAMPLE={EXAMPLE_TEXT}
                    setMessage={setMessage}
                />
            </div>

            {/* render success/error message */}
            {message}
        </>
    );
}

export default PrototypeParam;