import type { DependencyList } from 'react';
import { useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';


/**
 * useCreation 是 useMemo 或 useRef 的替代品
 * const a = useRef(new Subject()); // 每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
 * 因为 useMemo 不能保证被 memo 的值一定不会被重新计算（例如为屏幕外组件释放内存）
 * 
 * @param factory 一个返回类型为 T 的工厂函数，通常用于创建复杂对象或进行耗时计算
 * @param deps 一个依赖项数组，当其中的值发生变化时，工厂函数将重新执行
 * @returns 返回工厂函数创建的对象，类型为 T
 */
export default function useCreation<T>(factory: () => T, deps: DependencyList) {
  // 使用 useRef 来保存变量，这些变量在组件渲染之间保持不变
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T, // 初始时，由工厂函数创建的对象未定义
    initialized: false, // 跟踪是否已经初始化过
  });

  // 检查是否需要重新执行工厂函数
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    // 更新依赖项
    current.deps = deps;
    // 执行工厂函数，并将结果保存
    current.obj = factory();
    // 标记为已初始化
    current.initialized = true;
  }
  // 返回当前的对象
  return current.obj as T;
}
