import { HomeIcon, LanguagesIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  external?: boolean
}

const nav: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: <HomeIcon />,
  },
  {
    title: 'Translate',
    href: '/translate',
    icon: <LanguagesIcon />,
  },
]

export function NavBar() {
  const { pathname } = useLocation()

  return (
    <div className='fixed top-0 left-0 h-screen w-14 bg-zinc-800 flex flex-col items-center pt-8 space-y-2'>
      {nav.map((item, i) => (
        <NavBarLinkItem
          key={i}
          item={item}
          path={pathname}
        />
      ))}
    </div>
  )
}

function NavBarLinkItem({ item, path }: { item: NavItem; path: string }) {
  const isActive = path === item.href

  return (
    <Link
      to={item.href}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 mx-auto shadow-lg bg-nord-night-1',
        'text-muted-foreground hover:bg-nord-frost-4 hover:text-nord-snow-1 rounded-full hover:rounded-xl',
        'transition-all duration-100 ease-linear cursor-pointer',
        isActive && 'bg-nord-frost-4 text-nord-snow-1 rounded-xl',
      )}
    >
      {item.icon}
    </Link>
  )
}
