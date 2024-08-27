import { useEffect } from 'react';
import useLatest from '../useLatest';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

// 用于在组件卸载时执行一个给定的函数
const useUnmount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useUnmount expected parameter is a function, got ${typeof fn}`);
    }
  }

  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};

export default useUnmount;
