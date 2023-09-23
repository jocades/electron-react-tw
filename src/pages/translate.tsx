import { Layout } from '@/components/layout/root'
import { buttonVariants } from '@/components/ui/button'
import { Link } from 'react-router-dom'

/*
 * Main task for now is to open the file explirer, select a json file,
 * send it to the node process so that it can make a request to the openai api,
 * save the response in sqlite local db and return the response to the client.
 * Paint the reponse in this page.
 */

export default function Translate() {
  return (
    <Layout title='Translate'>
      <Link to='/' className={buttonVariants({ variant: 'outline' })}>
        Home
      </Link>
      <div className='text-2xl font-bold leading-none tracking-tight text-center '>
        <h1 className='mb-2'>Translate</h1>
        <p className='mb-2 text-nord-green'>
          This is a page that will be translated.
        </p>
      </div>
    </Layout>
  )
}
