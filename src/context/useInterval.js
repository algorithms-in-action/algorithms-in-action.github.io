/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // after every render, save the latest callback into ref
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // when delay changes, start a new timer
  useEffect(() => {
    function f() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(f, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
