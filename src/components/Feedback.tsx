import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Feedback.module.css';

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    console.log('用户反馈:', feedback);
    setFeedback('');
    setIsOpen(false);
    alert('感谢您的反馈！');
  };

  return (
    <>
      <motion.button
        className={styles.feedbackButton}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        意见反馈
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2>意见反馈</h2>
              <textarea
                className={styles.textarea}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="请输入您的宝贵意见或建议..."
              />
              <div className={styles.modalActions}>
                <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>取消</button>
                <button onClick={handleSubmit} className={styles.submitButton}>提交</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}