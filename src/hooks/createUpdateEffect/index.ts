import { useRef } from 'react';
import type { useEffect, useLayoutEffect } from 'react';

type EffectHookType = typeof useEffect | typeof useLayoutEffect;

export const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
  (hook) => (effect, deps) => {
    // 创建一个 Ref 用来追踪组件是否已经挂载
    const isMounted = useRef(false);

    // 当组件卸载时，设置 isMounted 为 false
    // 这个 hook 确保我们只在挂载后执行 effect 函数
    hook(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    // 如果组件尚未挂载，则记录挂载状态为 true，不执行 effect 函数
    // 如果组件已经挂载，并且依赖项发生变化，则执行 effect 函数
    hook(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, deps);
  };

export default createUpdateEffect;
