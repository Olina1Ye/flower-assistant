import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import styles from './Layout.module.css'
import Feedback from './Feedback'; // 导入Feedback组件
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/assistant', label: 'AI 养花助手' },
  { to: '/identify', label: '拍照识花' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            {user?.isAdmin && (
              <NavLink
                to="/admin/feedback"
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
                }
                aria-current={location.pathname === '/admin/feedback' ? 'page' : undefined}
              >
                反馈管理
              </NavLink>
            )}
          </nav>

          <div className={styles.userActions}>
            {user ? (
              <button onClick={handleLogout} className={styles.navLink}>登出</button>
            ) : (
              <>
                <NavLink to="/login" className={styles.navLink}>登录</NavLink>
                <NavLink to="/register" className={styles.navLink}>注册</NavLink>
              </>
            )}
          </div>
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
      { user && !user.isAdmin && <Feedback />}
    </div>
  )
}
