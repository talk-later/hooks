import React from 'react'
import useResizeObserver from '../index'
function Demo1() {
    const resizeCallback = () => {
        console.log('resizeCallback')
    }
    const setElement = useResizeObserver(resizeCallback)
    return <div ref={setElement} >demo1</div>
}

export default Demo1
