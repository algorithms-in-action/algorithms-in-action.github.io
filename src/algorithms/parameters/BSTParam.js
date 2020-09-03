/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import ControlButton from '../../components/common/ControlButton';
import ParamMsg from './ParamMsg';
import '../../styles/Param.scss';
import { commaSeparatedNumberListValidCheck, singleNumberValidCheck, genRandNumList } from './ParamHelper';
import { ReactComponent as RefreshIcon } from '../../resources/icons/refresh.svg';

const DEFAULT_NODES = genRandNumList(10, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const EXCEPTION = 'exception';

function BSTParam() {
  const [insertionVal, setInsertionVal] = useState(DEFAULT_NODES);
  const [searchVal, setSearchVal] = useState(DEFAULT_TARGET);
  const [logWarning, setLogWarning] = useState(false);
  const [logTag, setLogTag] = useState('');
  const [logMsg, setLogMsg] = useState('');

  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;

  const updateParamStatus = (type, val, success) => {
    if (success) {
      setLogTag(`${type} success!`);
      setLogWarning(false);
      setLogMsg(`Input for ${type} algorithm is valid.`);
    } else {
      setLogTag(`${type} failure!`);
      setLogWarning(true);

      let warningText = '';
      if (type === EXCEPTION) {
        warningText = 'Please insert nodes first.';
      } else {
        warningText += `Input for ${type} algorithm is not valid. `;
        if (type === INSERTION) {
          warningText += 'Example: 0,1,2,3,4';
        } else {
          warningText += 'Example: 16';
        }
      }

      setLogMsg(warningText);
    }
  };

  // TODO: Need to extract BSTParam, HSParam as a more generalized component
  const handleSubmit = (evt) => {
    evt.preventDefault();

    const evtName = evt.target[0].name;
    const evtVal = evt.target[0].value;

    switch (evtName) {
      case INSERTION:
        if (commaSeparatedNumberListValidCheck(evtVal)) {
          setInsertionVal(evtVal.split`,`.map((x) => +x));
          updateParamStatus(INSERTION, insertionVal, true);

          const nodes = typeof insertionVal === 'string'
            ? insertionVal.split(',').map((x) => parseInt(x, 10))
            : insertionVal;
          // run insertion animation
          dispatch(GlobalActions.RUN_ALGORITHM, { name: 'binarySearchTree', mode: 'insertion', nodes });
        } else {
          updateParamStatus(INSERTION, insertionVal, false);
        }

        break;
      case SEARCH:
        if (singleNumberValidCheck(evtVal)) {
          setSearchVal(parseInt(evtVal, 10));

          const target = parseInt(searchVal, 10);

          // make sure the tree is not empty
          if (algorithm.hasOwnProperty('visualisers') && !algorithm.visualisers.graph.instance.isEmpty()) {
            // run search animation
            const visualiser = algorithm.chunker.visualisers;
            dispatch(GlobalActions.RUN_ALGORITHM, {
              name: 'binarySearchTree', mode: 'search', visualiser, target,
            });
            updateParamStatus(SEARCH, searchVal, true);
          } else {
            updateParamStatus(EXCEPTION, searchVal, false);
          }
        } else {
          updateParamStatus(SEARCH, searchVal, false);
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
                name={INSERTION}
                type="text"
                value={insertionVal}
                data-testid="insertionText"
                onChange={(e) => setInsertionVal(e.target.value)}
              />
            </label>
            <div className="btnGrp">
              <ControlButton
                icon={<RefreshIcon />}
                className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
                id={INSERTION}
                disabled={disabled}
                onClick={() => {
                  const list = genRandNumList(10, 1, 100);
                  setInsertionVal(list);
                }}
              />
              <ControlButton
                className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
                type="submit"
                disabled={disabled}
              >
                Insert
              </ControlButton>
            </div>
          </div>
        </form>

        <form className="formRight" onSubmit={handleSubmit}>
          <div className="outerInput">
            <label className="inputText">
              <input
                name={SEARCH}
                type="text"
                value={searchVal}
                data-testid="insertionText"
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </label>
            <div className="btnGrp">
              <ControlButton
                className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
                type="submit"
                disabled={disabled}
              >
                Search
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

export default BSTParam;
