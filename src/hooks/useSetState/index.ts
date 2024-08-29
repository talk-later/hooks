import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

/**
 * 类似this.setState，提供了合并状态的便利方法。
 * @param initialState 初始状态对象。
 * @returns 返回一个状态对象和一个更新状态的函数的数组。
 */
const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  // 使用useState钩子初始化状态
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      // 如果patch是一个函数，则传入旧状态调用它；否则直接使用patch
      const newState = isFunction(patch) ? patch(prevState) : patch;
      // 如果新状态不为空，则合并新旧状态；否则保持原状态不变
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  // 返回当前状态和用于合并状态的函数
  return [state, setMergeState];
};

export default useSetState;
