import { Layout } from '@/components/layout/root'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Layout>
      <Button onClick={() => alert('clicked!')}>Click me</Button>
      <Link to='/translate'>Translate</Link>
      <div className='flex flex-col p-4 border rounded-md bg-red-200'>
        <h1 className='text-nord-snow-1 font-bold'>
          Nord Palette - Snow 1
        </h1>
        <h1 className='text-nord-snow-2 font-bold'>
          Nord Palette - Snow 2
        </h1>
        <h1 className='text-nord-frost-4 font-bold'>
          Nord Palette - Snow 3
        </h1>
      </div>
    </Layout>
  )
}
