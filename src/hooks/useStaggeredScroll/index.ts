import React, { useEffect, useRef } from 'react'
import type { RefObject} from 'react'

interface IStaggeredScrollOptions {
    containerTarget: RefObject<HTMLElement>;
    contentTarget: RefObject<HTMLElement>;
    openStaggeredScroll?: boolean;
}

/**
 * 使用错位滚动效果的函数
 * 当容器滚动到视口内时，根据阈值错位滚动内容元素
 */
function useStaggeredScroll(options: IStaggeredScrollOptions) {
    const {containerTarget, contentTarget, openStaggeredScroll = true} = options
    // 容器是否在视口内
    const inScreen = useRef<boolean>(false)
    // 观察者
    const observer = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        if (!openStaggeredScroll) return
        observer.current = new IntersectionObserver(
            (entries) => {
                // 更新容器是否在视口内
                entries.forEach((entry) => {
                    inScreen.current = entry.isIntersecting
                })
            },
            {
                root: null // 使用默认根元素（视口）
            }
        )
        if (observer.current && containerTarget.current) {
            observer.current.observe(containerTarget.current)
            const handleScroll = () => {
                // 根据是否在视口内和容器的滚动位置，应用错位滚动效果
                if (containerTarget.current && contentTarget.current) {
                    const containerTop = containerTarget.current.getBoundingClientRect().top
                    if (inScreen.current && containerTop <= 0) {
                        contentTarget.current.style.transform = `translateY(${-containerTop * 0.5}px)`
                    }
                }
            }
            // 添加滚动事件监听器
            window.addEventListener('scroll', handleScroll)
            // 移除事件监听器和取消观察
            return () => {
                if (observer.current && containerTarget.current) {
                    observer.current.unobserve(containerTarget.current)
                    observer.current.disconnect()
                }
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [openStaggeredScroll])
}

export default useStaggeredScroll