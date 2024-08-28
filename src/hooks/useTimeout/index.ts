import { useCallback, useEffect, useRef } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isNumber } from '../utils';

/**
 * 用于在React函数组件中处理timeout逻辑，它会在组件挂载后根据指定的延迟时间来执行回调函数
 * 当组件卸载或者延迟时间更新时，先前的timeout会被清除
 * 
 * @param fn 回调函数，当timeout触发时会执行此函数
 * @param delay 可选的延迟时间，单位为毫秒 如果未提供或为负数，则不会设置timeout
 * @returns 返回一个函数，用于清除当前的timeout
 */
const useTimeout = (fn: () => void, delay?: number) => {
  const timerCallback = useMemoizedFn(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 定义一个清除timeout的函数
  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // 使用useEffect设置timeout，并在delay时间改变后重新设置
  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }
    timerRef.current = setTimeout(timerCallback, delay);
    return clear;
  }, [delay]);

  // 返回清除函数，以便外部可以手动清除timeout
  return clear;
};

export default useTimeout;
