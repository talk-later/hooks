import type { DependencyList } from 'react';
import { useEffect } from 'react';
import { isFunction } from '../utils';

function isAsyncGenerator(
  val: AsyncGenerator<void, void, void> | Promise<void>,
): val is AsyncGenerator<void, void, void> {
  return isFunction(val[Symbol.asyncIterator]);
}

/**
 * 用于在函数组件中处理异步副作用
 * 
 * @param effect 副作用函数，当依赖项变化时执行
 *        返回一个异步生成器、Promise或者null
 * @param deps  依赖项数组，与React的useEffect中的deps用法一致
 */
function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps?: DependencyList,
) {
  // 使用useEffect来监听依赖项的变化，并在变化时执行副作用处理函数
  useEffect(() => {
    // 调用副作用处理函数，获取执行对象
    const e = effect();
    // 标记是否已取消执行
    let cancelled = false;

    // 异步执行副作用
    async function execute() {
      // 判断执行对象是否为异步生成器
      if (isAsyncGenerator(e)) {
        // 如果是异步生成器，循环执行直到生成器完成或被取消
        while (true) {
          const result = await e.next();
          if (result.done || cancelled) {
            break;
          }
        }
      } else {
        // 如果不是异步生成器，直接等待Promise完成
        await e;
      }
    }

    // 立即执行副作用
    execute();

    // 返回清理函数，用于取消异步副作用的执行
    // 为什么不清除异步返回的副作用？
    // https://gpingfeng.github.io/ahooks-analysis/hooks/effect/use-async-effect#%E8%BF%98%E5%8F%AF%E4%BB%A5%E6%94%AF%E6%8C%81-useeffect-%E7%9A%84%E6%B8%85%E9%99%A4%E6%9C%BA%E5%88%B6%E4%B9%88
    return () => {
      cancelled = true;
    };
  }, deps);
}

export default useAsyncEffect;
