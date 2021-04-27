/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
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
  name, buttonName, mode, DEFAULT_VAL, SET_VAL, ALGORITHM_NAME,
  EXAMPLE, formClassName, handleSubmit, setMessage,
}) {
  const {
    dispatch,
    disabled,
    // paramVal,
    // setParamVal,
  } = useParam(DEFAULT_VAL);

  /**
   * The default function that uses the list of values to
   * run an animation. It will check whether the input list
   * is valid first.
   */
  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    if (commaSeparatedNumberListValidCheck(inputValue)) {
      const nodes = inputValue.split`,`.map((x) => +x);
      // SET_VAL(nodes);
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
      value={DEFAULT_VAL}
      disabled={disabled}
      onChange={(e) => {
        // console.log(e.target.value);
        // console.log(e.target.value.split(','));
        SET_VAL(e.target.value.split(','));
      }}
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
          // console.log(DEFAULT_VAL);
          const list = genRandNumList(DEFAULT_VAL.length, 1, 100);
          setMessage(null);
          SET_VAL(list);
        }}
      />
    </ParamForm>
  );
}

export default ListParam;
