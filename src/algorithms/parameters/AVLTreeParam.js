// import React, { useState, useContext, useEffect } from 'react';
// import { GlobalContext } from '../../context/GlobalState';
// import { GlobalActions } from '../../context/actions';
// import ListParam from './helpers/ListParam';
// import SingleValueParam from './helpers/SingleValueParam';
// import '../../styles/Param.scss';
// import {
//     singleNumberValidCheck,
//     genUniqueRandNumList,
//     successParamMsg,
//     errorParamMsg,
// } from './helpers/ParamHelper';

// // import useParam from '../../context/useParam';

// const ALGORITHM_NAME = 'AVL Trees';
// const INSERTION = 'Insertion';
// const SEARCH = 'Search';

// // DEFAULT input - enough for a tree with a few levels
// // Should be the same as in REFRESH_FUNCTION
// const DEFAULT_NODES = genUniqueRandNumList(12, 1, 100);
// const DEFAULT_TARGET = '2';

// const INSERTION_EXAMPLE = 'Please follow the example provided: 1,2,3,4. Values should also be unique.';
// const SEARCH_EXAMPLE = 'Please follow the example provided: 16.';
// const NO_TREE_ERROR = 'Please build a tree before running search.';

// function AVLTreeParam() {
//     const { algorithm, dispatch } = useContext(GlobalContext);
//     const [message, setMessage] = useState(null);
//     const [nodes, setNodes] = useState(DEFAULT_NODES);


//     const handleInsertion = (e) => {
//         e.preventDefault();
//         const list = e.target[0].value;

//         if (validateListInput(list)) {
//             let nodes = list.split(',').map(Number);
//             // run search animation
//             dispatch(GlobalActions.RUN_ALGORITHM, {
//                 name: 'AVLTree',
//                 mode: 'insertion',
//                 nodes,
//             });
//             setMessage(successParamMsg(ALGORITHM_NAME));
//         } else {
//             setMessage(errorParamMsg(ALGORITHM_NAME, INSERTION_EXAMPLE));
//         }
//     };
//     const handleSearch = (e) => {
//         e.preventDefault();
//         const inputValue = e.target[0].value;

//         if (singleNumberValidCheck(inputValue)) {
//             const target = parseInt(inputValue, 10);

//             if (
//                 Object.prototype.hasOwnProperty.call(algorithm, 'visualisers')
//                 && !algorithm.visualisers.tree.instance.isEmpty()
//             ) {
//                 const visualiser = algorithm.chunker.visualisers;
//                 dispatch(GlobalActions.RUN_ALGORITHM, {
//                     name: 'AVLTree',
//                     mode: 'search',
//                     visualiser,
//                     target,
//                 });
//                 setMessage(successParamMsg(ALGORITHM_NAME));
//             } else {
//                 setMessage(errorParamMsg(ALGORITHM_NAME, NO_TREE_ERROR));
//             }
//         }
//         else {
//             setMessage(errorParamMsg(ALGORITHM_NAME, SEARCH_EXAMPLE));
//         }
//     };

//     return (
//         <>
//             <div className="form">
//                 {/* Insert input */}
//                 <ListParam
//                     name="AVLTree"
//                     buttonName="Insert"
//                     mode="insertion"
//                     formClassName="formLeft"
//                     DEFAULT_VAL={nodes}
//                     handleSubmit={handleInsertion}
//                     SET_VAL={setNodes}
//                     REFRESH_FUNCTION={(() => genUniqueRandNumList(12, 1, 100))}
//                     ALGORITHM_NAME={INSERTION}
//                     EXAMPLE={INSERTION_EXAMPLE}
//                     setMessage={setMessage}
//                 />

//                 {/* Search input */}
//                 {<SingleValueParam
//                     name="AVLTree"
//                     buttonName="Search"
//                     mode="search"
//                     formClassName="formRight"
//                     handleSubmit={handleSearch}
//                     DEFAULT_VAL={DEFAULT_TARGET}
//                     ALGORITHM_NAME={SEARCH}
//                     EXAMPLE={SEARCH_EXAMPLE}
//                     setMessage={setMessage}
//                 />}
//             </div>
//             {/* render success/error message */}
//             {message}
//         </>
//     );
// }

// export default AVLTreeParam;

// function validateListInput(input) {
//     const inputArr = input.split(',');
//     const inputSet = new Set(inputArr);
//     return (
//         inputArr.length === inputSet.size
//         && inputArr.every((num) => singleNumberValidCheck(num))
//     );
// }

