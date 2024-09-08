import { useCallback, useEffect, useRef } from 'react';
import useLatest from '../useLatest';
import { isNumber } from '../utils';

interface Handle {
  id: number | ReturnType<typeof setInterval>;
}

/**
 * 使用requestAnimationFrame时间setInterval
 * 当requestAnimationFrame不可用时，回退到setInterval。
 * 
 * @param callback 回调函数，定时器每次触发时执行。
 * @param delay 延迟时间（毫秒），默认为0。
 * @returns 返回一个包含定时器id的Handle对象，用于标识定时器。
 */
const setRafInterval = function (callback: () => void, delay: number = 0): Handle {
  // 检查requestAnimationFrame是否定义，若未定义则回退到setInterval
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(callback, delay),
    };
  }
  // 初始化开始时间为当前时间
  let start = Date.now();
  // 初始化Handle对象，用于存储定时器id
  const handle: Handle = {
    id: 0,
  };
  // 定义循环函数，计算时间差并决定是否执行回调
  const loop = () => {
    const current = Date.now();
    // 如果从开始到现在的累计时间大于等于延迟时间，则执行回调，并重置开始时间
    if (current - start >= delay) {
      callback();
      start = Date.now();
    }
    // 设置定时器id为下一次动画帧请求的id
    handle.id = requestAnimationFrame(loop);
  };
  // 初始化定时器，设置第一次动画帧请求
  handle.id = requestAnimationFrame(loop);
  // 返回包含定时器id的Handle对象
  return handle;
};

function cancelAnimationFrameIsNotDefined(t: any): t is ReturnType<typeof setInterval> {
  return typeof cancelAnimationFrame === typeof undefined;
}

const clearRafInterval = function (handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id);
  }
  cancelAnimationFrame(handle.id);
};

function useRafInterval(
  fn: () => void,
  delay: number | undefined,
  options?: {
    immediate?: boolean;
  },
) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);
  const timerRef = useRef<Handle>();

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearRafInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }
    if (immediate) {
      fnRef.current();
    }
    timerRef.current = setRafInterval(() => {
      fnRef.current();
    }, delay);
    return clear;
  }, [delay]);

  return clear;
}

export default useRafInterval;
