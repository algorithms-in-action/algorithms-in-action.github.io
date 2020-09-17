/* eslint-disable no-prototype-builtins */
import { useState, useContext } from 'react';
import { GlobalContext } from './GlobalState';

function useParam(DEFAULT_VALUE) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;
  const [paramVal, setParamVal] = useState(DEFAULT_VALUE);
  const [message, setMessage] = useState(null);

  return {
    algorithm,
    dispatch,
    disabled,
    paramVal,
    message,
    setParamVal,
    setMessage,
  };
}

export default useParam;
