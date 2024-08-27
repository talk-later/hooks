import { useEffect } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';
import useLatest from '../useLatest';

// 在组件挂载时执行一次给定的函数
const useMount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
      );
    }
  }

  const fnRef = useLatest(fn);

  useEffect(() => {
    fnRef.current();
  }, []);
};

export default useMount;