/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {
    singleNumberValidCheck,
    genRandNumList,
    successParamMsg,
    errorParamMsg,
    balanceBSTArray,
    shuffleArray,
} from './helpers/ParamHelper';

// import useParam from '../../context/useParam';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';
const SEARCH_EXAMPLE = 'Please follow the example provided: 16';
const UNCHECKED = {
    random: false,
    sorted: false,
    balanced: false,
};

const BlueRadio = withStyles({
    root: {
        color: '#2289ff',
        '&$checked': {
            color: '#027aff',
        },
    },
    checked: {},
    // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio {...props} />);

function AVLTreeParam() {
    const { algorithm, dispatch } = useContext(GlobalContext);
    const [message, setMessage] = useState(null);
    const [nodes, setNodes] = useState(DEFAULT_NODES);
    const [avlCase, setAVLCase] = useState({
        random: true,
        sorted: false,
        balanced: false,
    });

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'random':
                setNodes(shuffleArray(nodes));
                break;
            case 'sorted':
                setNodes([...nodes].sort((a, b) => a - b));
                break;
            case 'balanced':
                setNodes(balanceBSTArray([...nodes].sort((a, b) => a - b)));
                break;
            default:
        }

        setAVLCase({ ...UNCHECKED, [e.target.name]: true });
    };
    /**
     * For BST, since we need to insert nodes before run the search algorithm,
     * therefore we need some extra check to make sure the tree is not empty.
     * So we need to implement a new handle function instead of using the default one.
     */
    const handleSearch = (e) => {
        e.preventDefault();
        const inputValue = e.target[0].value;

        if (singleNumberValidCheck(inputValue)) {
            const target = parseInt(inputValue, 10);
            // make sure the tree is not empty
            if (
                algorithm.hasOwnProperty('visualisers')
                && !algorithm.visualisers.graph.instance.isEmpty()
            ) {
                const visualiser = algorithm.chunker.visualisers;
                // run search animation
                dispatch(GlobalActions.RUN_ALGORITHM, {
                    name: 'AVLTree',
                    mode: 'search',
                    visualiser,
                    target,
                });
                setMessage(successParamMsg(SEARCH));
            } else {
                // when the tree is &nbsp;&nbsp;empty
                setMessage(
                    errorParamMsg(
                        SEARCH,
                        undefined,
                        'Please fully build the tree before running a search.',
                    ),
                );
            }
        } else {
            // when the input cannot be converted to a number
            setMessage(errorParamMsg(SEARCH, SEARCH_EXAMPLE));
        }
    };

    useEffect(
        () => {
            document.getElementById('startBtnGrp').click();
        },
        [avlCase],
    );

    return (
        <>
            <div className="form">
                {/* Insert input */}
                <ListParam
                    name="AVLTree"
                    buttonName="Insert"
                    mode="insertion"
                    formClassName="formLeft"
                    DEFAULT_VAL={(() => {
                        if (avlCase.balanced) {
                            return balanceBSTArray([...nodes].sort((a, b) => a - b));
                        } if (avlCase.sorted) {
                            return [...nodes].sort((a, b) => a - b);
                        }
                        return nodes;
                    })()}
                    SET_VAL={setNodes}
                    ALGORITHM_NAME={INSERTION}
                    EXAMPLE={INSERTION_EXAMPLE}
                    setMessage={setMessage}
                />

                {/* Search input */}
                <SingleValueParam
                    name="AVLTree"
                    buttonName="Search"
                    mode="search"
                    formClassName="formRight"
                    DEFAULT_VAL={DEFAULT_TARGET}
                    ALGORITHM_NAME={SEARCH}
                    EXAMPLE={SEARCH_EXAMPLE}
                    handleSubmit={handleSearch}
                    setMessage={setMessage}
                />
            </div>
            <span className="generalText">Choose type of tree: &nbsp;&nbsp;</span>
            <FormControlLabel
                control={(
                    <BlueRadio
                        checked={avlCase.random}
                        onChange={handleChange}
                        name="random"
                    />
                )}
                label="Random"
                className="checkbox"
            />
            <FormControlLabel
                control={(
                    <BlueRadio
                        checked={avlCase.sorted}
                        onChange={handleChange}
                        name="sorted"
                    />
                )}
                label="Sorted"
                className="checkbox"
            />
            <FormControlLabel
                control={(
                    <BlueRadio
                        checked={avlCase.balanced}
                        onChange={handleChange}
                        name="balanced"
                    />
                )}
                label="Balanced"
                className="checkbox"
            />
            {/* render success/error message */}
            {message}
        </>
    );
}

export default AVLTreeParam;
