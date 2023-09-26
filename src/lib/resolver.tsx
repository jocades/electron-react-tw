import { useEffect, useReducer, useState } from 'react'
import { ElectronHandler } from '@/main/preload'
import { delay } from './utils'

export interface QueryOptions<T, E> {
  fn: () => Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

export function useQuery<T, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: QueryOptions<T, E>) {
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
      const result = await fn()
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
  const { data, isLoading, isError, error, refetch } = useQuery(
    {
      fn: async () => {
        await delay(1)
        console.log('axios.get(/users)')
        return [userData]
      },
      onSucces: (data) => {
        console.log('onSucces', data)
      },
      onError: (error) => {
        console.log('onError', error)
      },
    },
  )

  if (isLoading) return <div>Loading...</div>

  if (isError) return <div>Error: {error.message}</div>

  // Assume valid data at this point
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export interface MutationOptions<T, I, E> {
  fn: (input: I) => T | Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

interface Ctx<I> {
  ipc: ElectronHandler
  input: I
}

export function useMutation<T = unknown, I = T, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: MutationOptions<T, I, E>) {
  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  async function mutate(input: I) {
    setIsLoading(true)
    try {
      const result = await fn(input)
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

const userData = {
  id: 1,
  name: 'Jordi',
  age: 25,
}

interface User {
  id: number
  name: string
  age: number
}

function MutationExample() {
  const { mutate, data, isLoading, isError, error } = useMutation<
    User,
    Omit<User, 'id'>
  >(
    {
      fn: async (input) => {
        delay(1) // await axios.post('/users', input)
        console.log('input', input)
        return userData
      },
      onSucces: (data) => {
        console.log('onSucces', data)
      },
      onError: (error) => {
        console.log('onError', error)
      },
    },
  )
  mutate({ name: 'Jordi', age: 25 })
}

const api = {
  users: {
    list: () =>
      useQuery<User[], Error>({
        fn: async () => {
          await delay(1)
          console.log(`axios.get('/users')`)
          return [userData]
        },
      }),
    create: () =>
      useMutation<User, Omit<User, 'id'>, Error>({
        fn: async (input) => {
          await delay(1) // await axios.post('/users', input)
          console.log(`axios.post('/users', ${input})`)
          return userData
        },
      }),
    get: (id: number) =>
      useQuery<User, Error>({
        fn: async () => {
          await delay(1)
          console.log(`axios.get('/users/${id}')`)
          return userData
        },
      }),
  },
}

function APIExample() {
  const { data, isLoading, isError, error, refetch } = api.users.list()
  const { mutate } = api.users.create()
}
