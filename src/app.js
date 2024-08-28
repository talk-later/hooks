import React, { useEffect, useState } from 'react'
import useDebounce from './hooks/useDebounce/index.ts'
import useDebounceEffect from './hooks/useDebounceEffect/index.ts'
import useUpdateEffect from './hooks/useUpdateEffect/index.ts'
import useAsyncEffect from './hooks/useAsyncEffect/index.ts'

export default function App() {
  const [count, setCount] = useState(0)

  // useDebounceEffect(() => {
  //   console.log(`[Log] useDebounceEffect-->`, count);
  //   return () => {
  //     console.log(`[Log] return-->`, count);
  //   }
  // }, [count], { wait: 1000 })

  // useUpdateEffect(() => {
  //   console.log(`[Log] useUpdateEffect-->`, count);
  // }, [count])

  // useAsyncEffect(async () => {
  //   const res = await new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(count)
  //     }, 2000)
  //   })
  //   console.log(`[Log] res-->`, res);
  //   return () => {
  //     console.log(111);
  //   }
  // }, [count])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}
