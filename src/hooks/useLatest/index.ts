import { useRef } from 'react';


/**
 * 1. 为什么需要这个函数？
 * 在React的函数组件中，我们经常需要在某些操作中使用到最新的状态或props值
 * 但是，直接依赖props或state的值可能会因为闭包导致错误的值使用
 * 因此，通过useLatest，我们可以确保始终获取到最新的一组值
 * 
 * 2. 如何保证值的最新性？
 * useLatest通过Ref来实现，Ref是一个持久存在的引用，在组件渲染时不会随着组件的重新渲染而改变
 * 我们将最新的值赋给Ref的current属性，这样无论组件如何渲染，我们都能通过Ref获取到最新的值
 */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
