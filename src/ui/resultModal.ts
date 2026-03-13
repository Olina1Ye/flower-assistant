type ResultPayload = {
  name: string
  genus?: string
  family?: string
  score: number
  careTips: string[]
}

function ensureModal() {
  let modal = document.querySelector<HTMLElement>('.result-modal')
  if (modal) return modal

  modal = document.createElement('div')
  modal.className = 'result-modal'
  modal.setAttribute('data-open', 'false')

  modal.innerHTML = `
    <div class="result-card" role="dialog" aria-modal="true">
      <div class="result-top">
        <div>
          <div class="result-name" data-result-name></div>
          <div class="result-meta" data-result-meta></div>
        </div>
        <button class="result-close" type="button" aria-label="关闭" data-result-close>×</button>
      </div>
      <div class="result-section">养护要点</div>
      <ul class="result-list" data-result-tips></ul>
      <div class="result-meta" style="margin-top: 12px" data-result-score></div>
    </div>
  `.trim()

  document.body.appendChild(modal)

  const close = () => modal?.setAttribute('data-open', 'false')

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close()
  })

  const closeBtn = modal.querySelector<HTMLElement>('[data-result-close]')
  closeBtn?.addEventListener('click', close)

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  return modal
}

function open(payload: ResultPayload) {
  const modal = ensureModal()

  const nameEl = modal.querySelector<HTMLElement>('[data-result-name]')
  const metaEl = modal.querySelector<HTMLElement>('[data-result-meta]')
  const tipsEl = modal.querySelector<HTMLUListElement>('[data-result-tips]')
  const scoreEl = modal.querySelector<HTMLElement>('[data-result-score]')

  if (nameEl) nameEl.textContent = payload.name

  const genus = payload.genus?.trim() ? payload.genus : '—'
  const family = payload.family?.trim() ? payload.family : '—'
  if (metaEl) metaEl.textContent = `属：${genus}  科：${family}`

  if (tipsEl) {
    tipsEl.innerHTML = ''
    payload.careTips.forEach((t) => {
      const li = document.createElement('li')
      li.textContent = t
      tipsEl.appendChild(li)
    })
  }

  if (scoreEl) {
    scoreEl.textContent = payload.score > 0 ? `置信度：${Math.round(payload.score * 100)}%` : ''
  }

  modal.setAttribute('data-open', 'true')
}

export const openResultModal = {
  ensure: ensureModal,
  open,
}
