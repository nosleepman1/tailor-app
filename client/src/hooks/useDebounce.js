/**
 * useDebounce — delays updating a value until the user stops typing.
 * @param {*}      value  - the value to debounce
 * @param {number} delay  - debounce delay in ms (default 300)
 */
import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
