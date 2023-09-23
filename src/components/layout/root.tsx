export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-col items-center justify-center min-h-screen py-2 bg-zinc-500'>
      <div className='sticky top-0 z-50 flex items-center justify-between w-full px-4 py-2 bg-zinc-300'>
      </div>
      {children}
    </section>
  )
}
