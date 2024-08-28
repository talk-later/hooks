import { useCallback, useEffect, useRef } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isNumber } from '../utils';

/**
 * 间隔调用的自定义hook
 * 
 * @param fn 要在间隔中执行的回调函数
 * @param delay 间隔时间，以毫秒为单位。可选参数，如果不传入则不启动间隔调用
 * @param options 配置选项，包括是否在初始化时立即执行回调
 * @returns 返回一个函数，用于清除间隔调用
 */
const useInterval = (fn: () => void, delay?: number, options: { immediate?: boolean } = {}) => {
  const timerCallback = useMemoizedFn(fn);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 定义一个清除间隔的函数
  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // 在 delay 或 options.immediate 改变时设置或重置间隔调用
  useEffect(() => {
    // 验证 delay 是否为合法的数值
    if (!isNumber(delay) || delay < 0) {
      return;
    }
    // 如果配置了立即执行，则首先执行一次回调
    if (options.immediate) {
      timerCallback();
    }
    // 设置间隔调用，并将 setInterval 的返回值存储以备后续清除
    timerRef.current = setInterval(timerCallback, delay);
    // 返回清除函数，以便在组件卸载或 delay 改变时清除之前的间隔调用
    return clear;
  }, [delay, options.immediate]);

  // 返回清除函数，供外部手动清除间隔调用
  return clear;
};

export default useInterval;
