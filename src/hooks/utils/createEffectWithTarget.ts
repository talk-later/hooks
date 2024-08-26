import type { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react';
import { useRef } from 'react';
import useUnmount from '../useUnmount';
import depsAreSame from './depsAreSame';
import type { BasicTarget } from './domTarget';
import { getTargetElement } from './domTarget';

/**
 * 创建一个自定义的 React effect，支持传入目标元素进行更精细的比较和更新。
 * 该函数可以接受 `useEffect` 或 `useLayoutEffect` 作为类型参数，从而根据需求返回不同类型的 effect 函数。
 * 
 * @param useEffectType - 指定是 `useEffect` 还是 `useLayoutEffect`，以决定 effect 的执行时机。
 * @returns 返回一个高阶函数 `useEffectWithTarget`，用于处理带有目标元素的 effect。
 */
const createEffectWithTarget = (useEffectType: typeof useEffect | typeof useLayoutEffect) => {
  /**
   * 自定义的 effect 函数，带有目标元素比较功能。
   * 
   * @param effect - 要执行的 effect 函数，包含副作用逻辑。
   * @param deps - effect 的依赖项数组，当其中的值改变时，effect 会重新执行。
   * @param target - 目标元素或元素数组，用于副作用处理时进行比较。
   */
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[],
  ) => {
    // 用于标记是否是首次渲染
    const hasInitRef = useRef(false);
    // 用于存储上一次渲染的目标元素数组
    const lastElementRef = useRef<(Element | null)[]>([]);
    // 用于存储上一次渲染的依赖项数组
    const lastDepsRef = useRef<DependencyList>([]);
    // 用于存储卸载函数，以便在需要时进行卸载
    const unLoadRef = useRef<any>();

    // 根据 useEffectType 的值决定 effect 的执行时机
    useEffectType(() => {
      // 将目标参数转换为数组形式，便于处理单个目标或多个目标
      const targets = Array.isArray(target) ? target : [target];
      // 获取当前目标元素的实际 DOM 对象数组
      const els = targets.map((item) => getTargetElement(item));

      // 首次渲染时，初始化相关值并执行 effect 函数
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        unLoadRef.current = effect();
        return;
      }

      // 比较当前和上一次的目标元素数组及依赖项数组，如果不相同，则卸载旧的 effect 并重新执行新的 effect
      if (
        els.length !== lastElementRef.current.length ||
        !depsAreSame(lastElementRef.current, els) ||
        !depsAreSame(lastDepsRef.current, deps)
      ) {
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });

    // 组件卸载时，执行卸载逻辑，重置 hasInitRef 以支持热更新
    useUnmount(() => {
      unLoadRef.current?.();
      // for react-refresh
      hasInitRef.current = false;
    });
  };

  // 返回自定义的 effect 函数
  return useEffectWithTarget;
};

export default createEffectWithTarget;
