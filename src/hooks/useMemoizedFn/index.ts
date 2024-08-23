import { useMemo, useRef } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;


/**
 * 持久化 function 的 Hook，理论上，可以使用 useMemoizedFn 完全代替 useCallback
 * 实现原理是通过 useRef 保持 function 引用地址不变，并且每次执行都可以拿到最新的 state 值
 */
function useMemoizedFn<T extends noop>(fn: T) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo<T>(() => fn, [fn]);

  // 通过 useRef 保持其引用地址不变
  const memoizedFn = useRef<PickFunction<T>>();
  // 返回的持久化函数，调用该函数的时候，调用原始的函数
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}

export default useMemoizedFn;
