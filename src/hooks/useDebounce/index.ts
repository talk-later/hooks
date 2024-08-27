import { useEffect, useState } from 'react';
import useDebounceFn from '../useDebounceFn';
import type { DebounceOptions } from './debounceOptions';

/**
 * 使用防抖处理的函数
 * 这个函数的主要目的是为了在快速变化的场景中延迟值的更新，直到变化停止
 * 
 * @param value 需要进行防抖处理的值，一旦value发生变化，就会启动防抖逻辑
 * @param options 可选的防抖选项参数，用于配置防抖逻辑的具体行为
 * @returns 返回经过防抖处理后的值
 */
function useDebounce<T>(value: T, options?: DebounceOptions) {
  // 声明一个状态变量，用于存储防抖处理后的值
  const [debounced, setDebounced] = useState(value);

  // 使用useDebounceFn钩子来创建一个防抖函数，这个函数的作用是更新debounced值
  const { run } = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  // 当value发生变化时，运行防抖函数，以确保值的变化被延迟处理
  useEffect(() => {
    run();
  }, [value]);

  // 返回防抖处理后的值
  return debounced;
}

export default useDebounce;
