import { useEffect, useState } from 'react'

const useLocalStorage = <T>(key: string, initValue: T) => {
  const [storedValue, setStoredValue] = useState(initValue)

  useEffect(() => {
    // Retrieve from localStorage
    const item = localStorage.getItem(key)
    if (item) setStoredValue(JSON.parse(item))
  }, [key])

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(value))
  }
  return [storedValue, setValue] as const
}

export default useLocalStorage
