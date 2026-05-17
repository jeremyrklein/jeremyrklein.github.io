import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/events', label: 'Event Archive' },
  { to: '/players', label: 'Player Dossiers' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/stats', label: 'Stats' },
]

export default function Layout({ children, isUnlocked }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Game Night Hall of Fame</h1>
        <p>Private history, stats, and highlights for the crew.</p>
      </header>

      <nav className="nav-grid" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'nav-pill-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="lock-indicator">
        Detailed stats: <strong>{isUnlocked ? 'Unlocked' : 'Locked'}</strong>
      </div>

      <main className="page-content">{children}</main>
    </div>
  )
}
