import { useEffect, useReducer, useState } from 'react'
import { ElectronHandler } from '@/main/preload'
import { delay } from './utils'

export interface IPCOptions<T, E> {
  fn: (ipc: ElectronHandler) => Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

export function useIPC<T, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: IPCOptions<T, E>) {
  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  const [update, refetch] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    exec()
  }, [update])

  async function exec() {
    setIsLoading(true)
    try {
      const result = await fn(window.electron)
      setData(result)
      setError({ status: false, message: '' })
      onSucces(result)
    } catch (err: any) {
      setError({ status: true, message: err.message })
      onError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    isLoading,
    error,
    isError: error.status,
    refetch,
  }
}

function QueryExample() {
  const { data, isLoading, isError, error, refetch } = useIPC(
    {
      fn: async () => {
        await delay(1)
        return { id: 1, name: 'Jordi' }
      },
      onSucces: (data) => {
        console.log('onSucces', data)
      },
      onError: (error) => {
        console.log('onError', error)
      },
    },
  )
}

export interface IPCMutationOptions<T, I, E> {
  fn: (ctx: Ctx<I>) => T | Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

interface Ctx<I> {
  ipc: ElectronHandler
  input: I
}

/**
 * @param fn - Function to execute
 * @param onSucces - Function to execute on success
 * @param onError - Function to execute on error
 * @example
 *  const { mutate, data, isLoading, isError } = useIPCMutation({
 *    fn: async ({ ipc, input }) => {
 *      const res = await ipc.translate(input);
 *      return res.data;
 *     },
 *     onSucces: (data) => {
 *       console.log('onSucces', data);
 *     },
 *     onError: (error) => {
 *       console.log('onError', error);
 *     },
 * });
 */
export function useIPCMutation<T = unknown, I = T, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: IPCMutationOptions<T, I, E>) {
  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  async function mutate(input: I) {
    setIsLoading(true)
    try {
      const result = await fn({ ipc: window.electron, input })
      setError({ status: false, message: '' })
      setData(result)
      onSucces(result)
    } catch (err: any) {
      setError({ status: true, message: err.message })
      onError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    data,
    isLoading,
    error,
    isError: error.status,
  }
}
