import { Layout } from '@/components/layout/root'
import { Button } from '@/components/ui/button'
import { Translation } from '@/main/db/schema'
import { useCallback, useEffect, useReducer, useState } from 'react'

/*
 * Main task for now is to open the file explirer, select a json file,
 * send it to the node process so that it can make a request to the openai api,
 * save the response in sqlite local db and return the response to the client.
 * Paint the reponse in this page.
 */

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

function useIPC() {
  const [update, forceUpdate] = useReducer((x) => x + 1, 0)

  const [translations, dispatch] = useReducer(translationsReducer, [])

  const [newTranslation, setNewTranslation] = useState<any>()

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
      if (!res.ok) {
        setError({ status: true, message: res.msg })
      } else {
        setNewTranslation(res.data)
        setError({ status: false, message: '' })
        dispatch({ type: 'CREATE', payload: res.data })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    translations,
    refetch: () => forceUpdate(),
    translate,
    newTranslation,
    isLoading,
    error,
    isError: error.status,
  }
}

export default function Translate() {
  const {
    translations,
    refetch,
    translate,
    newTranslation,
    isLoading,
    isError,
    error,
  } = useIPC()

  return (
    <Layout title='Translate'>
      <div className='text-2xl font-bold leading-none tracking-tight text-center '>
        <h1 className='mb-2'>Translate</h1>
        <p className='mb-2 text-nord-green'>
          This is a page that will be translated.
        </p>
      </div>
      <Button
        className='self-center'
        onClick={() =>
          window.electron.ipcRenderer.sendMessage('ipc-example', ['ping'])}
      >
        Send IPC
      </Button>

      <Button
        className='self-center'
        onClick={async () => await translate({ text: 'Hola me llamo Jordi' })}
      >
        Translate
      </Button>
      <pre>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error...{error.message}</p>}
        {newTranslation && JSON.stringify(newTranslation, null, 2)}
      </pre>
    </Layout>
  )
}
