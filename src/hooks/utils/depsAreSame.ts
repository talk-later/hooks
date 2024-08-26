import type { DependencyList } from 'react';

/**
 * 检查依赖是否相同
 * 
 * 该函数用于比较两组依赖（旧依赖和新依赖）是否完全相同主要用于React组件的依赖数组比较
 * 它首先检查两组依赖是否是同一个对象，如果是，则认为它们相同；如果不是，则逐个比较依赖项
 * 使用Object.is进行比较，因为Object.is可以正确处理特殊值（如NaN）的比较
 * 
 * @param oldDeps 旧的依赖数组
 * @param deps 新的依赖数组
 * @returns 如果两组依赖相同，返回true；否则返回false
 */
export default function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
  // 如果旧依赖和新依赖是同一个对象，直接返回true
  if (oldDeps === deps) return true;
  // 遍历旧依赖数组，逐个和新依赖对应位置的元素比较
  for (let i = 0; i < oldDeps.length; i++) {
    // 如果有任何一对依赖项不相同，则返回false
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  // 如果所有依赖项都相同，则返回true
  return true;
}
