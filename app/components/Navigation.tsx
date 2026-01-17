'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './styles/Navigation.css'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || (path === '/gallery' && pathname?.startsWith('/card'))
  }

  return (
    <nav className="bottom-nav">
      <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </Link>
      <Link href="/gallery" className={`nav-item ${isActive('/gallery') ? 'active' : ''}`}>
        <span className="nav-icon">🃏</span>
        <span className="nav-label">Gallery</span>
      </Link>
      <Link href="/portfolio" className={`nav-item ${isActive('/portfolio') ? 'active' : ''}`}>
        <span className="nav-icon">💼</span>
        <span className="nav-label">Portfolio</span>
      </Link>
      <Link href="/trading" className={`nav-item ${isActive('/trading') ? 'active' : ''}`}>
        <span className="nav-icon">📈</span>
        <span className="nav-label">Trading</span>
      </Link>
      <Link href="/collection" className={`nav-item ${isActive('/collection') ? 'active' : ''}`}>
        <span className="nav-icon">📚</span>
        <span className="nav-label">Collection</span>
      </Link>
    </nav>
  )
}
