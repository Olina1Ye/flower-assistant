import './index.css'
import './figma/app.css'

// 调试：确认 main.ts 是否在浏览器中执行
try {
  // eslint-disable-next-line no-console
  console.log('[main.ts] boot', { pathname: typeof window !== 'undefined' ? window.location.pathname : null })
} catch (e) {
  // ignore
}

import { assistantHtml, homeHtml, identifyHtml, pageMetaByPath } from './figma/pages'
import { mountAssistant } from './pages/assistant'
import { mountIdentify } from './pages/identify'

type Path = '/' | '/assistant' | '/identify'

const routes: Record<Path, () => void> = {
  '/': () => renderPage('/', homeHtml),
  '/assistant': () => renderPage('/assistant', assistantHtml),
  '/identify': () => renderPage('/identify', identifyHtml),
}

function getRoot() {
  const el = document.getElementById('root')
  if (!el) throw new Error('Missing #root')
  return el
}

function setTitle(path: string) {
  const meta = pageMetaByPath[path]
  if (meta?.title) document.title = meta.title
}

function applyScale(meta?: { baseWidth: number; baseHeight: number; maxRenderedWidth?: number }) {
  const baseWidth = meta?.baseWidth ?? 1440
  const baseHeight = meta?.baseHeight ?? 1300

  const maxSiteWidth = 1200
  const maxRenderedWidth = Math.min(meta?.maxRenderedWidth ?? maxSiteWidth, maxSiteWidth)

  const scale = Math.min(window.innerWidth / baseWidth, maxRenderedWidth / baseWidth, 1)

  document.documentElement.style.setProperty('--figma-scale', String(scale))
  document.documentElement.style.setProperty('--figma-base-width', String(baseWidth))
  document.documentElement.style.setProperty('--figma-base-height', String(baseHeight))
}


function renderPage(path: string, html: string) {
  try {
    // eslint-disable-next-line no-console
    console.log('[main.ts] renderPage called', { path })
  } catch (e) {}
  setTitle(path)

  const meta = pageMetaByPath[path]
  applyScale(meta)

  const root = getRoot()
  root.classList.remove('page-enter')
  root.innerHTML = `\n    <div class="app-root">\n      <div class="figma-viewport">\n        <div class="figma-scale">\n          <div class="figma-inner">\n            <div class="figma-frame" data-path="${path}">${html}</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  `
  try {
    // eslint-disable-next-line no-console
    console.log('[main.ts] set innerHTML, html length', { len: String(html?.length ?? 0), preview: root.innerHTML.slice(0,200) })
  } catch (e) {}

  // 简单入场动画
  requestAnimationFrame(() => root.classList.add('page-enter'))

  // 通用：绑定所有 data-nav
  bindNav(root)

  // 页面挂载逻辑
  if (path === '/assistant') mountAssistant(root)
  if (path === '/identify') mountIdentify(root)
}

function bindNav(root: HTMLElement) {
  const navEls = root.querySelectorAll<HTMLElement>('[data-nav]')
  navEls.forEach((el) => {
    el.style.cursor = 'pointer'
    el.tabIndex = 0
    el.setAttribute('role', 'button')

    const to = el.getAttribute('data-nav')
    if (!to) return

    const onActivate = () => navigate(to)

    el.addEventListener('click', onActivate)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onActivate()
      }
    })
  })
}

function normalizePath(path: string): Path {
  if (path === '/' || path === '/assistant' || path === '/identify') return path
  return '/'
}

export function navigate(path: string) {
  const next = normalizePath(path)
  if (window.location.pathname === next) return
  window.history.pushState({}, '', next)
  routes[next]()
}

window.addEventListener('popstate', () => {
  routes[normalizePath(window.location.pathname)]()
})

window.addEventListener('resize', () => {
  const meta = pageMetaByPath[window.location.pathname]
  applyScale(meta)
})


// 初次渲染
try {
  // eslint-disable-next-line no-console
  console.log('[main.ts] initial render start', { pathname: window.location.pathname })
} catch (e) {}
routes[normalizePath(window.location.pathname)]()
try {
  // eslint-disable-next-line no-console
  console.log('[main.ts] initial render done')
} catch (e) {}
