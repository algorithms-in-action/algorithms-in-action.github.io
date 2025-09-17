import PropTypes from 'prop-types';
import { withAlgorithmParams } from './helpers/urlHelpers'

import { URLContext } from '../../context/urlState.js';

import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import { singleNumberValidCheck, commaSeparatedPairTripleCheck, checkAllRangesValid, commaSeparatedNumberListValidCheck } from './helpers/InputValidators';
import { genUniqueRandNumList } from './helpers/InputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';

import { SMALL_SIZE, LARGE_SIZE } from '../controllers/HashingCommon';
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';

// Algorithm information and magic phrases
const ALGORITHM_NAME = 'Hashing (linear probing)';
const HASHING_INSERT = 'Hashing Insertion';
const HASHING_SEARCH = 'Hashing Search';

// Default inputs
const DEFAULT_ARRAY = genUniqueRandNumList(10, 1, 50);
const DEFAULT_SEARCH = 2

const UNCHECKED = {
    smallTable: false,
    largeTable: false
};

const DEFAULT_EXPAND = false;

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

function HashingLPParam({ mode, list, value }) {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [array, setLocalArray] = useState(list || DEFAULT_ARRAY);
  const [search, setLocalSearch] = useState(DEFAULT_SEARCH);
  const [HASHSize, setHashSize] = useState({
    smallTable: true,
    largeTable: false,
  });
  const [expand, setExpand] = useState(DEFAULT_EXPAND);
  const { setNodes, setSearchValue } = useContext(URLContext);

  useEffect(() => {
    setNodes(array);
    setSearchValue(search);
  }, [array, search])

  const handleChange = (e) => {
    setHashSize({ ...UNCHECKED, [e.target.name]: true })
  }

  const handleExpand = (e) => {
    setExpand(!expand)
  }

  const handleInsertion = (e) => {
    e.preventDefault();
    const inputs = e.target[0].value;

    let removeSpace = inputs.split(' ').join('');

    const { valid, error } = commaSeparatedNumberListValidCheck(inputs.replace(/\s+/g, ''));

    if (!valid) {
      setMessage(errorParamMsg(error, EXAMPLES.HASHING_INSERT));
      return;
    }
    else if (commaSeparatedPairTripleCheck(true, true, removeSpace)) {
      let values = removeSpace.split(",");
      if (checkAllRangesValid(values)) {
        let hashSize = HASHSize.smallTable ? SMALL_SIZE : LARGE_SIZE;

        dispatch(GlobalActions.RUN_ALGORITHM, {
          name: 'HashingLP',
          mode: 'insertion',
          hashSize: hashSize,
          values,
          expand: expand
        });

        setMessage(null);
      }
      else {
        setMessage(errorParamMsg(ERRORS.GEN_INVALID_RANGES, EXAMPLES.HASHING_INSERT));
      }
    } else {
      setMessage(errorParamMsg(ERRORS.GEN_PAIR_TRIPLES_POS_INT, EXAMPLES.HASHING_INSERT));
    }
  }

const handleSearch = (e) => {
  e.preventDefault();
  const inputValue = e.target[0].value;
  let hashSize = HASHSize.smallTable ? SMALL_SIZE : LARGE_SIZE;

  const visualisers = algorithm?.chunker?.visualisers;
  const check = singleNumberValidCheck(inputValue);

  if (check.valid) {
    const target = parseInt(inputValue);

    dispatch(GlobalActions.RUN_ALGORITHM, {
      name: 'HashingLP',
      mode: 'search',
      hashSize: hashSize,
      visualisers,
      target,
    });
    setMessage(null);
  } else {
    setMessage(errorParamMsg(check.error, EXAMPLES.HASHING_INSERT));
  }
};

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [HASHSize],
  );

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [expand],
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
          SET_VAL = {setLocalArray}
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
          EXAMPLE={EXAMPLES.HASHING_INSERT}
          handleSubmit={handleInsertion}
          setMessage={setMessage}
        />

        {<SingleValueParam
          name="Hashing"
          buttonName="SEARCH"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL = {value || DEFAULT_SEARCH}
          SET_VAL = {setLocalSearch}
          ALGORITHM_NAME = {HASHING_SEARCH}
          EXAMPLE={EXAMPLES.HASHING_INSERT}
          handleSubmit={handleSearch}
          setMessage={setMessage}
         />}
      </div>

      <div
        style={{
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <div>
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
        </div>

        <div>
          {HASHSize.smallTable && (
            <FormControlLabel
              control={
                <BlueRadio
                  checked={expand}
                  onClick={handleExpand}
                />
              }
              label="Dynamic size"
              className="checkbox"
            />
          )}
        </div>
      </div>

      {message}
    </>
  );
}

HashingLPParam.propTypes = {
    alg: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    list: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
 };
export default withAlgorithmParams(HashingLPParam);
