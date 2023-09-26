```tsx
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
```
