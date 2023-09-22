import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-center bg-white shadow-lg rounded-lg w-1/2 h-1/2'>
        Hello World!
      </div>

      <Button onClick={() => alert('clicked!')}>Click me</Button>
    </div>
  )
}
