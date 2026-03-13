import { openResultModal } from '../ui/resultModal'

type ChatMsg = { role: 'user' | 'assistant'; text: string }

const STORAGE_KEY = 'flower_chat_v2'

export function mountAssistant(root: HTMLElement) {
  const chatBox = root.querySelector<HTMLElement>('[data-chat="assistant"]')
  const input = root.querySelector<HTMLInputElement>('[data-action="assistant-input"]')
  const sendBtn = root.querySelector<HTMLElement>('[data-action="assistant-send"]')
  const placeholderText = root.querySelector<HTMLElement>('[data-placeholder-text]')

  if (!chatBox || !input || !sendBtn) return

  const inputEl = input
  const sendBtnEl = sendBtn

  // 在灰色框内加一个滚动层，不改变外观
  const scroll = document.createElement('div')
  scroll.className = 'assistant-chat-scroll'
  chatBox.appendChild(scroll)

  const state = loadState()
  renderChat(scroll, state)

  const syncPlaceholder = () => {
    if (!placeholderText) return
    placeholderText.style.opacity = inputEl.value.trim() ? '0' : '1'
  }
  syncPlaceholder()

  inputEl.addEventListener('input', syncPlaceholder)
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void send()
    }
  })

  sendBtnEl.addEventListener('click', () => void send())

  async function send() {
    const text = inputEl.value.trim()
    if (!text) return

    inputEl.value = ''
    syncPlaceholder()


    state.push({ role: 'user', text })
    persistState(state)
    renderChat(scroll, state)

    // 若配置了对话接口就调用，否则给出最小提示（不预置示例对话）
    const apiUrl = import.meta.env.VITE_CHAT_API_URL
    if (!apiUrl) {
      state.push({ role: 'assistant', text: '（未配置 AI 服务）' })
      persistState(state)
      renderChat(scroll, state)
      return
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state }),
      })

      if (!res.ok) throw new Error(`请求失败：${res.status}`)
      const data = (await res.json()) as { reply?: string }
      state.push({ role: 'assistant', text: data.reply ?? '' })
    } catch {
      state.push({ role: 'assistant', text: '（请求失败）' })
    }

    persistState(state)
    renderChat(scroll, state)
  }

  // 第一次进入时如果没有任何消息，不显示额外内容，保持画面“空”
  if (state.length === 0) {
    openResultModal.ensure()
  }
}

function renderChat(container: HTMLElement, messages: ChatMsg[]) {
  container.innerHTML = ''

  messages.forEach((m) => {
    const row = document.createElement('div')
    row.className = m.role === 'user' ? 'assistant-row user' : 'assistant-row bot'

    const bubble = document.createElement('div')
    bubble.className = 'assistant-bubble'
    bubble.textContent = m.text

    row.appendChild(bubble)
    container.appendChild(row)
  })

  container.scrollTop = container.scrollHeight
}

function loadState(): ChatMsg[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ChatMsg[]
  } catch {
    return []
  }
}

function persistState(state: ChatMsg[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.slice(-60)))
}
