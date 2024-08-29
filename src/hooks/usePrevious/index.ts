import { useRef } from 'react';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b);

/**
 * 使用前一个值钩子
 * 
 * 此钩子用于在函数组件中访问前一个值它通过比较当前值和前一个值来决定是否更新引用
 * 
 * @param state 当前状态值
 * @param shouldUpdate 是否更新的判断函数默认使用 `defaultShouldUpdate`，即只要值不同就更新
 * @returns 返回前一个状态值如果首次渲染，则可能为 `undefined`
 */
function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  // 用于存储前一个状态值的 ref
  const prevRef = useRef<T>();
  // 用于存储当前状态值的 ref
  const curRef = useRef<T>();

  // 根据是否更新函数来决定是否更新 refs
  if (shouldUpdate(curRef.current, state)) {
    // 将当前值设置为前一个值
    prevRef.current = curRef.current;
    // 更新当前值
    curRef.current = state;
  }

  // 返回前一个状态值
  return prevRef.current;
}

export default usePrevious;
