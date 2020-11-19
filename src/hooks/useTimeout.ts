import { useEffect, useCallback, useRef } from 'react';

// React hook for delaying calls with time
// returns callback to use for cancelling

const useTimeout = () => {
  const timeoutIdRef = useRef<{
    value: NodeJS.Timeout,
    repeated: boolean;
  }>();
  const clear = useCallback(() => {
    const timeoutId = timeoutIdRef?.current;
    if (timeoutId && timeoutIdRef) {
      timeoutIdRef.current = undefined;
      timeoutId.repeated ? clearInterval(timeoutId.value) : clearTimeout(timeoutId.value);
    }
  }, [timeoutIdRef]);

  const set = ({
    callback,
    timeout = 0,
    repeated = false,
  } : {
    callback: () => void,
    timeout?: number;
    repeated?: boolean;
  }) => {
    if(timeoutIdRef) {
      timeoutIdRef.current = {
        value: repeated ? setInterval(callback, timeout) : setTimeout(callback, timeout) as any,
        repeated,
      };
    }
  };

  return {
    value: timeoutIdRef.current?.value,
    clear,
    set,
  };
};

export default useTimeout;
