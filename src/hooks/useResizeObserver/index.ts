import { useState, useEffect, useRef } from 'react'
import useLatest from '../useLatest'

type noop = (...args: any[]) => any
type TargetType = HTMLElement | Element | null

function useResizeObserver<T extends noop>(callback: T) {
    const [element, setElement] = useState<TargetType>(null)
    const observer = useRef<ResizeObserver>()
    const callbackFn = useLatest<ResizeObserverCallback>(callback)

    useEffect(() => {
        if (!element) return
        // 去掉dom observer 监听
        observer.current?.disconnect()
        // 创建ResizeObserver实例
        observer.current = new window.ResizeObserver(callbackFn.current)

        // 当元素改变时，开始监听
        observer.current.observe(element)

        // 组件卸载时，停止监听
        return () => {
            observer.current?.disconnect()
        }
    }, [element]) // 依赖项数组中包含element和callback

    return setElement as (target: TargetType) => void
}

export default useResizeObserver
