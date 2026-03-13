import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <Page>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>把花养好，其实很简单</h1>

          <div className={styles.ctaRow}>
            <NavLink to="/assistant" className={({ isActive }) => (isActive ? '' : '')}>
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                去问 AI
              </motion.span>
            </NavLink>

            <NavLink to="/identify">
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                拍照识花
              </motion.span>
            </NavLink>
          </div>

          {/*
          <div className={styles.heroRight}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span className={styles.previewPill}>今日养护</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewRow}>
                  <div className={styles.previewIcon} aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M12 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 20v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M3 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.previewTitle}>光照</div>
                    <div className={styles.previewDesc}>优先散射光，避免正午直晒。</div>
                  </div>
                </div>
                <div className={styles.previewRow}>
                  <div className={styles.previewIcon} aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.previewTitle}>浇水</div>
                    <div className={styles.previewDesc}>见干见湿，不积水更健康。</div>
                  </div>
                </div>
                <div className={styles.previewRow}>
                  <div className={styles.previewIcon} aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 20c6-1 10-5 14-14-9 4-13 8-14 14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path d="M9 18c1-3 4-6 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.previewTitle}>养分</div>
                    <div className={styles.previewDesc}>生长期每 2–3 周薄肥一次。</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          */}
        </section>
      </div>
    </Page>
  )
}
