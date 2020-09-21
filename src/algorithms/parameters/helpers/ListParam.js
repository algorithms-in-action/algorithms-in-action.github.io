/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../../resources/icons/refresh.svg';
import { GlobalActions } from '../../../context/actions';
import ParamForm from './ParamForm';
import {
  commaSeparatedNumberListValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';

import useParam from '../../../context/useParam';

/**
 * This list param component can be used when
 * the param input accepts a list
 */
function ListParam({
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
   * The default function that uses the list of values to
   * run an animation. It will check whether the input list
   * is valid first.
   */
  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (commaSeparatedNumberListValidCheck(inputValue)) {
      const nodes = inputValue.split`,`.map((x) => +x);
      setParamVal(nodes);
      // run animation
      dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, nodes });
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
    >
      <ControlButton
        icon={<RefreshIcon />}
        className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
        id={ALGORITHM_NAME}
        disabled={disabled}
        onClick={() => {
          const list = genRandNumList(10, 1, 100);
          setMessage(null);
          setParamVal(list);
        }}
      />
    </ParamForm>
  );
}

export default ListParam;
