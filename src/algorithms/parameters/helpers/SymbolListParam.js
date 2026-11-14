/* eslint-disable react/prop-types */
import React from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import { GlobalActions } from '../../../context/actions';
import useParam from '../../../context/useParam';
import ParamForm from './ParamForm';
import { genRandNumList } from './InputBuilders';
import { parseTreeInput } from './treeInput';

function SymbolListParam({
  name, buttonName, mode, DEFAULT_VAL, SET_VAL, REFRESH_FUNCTION, ALGORITHM_NAME,
  formClassName, handleSubmit, setMessage, allowDelete = false,
}) {
  const { dispatch, disabled } = useParam(DEFAULT_VAL);

  const handleSymbolSubmit = event => {
    event.preventDefault();
    let operations;
    try {
      operations = parseTreeInput(event.currentTarget.elements[0].value, { allowDelete });
    } catch (error) {
      setMessage(error.message);
      return;
    }
    dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, operations });
    setMessage(null);
  };

  return (
    <ParamForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      buttonName={buttonName}
      value={DEFAULT_VAL}
      disabled={disabled}
      onChange={event => SET_VAL(event.target.value.split(','))}
      handleSubmit={typeof handleSubmit === 'function' ? handleSubmit : handleSymbolSubmit}
    >
      <ControlButton
        icon={<RefreshIcon />}
        aria-label="Generate random input"
        className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
        id={ALGORITHM_NAME}
        disabled={disabled}
        onClick={() => {
          const list = REFRESH_FUNCTION
            ? REFRESH_FUNCTION()
            : genRandNumList(DEFAULT_VAL.length, 1, 100);
          setMessage(null);
          SET_VAL(list);
        }}
      />
    </ParamForm>
  );
}

export default SymbolListParam;
