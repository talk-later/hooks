import React, { useRef } from 'react'
import useStaggeredScroll from '../index'
function Demo1() {
    const containerTarget = useRef<HTMLDivElement>(null)
    const contentTarget = useRef<HTMLDivElement>(null)
    useStaggeredScroll({
        containerTarget,
        contentTarget,
        openStaggeredScroll: true
    })
    return (
        <div className="container" ref={containerTarget}>
            <div className="content" ref={contentTarget}></div>
        </div>
    )
}

export default Demo1
