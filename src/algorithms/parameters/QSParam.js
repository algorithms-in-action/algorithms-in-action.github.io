/* eslint-disable no-unused-vars */
import React from 'react';
import ControlButton from '../../components/common/ControlButton';
import '../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';
import { GlobalActions } from '../../context/actions';
import ParamForm from './ParamForm';
import {
  commaSeparatedNumberListValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';

import useParam from '../../context/useParam';

const DEFAULT_ARR = genRandNumList(10, 1, 100);
const QUICK_SORT = 'quick Sort';
const QUICK_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function QuicksortParam() {
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
      // run quick sort animation
      // dispatch(GlobalActions.RUN_ALGORITHM, { name: 'quicksort', mode: 'sort', nodes });
      setMessage(successParamMsg(QUICK_SORT));
    } else {
      setMessage(errorParamMsg(QUICK_SORT, QUICK_SORT_EXAMPLE));
    }
  };

  return (
    <>
      <div className="form">
        {/* Sort input */}
        <ParamForm
          formClassName="formLeft"
          name={QUICK_SORT}
          value={paramVal}
          disabled={disabled}
          onChange={(e) => setParamVal(e.target.value)}
          handleSubmit={handleSort}
        >
          <ControlButton
            icon={<RefreshIcon />}
            className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
            id={QUICK_SORT}
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

export default QuicksortParam;
