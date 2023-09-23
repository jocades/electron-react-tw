import { Layout } from '@/components/layout/root'
import { delay } from '@/lib/utils'
import { db } from '@/main/db'
import { Translation } from '@/main/db/schema'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  username: string
  email: string
}

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

const api = {
  users: {
    list: (options: UseQueryOptions<User[], Error> = {}) =>
      useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: async () => {
          return fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
        },
        ...options,
      }),
  },
  posts: {
    get: (id: number) =>
      useQuery<Post, Error>({
        queryKey: ['posts', id],
        queryFn: async () => {
          await delay(3)
          return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then((res) => res.json())
        },
      }),
  },
  translations: {
    list: (options: UseQueryOptions<User[], Error> = {}) => {
    },
  },
}

export default function Home() {
  /* const result = useQuery<User[], Error>({
    queryKey: ['test'],
    queryFn: async () => {
      // throw new Error('test')
      await delay(3)
      return fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
    },
  }) */

  const res = api.users.list({
    onError: (err) => {
      console.error(err)
    },
  })

  const { data: post, isLoading: postLoading } = api.posts.get(1)

  // if (res.isLoading) return <div>Loading...</div>

  if (res.isError) return <div>Error: {res.error.message}</div>

  return (
    <Layout title='Home'>
      <pre>{JSON.stringify(res.data?.slice(0,1), null, 2)}</pre>
      {postLoading
        ? (
          <div className='w-full border rounded-md h-20 bg-red-200'>
            Loading...
          </div>
        )
        : <pre>{JSON.stringify(post, null, 2)}</pre>}
    </Layout>
  )
}
