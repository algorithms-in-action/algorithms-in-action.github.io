/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import ControlButton from '../../components/common/ControlButton';
import '../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ParamForm from './ParamForm';
import {
  commaSeparatedNumberListValidCheck,
  genRandNumList,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';

const DEFAULT_ARR = genRandNumList(10, 1, 100);
const HEAP_SORT = 'heap Sort';
const HEAP_SORT_EXAMPLE = 'Example: 0,1,2,3,4';

function HeapsortParam() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;
  const [arrVal, setArrVal] = useState(DEFAULT_ARR);
  const [message, setMessage] = useState(null);

  const handleSort = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    if (commaSeparatedNumberListValidCheck(inputValue)) {
      const nodes = inputValue.split`,`.map((x) => +x);
      setArrVal(nodes);
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
          value={arrVal}
          onChange={(e) => setArrVal(e.target.value)}
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
              setArrVal(list);
            }}
          />
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            type="submit"
            disabled={disabled}
          >
            Sort
          </ControlButton>
        </ParamForm>
      </div>

      {/* render success/error message */}
      {message}
    </>
  );
}

export default HeapsortParam;
