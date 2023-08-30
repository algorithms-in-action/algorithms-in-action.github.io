/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext} from 'react';

import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import { successParamMsg, errorParamMsg } from './helpers/ParamHelper';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import SingleValueParam from './helpers/SingleValueParam';
import DualValueParam from './helpers/DualValueParam';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';


import '../../styles/Param.scss';

const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const DEFAULT_UNION = "5-7,3-4,9-8,3-8"
const DEFAULT_FIND = "2"

const ALGORITHM_NAME = 'Union Find';
const FIND = 'Find'
const UNION = 'Union'
const FIND_EXAMPLE = 'Please follow the example provided: 2. The single digit should be between 1 and 10.';
const UNION_EXAMPLE = "Please follow the example provided: 5-7,3-4,9-8,3-8. All digits should be between 1 and 10, '-' should be used to separate the two digits, and ',' should be used to separate each union operation.";


// path compression:
const UNCHECKED = {on: false, off: false};

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

function UFParam() {
  const [message, setMessage] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);

  const [pathCompression, setPathCompression] = useState( {
    on: false,
    off: true,
  });

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'on':
        // path compression on
        break;
      case 'off':
        // remove path compression from pseudocode
        break;
      default:
    }

    setPathCompression({ ...UNCHECKED, [e.target.name]: true });
  }

  // to use array from union
  const handleFind = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (!(isNaN(inputValue) || !N_ARRAY.includes(inputValue))) {

      const target = parseInt(inputValue, 10);

      const visualiser = algorithm.chunker.visualisers;
      dispatch(GlobalActions.RUN_ALGORITHM, 
        { name: 'unionFind', mode: 'find', visualiser, target}
        );
      setMessage(successParamMsg(ALGORITHM_NAME));

    }
    else {
      setMessage(errorParamMsg(ALGORITHM_NAME, FIND_EXAMPLE));
    }

  }

  useEffect(
    () => {
      document.getElementById('startBtnGrp').click();
    },
    [pathCompression],
  );

  return (
    <>
      <div className="form">
      
        <DualValueParam
            name="unionFind"
            buttonName="Union"
            mode="union"
            formClassName="formLeft"
            DEFAULT_VAL={DEFAULT_UNION}
            ALGORITHM_NAME={UNION}
            EXAMPLE={UNION_EXAMPLE}
            setMessage={setMessage}
          />

      <SingleValueParam
          name="unionFind"
          buttonName="Find"
          mode="find"
          formClassName="formRight" // i see (this is the form name within div)
          DEFAULT_VAL={DEFAULT_FIND}
          ALGORITHM_NAME={FIND}
          EXAMPLE={FIND_EXAMPLE}
          handleSubmit={handleFind}
          setMessage={setMessage}
        />
      </div>

      <span className="generalText">Path compression: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={(
          <BlueRadio
            checked={pathCompression.on}
            onChange={handleChange}
            name="on"
          />
        )}
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={pathCompression.off}
            onChange={handleChange}
            name="off"
          />
        )}
        label="Off"
        className="checkbox"
      /> 
      {/* render success/error message */}
      {message}
    </>
  );
}

export default UFParam;
