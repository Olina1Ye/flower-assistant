import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Page from '../components/Page'
import styles from './AssistantPage.module.css'
import type { ChatMessage } from '../types'
import { fetchAssistantReply, getStarterSuggestions } from '../services/chat'

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function cleanMarkdownContent(content: string): string {
  let cleaned = content
  
  cleaned = cleaned.replace(/(\n\s*){4,}/g, '\n\n')
  
  cleaned = cleaned.replace(/(\n\s*){3,}(?=\s*\|)/g, '\n')
  
  cleaned = cleaned.trim()
  
  return cleaned
}

const STORAGE_KEY = 'flower_assistant_chat_v1'
const PLANT_CONTEXT_KEY = 'plant_context'

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return [
        {
          id: nowId(),
          role: 'assistant',
          content:
            '你好！我是你的 AI 养花助手。你可以告诉我：花的品种、光照位置、浇水频率、叶片/花苞状态，我会给你可执行的养护建议。',
          createdAt: Date.now(),
        },
      ]
    }
    try {
      return JSON.parse(raw) as ChatMessage[]
    } catch {
      return []
    }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)

  const suggestions = useMemo(() => getStarterSuggestions(), [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-80)))
  }, [messages])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  // 处理从识花页带过来的植物上下文
  useEffect(() => {
    const plant = localStorage.getItem(PLANT_CONTEXT_KEY)
    if (plant) {
      localStorage.removeItem(PLANT_CONTEXT_KEY)
      // 延迟一点，避免对话被初始化的消息覆盖
      setTimeout(() => {
        void send(`我刚识别了「${plant}」，请问它有什么养护要点？`)
      }, 100)
    }
  }, [])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return

    setError(null)
    const userMsg: ChatMessage = {
      id: nowId(),
      role: 'user',
      content,
      createdAt: Date.now(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const plantContext = localStorage.getItem(PLANT_CONTEXT_KEY) || undefined
      const reply = await fetchAssistantReply(newMessages, plantContext)
      const botMsg: ChatMessage = {
        id: nowId(),
        role: 'assistant',
        content: reply,
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      setError(e instanceof Error ? e.message : '请求失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([
      {
        id: nowId(),
        role: 'assistant',
        content:
          '已清空对话。你可以直接描述问题，比如“叶子发黄、土一直湿、放在窗边散射光”。',
        createdAt: Date.now(),
      },
    ])
  }

  return (
    <Page>
      <div className={styles.container}>
        <header className={styles.header}>
          <div></div>
          <h2 className={styles.title}>AI 养花助手</h2>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={styles.clearBtn}
            onClick={clearChat}
            type="button"
          >
            清空对话
          </motion.button>
        </header>

        <div className={styles.panel}>
          <div ref={listRef} className={styles.chatList}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={[styles.msgRow, m.role === 'user' ? styles.userRow : styles.botRow].join(' ')}
              >
                <div className={styles.bubble}>
                  <div className={styles.roleLabel}>{m.role === 'user' ? '你' : '助手'}</div>
                  <div className={styles.content}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {cleanMarkdownContent(m.content)}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {loading ? (
              <div className={[styles.msgRow, styles.botRow].join(' ')}>
                <div className={styles.bubble}>
                  <div className={styles.roleLabel}>助手</div>
                  <div className={styles.loadingDots} aria-label="思考中">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.suggestions}>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.chip}
                onClick={() => send(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault()
              void send(input)
            }}
          >
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述你的花的状态，比如：叶尖发黄、土壤潮湿、放在北向窗边..."
              disabled={loading}
            />
            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={styles.sendBtn}
              disabled={loading || !input.trim()}
            >
              发送
            </motion.button>
          </form>
        </div>
      </div>
    </Page>
  )
}
