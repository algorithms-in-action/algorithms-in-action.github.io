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
 * This List param component can be used when:
 * a) the algorithm has only one mode, i.e. only sort or search, and
 * b) the param input is a list
 */
function ListParam({
  name, mode, DEFAULT_ARR, ALGORITHM_NAME, EXAMPLE,
}) {
  const {
    dispatch,
    disabled,
    paramVal,
    message,
    setParamVal,
    setMessage,
  } = useParam(DEFAULT_ARR);

  const handleSort = (e) => {
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
    <>
      <div className="form">
        {/* Sort input */}
        <ParamForm
          formClassName="formLeft"
          name={ALGORITHM_NAME}
          value={paramVal}
          disabled={disabled}
          onChange={(e) => setParamVal(e.target.value)}
          handleSubmit={handleSort}
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
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default ListParam;
