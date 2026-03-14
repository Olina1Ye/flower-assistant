import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Feedback.module.css';

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  // 新增GPT指定的两个状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setSubmitError('反馈内容不能为空');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: feedback,
          page: window.location.pathname,
          rating: 5
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交失败');
      }

      setFeedback('');
      setIsOpen(false);
      alert('感谢您的反馈！');
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
                // 输入时清除错误提示，提升体验
                onChange={(e) => {
                  setFeedback(e.target.value);
                  setSubmitError('');
                }}
                placeholder="请输入您的宝贵意见或建议..."
                // 提交中禁用输入框，防止修改
                disabled={isSubmitting}
              />
              {/* 新增：错误信息展示，有错误才渲染 */}
              {submitError && <p className={styles.submitError}>{submitError}</p>}
              
              <div className={styles.modalActions}>
                {/* 取消按钮：提交中禁用，防止误操作 */}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                {/* 提交按钮：绑定禁用状态，动态修改文字 */}
                <button 
                  onClick={handleSubmit} 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : '提交'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}