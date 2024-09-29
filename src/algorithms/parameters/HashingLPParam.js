import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {
  genUniqueRandNumList,
  singleNumberValidCheck,
  successParamMsg,
  errorParamMsg,
  commaSeparatedPairTripleCheck,
  checkAllRangesValid,
} from './helpers/ParamHelper';
import { SMALL_SIZE, LARGE_SIZE } from '../controllers/HashingCommon';

// Algotiyhm information and magic phrases
const ALGORITHM_NAME = 'Hashing (linear probing)';
const HASHING_INSERT = 'Hashing Insertion';
const HASHING_SEARCH = 'Hashing Search';
const HASHING_EXAMPLE = 'PLACE HOLDER ERROR MESSAGE';

// Default inputs
const DEFAULT_ARRAY = genUniqueRandNumList(10, 1, 50);
const DEFAULT_SEARCH = 2

const UNCHECKED = {
    smallTable: false,
    largeTable: false
};

// Styling of radio buttons
const BlueRadio = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio {...props} />)

// Error messages
const ERROR_INVALID_INPUT_INSERT = 'Please enter a list containing positive integers, pairs or triples';
const ERROR_INVALID_INPUT_SEARCH = 'Please enter a positive integer';
const ERROR_TOO_LARGE = `Please enter the right amount of inputs`;
const ERROR_INVALID_RANGES = 'If you had entered ranges, please input valid ranges'

/**
 * Linear probing input component
 * @returns the component
 */
function HashingLPParam() {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [HASHSize, setHashSize] = useState({
    smallTable: true,
    largeTable: false,
  });

    /**
   * Handle changes to input
   * @param {*} e the input box component
   */
  const handleChange = (e) => {
    setHashSize({ ...UNCHECKED, [e.target.name]: true })
  }

  /**
   * Handle insert box inputs
   * @param {*} e the insert box component
   */
  const handleInsertion = (e) => {
    e.preventDefault();
    const inputs = e.target[0].value; // Get the value of the input

    // Check if the inputs are either positive integers, pairs or triples
    if (commaSeparatedPairTripleCheck(true, true, inputs)) {
      let values = inputs.split(","); // Converts input to array
      if (checkAllRangesValid(values)) {
        let hashSize = HASHSize.smallTable ? SMALL_SIZE : LARGE_SIZE; // Table size

        // Dispatch algo
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'HashingLP',
          mode: 'insertion',
          hashSize: hashSize,
          values
        });
        setMessage(successParamMsg(ALGORITHM_NAME));
      }
      else {
        setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_INVALID_RANGES));
      }
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_INVALID_INPUT_INSERT));
    }
  }

  /**
   * Handle search box input
   * @param {*} e search box component
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    let hashSize = HASHSize.smallTable ? SMALL_SIZE : LARGE_SIZE; // Table size

    const visualisers = algorithm.chunker.visualisers; // Visualizers from insertion
    if (singleNumberValidCheck(inputValue)) { // Check if input is a single positive number
      const target = parseInt(inputValue);

      // Dispatch algorithm
      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'HashingLP',
        mode: 'search',
        hashSize: hashSize,
        visualisers,
        target
      });
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_INVALID_INPUT_SEARCH));
    }
  }

  // Use effect to detect changes in radio box choice
  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [HASHSize],
  );


  return (
    <>
      <div className="form">
        <ListParam
          name="Hashing"
          buttonName="INSERT/DELETE"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL = {array}
          SET_VAL = {setArray}
          REFRESH_FUNCTION={
            (() => {
              if (HASHSize.smallTable) {
                return () => genUniqueRandNumList(SMALL_SIZE-1, 1, 50);
              }
              else if(HASHSize.largeTable) {
                return () => genUniqueRandNumList(LARGE_SIZE-1, 1, 100);
              }
            })()
          }
          ALGORITHM_NAME = {HASHING_INSERT}
          EXAMPLE={HASHING_EXAMPLE}
          handleSubmit={handleInsertion}
          setMessage={setMessage}
        />


        {<SingleValueParam
          name="Hashing"
          buttonName="SEARCH"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL = {DEFAULT_SEARCH}
          SET_VAL = {setSearch}
          ALGORITHM_NAME = {HASHING_SEARCH}
          handleSubmit={handleSearch}
          setMessage={setMessage}
         />}
      </div>

      <FormControlLabel
        control={
          <BlueRadio
            checked={HASHSize.smallTable}
            onChange={handleChange}
            name="smallTable"
          />
        }
        label="Small Table"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={HASHSize.largeTable}
            onChange={handleChange}
            name="largeTable"
          />
        }
        label="Larger Table"
        className="checkbox"
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default HashingLPParam;
