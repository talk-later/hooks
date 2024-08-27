import React, { useState } from 'react'
import useDebounce from './hooks/useDebounce/index.ts'
import useDebounceEffect from './hooks/useDebounceEffect/index.ts'
import useUpdateEffect from './hooks/useUpdateEffect/index.ts'

export default function App() {
  const [count, setCount] = useState(0)
  useDebounceEffect(() => {
    console.log(`[Log] useDebounceEffect-->`, count);
    return () => {
      console.log(`[Log] return-->`, count);
    }
  }, [count], { wait: 1000 })
  // useUpdateEffect(() => {
  //   console.log(`[Log] useUpdateEffect-->`, count);
  // }, [count])
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}
