import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/assistant', label: 'AI 养花助手' },
  { to: '/identify', label: '拍照识花' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className={styles.appShell}>
      <div aria-hidden className={styles.bgDecor} />

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <NavLink to="/" className={styles.brand} aria-label="返回首页">
            <Logo />
            <span className={styles.brandText}>花伴</span>
          </NavLink>

          <nav className={styles.nav} aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
                }
                aria-current={location.pathname === item.to ? 'page' : undefined}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.userActions} />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLeft}>清新自然，从每一朵花开始</span>
          <span className={styles.footerHint}>养花更轻松</span>
        </div>
      </footer>
    </div>
  )
}
