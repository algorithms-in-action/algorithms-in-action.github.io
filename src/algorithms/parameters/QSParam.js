/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { commaSeparatedNumberListValidCheck, genRandNumList } from './ParamHelper';
import ControlButton from '../../components/common/ControlButton';
import ParamMsg from './ParamMsg';
import '../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

const DEFAULT_ARR = '5,8,10,3,1,6,9,7,2,0,4';
const QUICK_SORT = 'Quick Sort';

function QuicksortParam() {
  const [arrVal, setArrVal] = useState(DEFAULT_ARR);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;

  const [logWarning, setLogWarning] = useState(false);
  const [logTag, setLogTag] = useState('');
  const [logMsg, setLogMsg] = useState('');

  const updateParamStatus = (type, val, success) => {
    if (success) {
      setLogTag(`${type} success!`);
      setLogWarning(false);
      setLogMsg(`Input for ${type} algorithm is valid.`);
    } else {
      setLogTag(`${type} failure!`);
      setLogWarning(true);

      let warningText = '';
      warningText += `Input for ${type} algorithm is not valid. `;
      if (type === QUICK_SORT) {
        warningText += 'Example: 0,1,2,3,4';
      } else {
        warningText += 'Example: 16';
      }

      setLogMsg(warningText);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const evtName = evt.target[0].name;
    const evtVal = evt.target[0].value;

    switch (evtName) {
      case QUICK_SORT:
        if (commaSeparatedNumberListValidCheck(evtVal)) {
          setArrVal(evtVal.split`,`.map((x) => +x));
          updateParamStatus(QUICK_SORT, arrVal, true);
          const nodes = typeof arrVal === 'string' ? arrVal.split(',').map((x) => parseInt(x, 10)) : arrVal;

          // run quick sort animation
          dispatch(GlobalActions.RUN_ALGORITHM, { name: 'quickSort', mode: 'sort', nodes });
        } else {
          updateParamStatus(QUICK_SORT, arrVal, false);
        }

        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="form">
        <form className="formLeft" onSubmit={handleSubmit}>
          <div className="outerInput">
            <label className="inputText">
              <input
                name={QUICK_SORT}
                type="text"
                value={arrVal}
                data-testid="insertionText"
                onChange={(e) => setArrVal(e.target.value)}
              />
            </label>
            <div className="btnGrp">
              <ControlButton
                icon={<RefreshIcon />}
                className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
                id={QUICK_SORT}
                disabled={disabled}
                onClick={() => {
                  const list = genRandNumList(10, 1, 100);
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
            </div>
          </div>
        </form>
      </div>

      {logMsg
        ? <ParamMsg logWarning={logWarning} logTag={logTag} logMsg={logMsg} />
        : ''}
    </>
  );
}

export default QuicksortParam;
