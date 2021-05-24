/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
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

const BlueCheckbox = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox {...props} />);

function BSTParam() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [bstCase, setBSTCase] = useState({
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

    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
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
      if (algorithm.hasOwnProperty('visualisers') && !algorithm.visualisers.graph.instance.isEmpty()) {
        const visualiser = algorithm.chunker.visualisers;
        // run search animation
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'binarySearchTree', mode: 'search', visualiser, target,
        });
        setMessage(successParamMsg(SEARCH));
      } else {
        // when the tree is &nbsp;&nbsp;empty
        setMessage(errorParamMsg(SEARCH, undefined, 'Please fully build the tree before running a search.'));
      }
    } else {
      // when the input cannot be converted to a number
      setMessage(errorParamMsg(SEARCH, SEARCH_EXAMPLE));
    }
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          name="binarySearchTree"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={nodes}
          SET_VAL={setNodes}
          ALGORITHM_NAME={INSERTION}
          EXAMPLE={INSERTION_EXAMPLE}
          setMessage={setMessage}
        />

        {/* Search input */}
        <SingleValueParam
          name="binarySearchTree"
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
      Choose type of tree: &nbsp;&nbsp;
      <FormControlLabel
        control={<BlueCheckbox checked={bstCase.random} onChange={handleChange} name="random" />}
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={<BlueCheckbox checked={bstCase.sorted} onChange={handleChange} name="sorted" />}
        label="Sorted"
        className="checkbox"
      />
      <FormControlLabel
        control={<BlueCheckbox checked={bstCase.balanced} onChange={handleChange} name="balanced" />}
        label="Balanced"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

export default BSTParam;
