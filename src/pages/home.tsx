import { Layout } from '@/components/layout/root'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <Layout>
      <Button onClick={() => alert('clicked!')}>Click me</Button>
    </Layout>
  )
}
