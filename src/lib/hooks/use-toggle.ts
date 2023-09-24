import { useCallback, useState } from 'react'

const useToggle = (initValue = false) => {
  const [value, setValue] = useState(initValue)

  const toggle = useCallback((newValue?: boolean) => {
    if (typeof newValue === 'boolean') setValue(newValue)
    else setValue((prev) => !prev)
  }, [])

  return [value, toggle] as const
}

export default useToggle
