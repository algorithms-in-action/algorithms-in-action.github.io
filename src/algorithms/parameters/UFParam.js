/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/Param.scss';
import {
  singleNumberValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './helpers/ParamHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: '25ch',
    },
  },
}));

function SingleValueParam() {
  const classes = useStyles();
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState(0);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleParamSubmit = (e) => {
    e.preventDefault();
    if (singleNumberValidCheck(value)) {
      setMessage(successParamMsg);
    } else {
      setMessage(errorParamMsg);
    }
  };

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleParamSubmit}>
          <input
            type="number"
            name="value"
            value={value}
            onChange={handleChange}
            className="param-input"
            placeholder="Enter a value"
          />
          <input type="submit" value="Submit" className="param-submit" />
          {message}
        </form>
      )}
    </GlobalContext.Consumer>
  );
}

export default SingleValueParam;
