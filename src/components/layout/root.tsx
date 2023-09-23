import { SideBar } from '../sidebar'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <main className='dark'>
      <SideBar />
      <div className='flex flex-col min-h-screen ml-14'>
        {children}
      </div>
    </main>
  )
}
