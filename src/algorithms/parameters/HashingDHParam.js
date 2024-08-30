import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {genUniqueRandNumList} from './helpers/ParamHelper';

// import useParam from '../../context/useParam';

const ALGORITHM_NAME = 'Hashing';
const HASHING_INSERT = 'Hashing Insertion';
const HASHING_SEARCH = 'Hashing Search';
const HASHING_EXAMPLE = 'PLACE HOLDER ERROR MESSAGE';

const DEFAULT_ARRAY = genUniqueRandNumList(10, 1, 50);
const DEFAULT_SEARCH = '...'
const UNCHECKED = {
    smallTable: false,
    largeTable: false
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
})((props) => <Radio {...props} />)


//const ERROR_INPUT = 'Please enter only positive integers';
//const ERROR_TOO_LARGE = `Please enter only ${HASHING_FUNCTION} digits in the table`;


function HashingDHParam() {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [size, setSize] = useState({
    smallTable: true,
    largeTable: false,
  });

  const handleChange = (e) => {
    // setSize({ ...UNCHECKED, [e.target.name]: true })
    e.preventDefault();
    const inputValue = e.target[0].value;

    // const visualiser = algorithm.chunker.visualisers;
    dispatch(GlobalActions.RUN_ALGORITHM, {
      name: 'HashingDH',
      mode: 'hash',
      // visualiser,
    });
  }

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [size],
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
          ALGORITHM_NAME = {HASHING_INSERT}
          EXAMPLE={HASHING_EXAMPLE}
          handleSubmit={handleChange}
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
          setMessage={setMessage}
         />}
      </div>

      <FormControlLabel
        control={
          <BlueRadio
            checked={size.smallTable}
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
            checked={size.largeTable}
            onChange={handleChange}
            name="largeTable"
          />
        }
        label="Large Table"
        className="checkbox"
      />
    </>
  );
}

export default HashingDHParam;
