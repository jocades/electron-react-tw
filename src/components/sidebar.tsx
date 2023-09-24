import { Translation } from '@/main/db/schema'
import { useCallback, useEffect, useReducer, useState } from 'react'

export function SideBar() {
  return null
}

type Action =
  | { type: 'SET'; payload: Translation[] }
  | { type: 'CREATE'; payload: Translation }
  | { type: 'UPDATE'; payload: Translation }
  | { type: 'DELETE'; payload: { id: number } }

function translationsReducer(state: Translation[], { type, payload }: Action) {
  switch (type) {
    case 'SET':
      return payload
    case 'CREATE':
      return [payload, ...state]
    case 'UPDATE':
      return [payload, ...state.filter((group) => group.id !== payload.id)]
    case 'DELETE':
      return state.filter((group) => group.id !== payload.id)
    default:
      return state
  }
}

function useIPC<T = any>({
  fn = async () => {
    console.log('fn')
  },
} = {}) {
  const [update, forceUpdate] = useReducer((x) => x + 1, 0)

  const [translations, dispatch] = useReducer(translationsReducer, [])

  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('ipc-example', (arg) => {
      console.log('Received from main process:', arg)
    })

    return () => {
      unsub()
      console.log('unsubscribed, component unmounted')
    }
  }, [])

  useEffect(() => {
    const get = async () => {
      const data: Translation[] = await window.electron.db.tls.list()
      dispatch({ type: 'SET', payload: data })
    }
    get()
  }, [update])

  async function translate(data: any) {
    setIsLoading(true)
    try {
      const res = await window.electron.translate(data)
      setData(res.data)
      setError({ status: false, message: '' })
    } catch (err: any) {
      setError({ status: true, message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    translations,
    refetch: () => forceUpdate(),
    translate,
    newTranslation: data,
    isLoading,
    error,
    isError: error.status,
  }
}
