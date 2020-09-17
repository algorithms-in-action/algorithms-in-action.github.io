/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
const HEAP_SORT = 'heap Sort';
const HEAP_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function HeapsortParam() {
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
      // run heap sort animation
      dispatch(GlobalActions.RUN_ALGORITHM, { name: 'heapSort', mode: 'sort', nodes });
      setMessage(successParamMsg(HEAP_SORT));
    } else {
      setMessage(errorParamMsg(HEAP_SORT, HEAP_SORT_EXAMPLE));
    }
  };

  return (
    <>
      <div className="form">
        {/* Sort input */}
        <ParamForm
          formClassName="formLeft"
          name={HEAP_SORT}
          value={paramVal}
          disabled={disabled}
          onChange={(e) => setParamVal(e.target.value)}
          handleSubmit={handleSort}
        >
          <ControlButton
            icon={<RefreshIcon />}
            className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
            id={HEAP_SORT}
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

export default HeapsortParam;
