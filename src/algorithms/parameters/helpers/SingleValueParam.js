/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import '../../../styles/Param.scss';
import { GlobalActions } from '../../../context/actions';
import ParamForm from './ParamForm';
import {
  singleNumberValidCheck,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';

import useParam from '../../../context/useParam';

/**
 * This single value param component can be used when
 * the param input accepts a single number
 */
function SingleValueParam({
  name, buttonName, mode, DEFAULT_VAL, ALGORITHM_NAME,
  EXAMPLE, formClassName, handleSubmit, setMessage,
}) {
  const {
    dispatch,
    disabled,
    paramVal,
    setParamVal,
  } = useParam(DEFAULT_VAL);

  /**
   * The default function that uses the single value to
   * run an animation. It will check whether the input number
   * is valid first.
   */
  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (singleNumberValidCheck(inputValue)) {
      const target = parseInt(inputValue, 10);
      setParamVal(target);

      // TODO: need to be removed when these two algorithms are done
      if (!(name === 'transitiveClosure' || name === 'prim')) {
        // run animation
        dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, target });
      }
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <ParamForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      buttonName={buttonName}
      value={paramVal}
      disabled={disabled}
      onChange={(e) => setParamVal(e.target.value)}
      // If no customized handle function is provided, the default one will be used
      handleSubmit={
        handleSubmit && typeof handleSubmit === 'function'
          ? handleSubmit
          : handleDefaultSubmit
      }
    />
  );
}

export default SingleValueParam;
