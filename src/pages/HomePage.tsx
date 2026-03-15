import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/Page'
import styles from './HomePage.module.css'

export default function HomePage() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: feedbackText }),
      })

      if (response.ok) {
        setFeedbackText('')
        setShowFeedback(false)
        alert('感谢您的反馈！')
      }
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>把花养好，其实很简单</h1>

          <div className={styles.ctaRow}>
            <NavLink to="/assistant">
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

          <div className={styles.feedbackSection}>
            <motion.button
              className={styles.feedbackBtn}
              onClick={() => setShowFeedback(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💬 意见反馈
            </motion.button>
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

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={styles.feedbackModalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              className={styles.feedbackModal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.feedbackTitle}>意见反馈</h3>
              <textarea
                className={styles.feedbackTextarea}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="请输入您的宝贵意见或建议..."
                disabled={isSubmitting}
                rows={5}
              />
              <div className={styles.feedbackActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowFeedback(false)}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedbackText.trim()}
                >
                  {isSubmitting ? '提交中...' : '提交'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
