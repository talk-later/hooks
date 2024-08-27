import { useEffect, useState } from 'react';
import type { DependencyList, EffectCallback } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
import useDebounceFn from '../useDebounceFn';
import useUpdateEffect from '../useUpdateEffect';

function useDebounceEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions,
) {
  // 增加一个状去触发effect
  const [flag, setFlag] = useState({});

  const { run } = useDebounceFn(() => {
    setFlag({});
  }, options);

  // 依赖性变化触发标识状态延迟变化
  useEffect(() => {
    return run()
  }, deps);

  // 新增的标识状态变化，触发effect
  // 保证useEffect的执行符合预期（如果直接使用useEffect，debounce的是effect，清除副作用的函数也会被debounce）
  useUpdateEffect(effect, [flag]);
}


export default useDebounceEffect;
