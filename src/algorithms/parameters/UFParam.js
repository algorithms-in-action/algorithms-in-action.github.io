/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext} from 'react';


import FormControlLabel from '@material-ui/core/FormControlLabel';

import SingleValueParam from './helpers/SingleValueParam';
import DualValueParam from './helpers/DualValueParam';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';


import '../../styles/Param.scss';

const SET_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const DEFAULT_UNION = "5-7,3-4,9-8,3-8"
const DEFAULT_FIND = "2"

const UNION_FIND = 'Union Find';
const FIND = 'Find'
const UNION = 'Union'
const FIND_EXAMPLE = 'Please follow the example provided: 0,1';
const UNION_EXAMPLE = 'Please follow the example provided: 0,1';


const DEFAULT_SIZE = 4;
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
  const [nodes, setNodes] = useState(SET_VALUES);
  const [string, setString] = useState(DEFAULT_UNION);
  // set up array here :)
  // const [nodes, SetNodes] = useState(SET_VALUES;

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

      {/* might need to add some CSS or shit to centre the find. */}
      <SingleValueParam
          name="unionFind"
          buttonName="Find"
          mode="search"
          formClassName="formRight" // i see (this is the form name within div)
          DEFAULT_VAL={DEFAULT_FIND}
          ALGORITHM_NAME={FIND}
          EXAMPLE={FIND_EXAMPLE}
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
