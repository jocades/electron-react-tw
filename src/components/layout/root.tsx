function Nav() {
  return (
    <div className='sticky top-0 z-50 flex items-center justify-between w-full px-4 py-2 bg-zinc-300'>
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <title>{title}</title>
      <section className='flex flex-col items-center justify-center min-h-screen py-2'>
        {children}
      </section>
    </>
  )
}
