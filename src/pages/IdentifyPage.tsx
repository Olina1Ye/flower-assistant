import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import styles from './IdentifyPage.module.css'
import type { FlowerIdentifyResult, PlantOrgan } from '../types'
import { identifyFlower } from '../services/identify'

import { useNavigate } from 'react-router-dom'

const organOptions: { value: PlantOrgan; label: string }[] = [
  { value: 'flower', label: '花' },
  { value: 'leaf', label: '叶' },
  { value: 'fruit', label: '果' },
  { value: 'bark', label: '树皮' },
]

const PLANT_CONTEXT_KEY = 'plant_context'

export default function IdentifyPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [organ, setOrgan] = useState<PlantOrgan>('flower')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<FlowerIdentifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  function pickFile() {
    inputRef.current?.click()
  }

  function handleFile(next: File | null) {
    setError(null)
    setResult(null)

    if (!next) {
      setFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      return
    }

    setFile(next)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(next))
  }

  async function runIdentify() {
    if (!file || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await identifyFlower({ file, organ })
      setResult(res)
    } catch (e) {
      const message = e instanceof Error ? e.message : '识别失败，请稍后再试'
      if (message.includes('未返回结果')) {
        setError('未能识别成功，请尝试上传更清晰、主体更突出的照片，或从不同角度拍摄。')
      } else {
        setError('识别服务暂时遇到问题，请稍后再试。')
      }
    } finally {
      setLoading(false)
    }
  }

  function askAI() {
    if (!result) return
    localStorage.setItem(PLANT_CONTEXT_KEY, result.name)
    navigate('/assistant')
  }

  return (
    <Page>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>拍照识花</h2>
          </div>
        </header>

        <section className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.uploader}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className={styles.hiddenInput}
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              <div className={styles.uploadTop}>
                <div className={styles.uploadTitle}>上传照片</div>
                <div className={styles.uploadDesc}>支持 JPG / PNG，建议清晰对焦花朵或叶片。</div>
              </div>

              <div className={styles.previewRow}>
                <div className={styles.resultCard}>
                  <div className={styles.resultTitle}>识别结果</div>

                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className={styles.kv}>
                        <div className={styles.k}>花卉名称</div>
                        <div className={styles.v}>{result.name}</div>
                      </div>
                      <div className={styles.kvGrid}>
                        <div className={styles.kv}>
                          <div className={styles.k}>属</div>
                          <div className={styles.v}>{result.genus || '—'}</div>
                        </div>
                        <div className={styles.kv}>
                          <div className={styles.k}>科</div>
                          <div className={styles.v}>{result.family || '—'}</div>
                        </div>
                      </div>

                      <div className={styles.sectionTitle}>养护要点</div>
                      <ul className={styles.list}>
                        {result.careTips.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>

                      <div className={styles.scoreRow}>
                        <span className={styles.scoreLabel}>置信度</span>
                        <span className={styles.scoreValue}>{Math.round(result.score * 100)}%</span>
                        {result.score < 0.5 && (
                          <div className={styles.lowScoreWarning}>
                            （置信度较低，结果可能不准，建议更换照片重试）
                          </div>
                        )}
                      </div>

                      <div className={styles.askAiRow}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={styles.askAiBtn}
                          onClick={askAI}
                        >
                          问问 AI 关于「{result.name}」的问题
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : loading ? (
                    <div className={styles.empty}>正在分析图片，请稍候...</div>
                  ) : (
                    <div className={styles.empty}>
                      上传图片并点击「开始识别」，这里会显示结果。
                    </div>
                  )}
                </div>

                <div className={styles.dropArea}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="预览" className={styles.previewImg} />
                  ) : (
                    <div className={styles.placeholder}>
                      <div className={styles.placeholderIcon} aria-hidden>
                        ⌁
                      </div>
                      <div className={styles.placeholderText}>点击下方按钮选择图片</div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.controls}>
                <div className={styles.organRow}>
                  <span className={styles.label}>拍摄部位</span>
                  <div className={styles.segment} role="group" aria-label="选择拍摄部位">
                    {organOptions.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        className={[styles.segmentBtn, organ === o.value ? styles.segmentBtnActive : ''].join(
                          ' '
                        )}
                        onClick={() => setOrgan(o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.pickBtn}
                    onClick={pickFile}
                  >
                    选择图片
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.identifyBtn}
                    onClick={() => void runIdentify()}
                    disabled={!file || loading}
                  >
                    {loading ? '识别中...' : '开始识别'}
                  </motion.button>
                </div>

                {error ? <div className={styles.error}>{error}</div> : null}
              </div>
            </div>
          </div>

          
        </section>
      </div>
    </Page>
  )
}
