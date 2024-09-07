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
  commaSeparatedNumberListValidCheck,
  singleNumberValidCheck,
  successParamMsg,
  errorParamMsg,
} from './helpers/ParamHelper';

const ALGORITHM_NAME = 'Hashing (linear probing)';
const HASHING_INSERT = 'Hashing Insertion';
const HASHING_SEARCH = 'Hashing Search';
const HASHING_EXAMPLE = 'PLACE HOLDER ERROR MESSAGE';

const DEFAULT_ARRAY = genUniqueRandNumList(10, 1, 50);
const DEFAULT_SEARCH = 2
const UNCHECKED = {
    smallTable: false,
    largeTable: false
};
const SMALL_TABLE = 11;
const LARGE_TABLE = 97;

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


const ERROR_INPUT = 'Please enter only positive integers';
const ERROR_TOO_LARGE = `Please enter the right number of digits`;


function HashingLPParam() {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [HASHSize, setHashSize] = useState({
    smallTable: true,
    largeTable: false,
  });

  const handleChange = (e) => {
    setHashSize({ ...UNCHECKED, [e.target.name]: true })
  }

  const handleInsertion = (e) => {
    e.preventDefault();
    const inputs = e.target[0].value;

    if (commaSeparatedNumberListValidCheck(inputs)) {
      let values = inputs.split(',').map(Number);
      let hashSize = HASHSize.smallTable ? SMALL_TABLE : LARGE_TABLE;

      if (values.length < hashSize) {
        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'HashingLP',
          mode: 'insertion',
          hashSize: hashSize,
          values
        });
        setMessage(successParamMsg(ALGORITHM_NAME));
      } else {
        setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_TOO_LARGE));
      }
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_INPUT));
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    const visualisers = algorithm.chunker.visualisers;
    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue);

      dispatch(GlobalActions.RUN_ALGORITHM, {
        name: 'HashingLP',
        mode: 'search',
        visualisers,
        target
      });
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, ERROR_INPUT));
    }
  }

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
          buttonName="INSERT"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL = {array}
          SET_VAL = {setArray}
          REFRESH_FUNCTION={
            (() => {
              if (HASHSize.smallTable) {
                return () => genUniqueRandNumList(SMALL_TABLE-1, 1, 50);
              }
              else if(HASHSize.largeTable) {
                return () => genUniqueRandNumList(LARGE_TABLE-1, 1, 100);
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
        label="Large Table"
        className="checkbox"
      />

      {/* render success/error message */}
      {message}
    </>
  );
}

export default HashingLPParam;
