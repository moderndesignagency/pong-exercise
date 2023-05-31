import { MutableRefObject, RefObject, useLayoutEffect, useState } from 'react'
import useDebounce from './useDebounce'

export type ElementSize = {
  width?: number
  height?: number
}

export type UseElementSizeOptions = {
  defaultSize?: ElementSize
  refreshRateMilliseconds?: number
  observerOptions?: ResizeObserverOptions
}

const useElementSize = <T extends Element = Element>(
  target: MutableRefObject<T> | RefObject<T>,
  options?: UseElementSizeOptions
): ElementSize => {
  const { refreshRateMilliseconds, defaultSize, observerOptions } = {
    refreshRateMilliseconds: 200,
    defaultSize: { width: undefined, height: undefined },
    ...(options ?? {}),
  }

  const [size, setSize] = useState(defaultSize)
  const sizeDebounced = useDebounce(size, refreshRateMilliseconds)

  useLayoutEffect(() => {
    if (!target.current) {
      return
    }

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width, height } = entry?.contentRect || {}

        if (size.width !== width || size.height !== height) {
          setSize({ width, height })
        }
      })
    })

    resizeObserver.observe(target.current, observerOptions)

    return () => {
      resizeObserver.disconnect()
    }
  }, [target, observerOptions])

  return sizeDebounced
}

export default useElementSize
