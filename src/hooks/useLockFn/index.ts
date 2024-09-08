import { useRef, useCallback } from 'react';

/**
 * 创建一个带有锁定机制的函数
 * 它通过维护一个锁定状态来实现，当函数正在执行时，其他调用将会被阻塞
 * 
 * @param fn 被锁定的函数，它接受一些参数并返回一个Promise
 * @param args 被锁定函数的参数列表
 * @returns 返回函数的执行结果
 * 
 */
function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
  // 用于存储当前是否处于锁定状态的引用
  const lockRef = useRef(false);

  // 返回一个带有锁定逻辑的函数
  return useCallback(
    async (...args: P) => {
      // 检查是否已经锁定，若锁定则直接返回
      if (lockRef.current) return;
      // 在执行前锁定
      lockRef.current = true;
      try {
        // 执行原函数并返回结果
        const ret = await fn(...args);
        return ret;
      } catch (e) {
        // 捕获并抛出异常
        throw e;
      } finally {
        // 无论成功或失败，最终释放锁定
        lockRef.current = false;
      }
    },
    [fn], // 仅当fn变化时才重新创建useCallback
  );
}

export default useLockFn;
