import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  return (
    <nav className="w-full flex items-center justify-between px-4 h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-primary">Simple <span className="gradient-text">OpenAI</span></span>
        <div className="flex gap-4 ml-4">
          <Link href="/" legacyBehavior>
            <a className={`text-sm font-medium px-2 py-1 rounded transition-colors ${pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-current={pathname === '/' ? 'page' : undefined}>Chat</a>
          </Link>
          <Link href="/settings" legacyBehavior>
            <a className={`text-sm font-medium px-2 py-1 rounded transition-colors ${pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`} aria-current={pathname === '/settings' ? 'page' : undefined}>Settings</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </nav>
  )
} 