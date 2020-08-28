/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { commaSeparatedNumberListValidCheck } from './ParamHelper';
import ParamMsg from './ParamMsg';
import '../../styles/Param.scss';

const DEFAULT_ARR = '5,8,10,3,1,6,9,7,2,0,4';
const HEAP_SORT = 'Heap Sort';

function HeapsortParam() {
  const [arrVal, setArrVal] = useState(DEFAULT_ARR);

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
      if (type === HEAP_SORT) {
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
      case HEAP_SORT:
        if (commaSeparatedNumberListValidCheck(evtVal)) {
          setArrVal(evtVal.split`,`.map((x) => +x));
          updateParamStatus(HEAP_SORT, arrVal, true);
        } else {
          updateParamStatus(HEAP_SORT, arrVal, false);
        }

        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="HeapsortForm">

        <form className="insertionForm" onSubmit={handleSubmit}>
          <div className="outerInput">
            <label>
              <input
                name={HEAP_SORT}
                className="inputText"
                type="text"
                value={arrVal}
                placeholder="e.g. 4,2,3,1,2,3,4,5"
                onChange={(e) => setArrVal(e.target.value)}
              />
            </label>
            <input
              className="inputSubmit"
              type="submit"
              value="Insert"
              data-testid="insertionSubmit"
            />
          </div>
        </form>
      </div>

      {logMsg
        ? <ParamMsg logWarning={logWarning} logTag={logTag} logMsg={logMsg} />
        : ''}
    </>
  );
}

export default HeapsortParam;
