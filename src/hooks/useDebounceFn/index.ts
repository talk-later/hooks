import { debounce } from '../utils/lodash-polyfill';
import { useMemo } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
import useLatest from '../useLatest';
import useUnmount from '../useUnmount';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (...args: any[]) => any;

/**
 * 防抖函数钩子
 * 将函数防抖，以减少频繁触发带来的负担
 * 
 * @param fn 要防抖的函数
 * @param options 可选的防抖选项，包含等待时间等
 * @returns 返回一个对象，包含防抖后的函数、取消函数和立即执行函数
 */
function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useDebounceFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 使用useLatest钩子保持函数的最新引用
  const fnRef = useLatest(fn);

  // 设置等待时间，默认为1000毫秒
  const wait = options?.wait ?? 1000;

  // 使用React的useMemo钩子创建防抖函数
  const debounced: any = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options,
      ),
    [],
  );

  // 在组件卸载时取消防抖函数
  useUnmount(() => {
    debounced.cancel();
  });

  // 返回防抖后的函数，以及取消和立即执行的方法
  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;
