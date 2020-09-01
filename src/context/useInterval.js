/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // remember the latest function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up the interval
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
