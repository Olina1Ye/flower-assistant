import { useState } from 'react';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!message.trim()) {
      setStatus('error');
      setStatusMessage('请输入反馈内容');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setStatusMessage('感谢您的反馈！');
        setMessage('');
        setTimeout(onClose, 1500);
      } else {
        setStatus('error');
        setStatusMessage(data.error || '提交失败，请重试');
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('网络错误，请检查服务器');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>📝 用户反馈</h2>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="请描述您的问题或建议..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            disabled={loading}
          />
          
          {statusMessage && (
            <div className={`${styles.status} ${styles[status]}`}>
              {statusMessage}
            </div>
          )}
          
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '提交中...' : '提交'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
