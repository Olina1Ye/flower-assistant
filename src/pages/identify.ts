import { identifyWithPlantNet } from '../services/plantnet'
import { openResultModal } from '../ui/resultModal'

export function mountIdentify(root: HTMLElement) {
  const uploadBtn = root.querySelector<HTMLElement>('[data-action="identify-upload"]')
  const previewImg = root.querySelector<HTMLImageElement>('[data-identify-preview-img]')
  const previewCard = root.querySelector<HTMLElement>('[data-identify-preview-card]')

  if (!uploadBtn) return

  // UI tweaks: 移除设计稿中的“热门花卉”板块与“查看更多”按钮（如果存在），并把预览卡片移到左侧
  try {
    const hotSection = Array.from(root.querySelectorAll<HTMLElement>('div')).find((d) => d.textContent?.includes('热门花卉'))
    if (hotSection && hotSection.parentElement) {
      hotSection.parentElement.removeChild(hotSection)
    }
    if (previewCard) {
      previewCard.style.left = '80px'
    }
  } catch (e) {
    // ignore
  }

  // 隐藏 input，不改变设计（避免重复创建）
  const existing = document.getElementById('identify-file-input') as HTMLInputElement | null
  const input = existing ?? document.createElement('input')

  if (!existing) {
    input.id = 'identify-file-input'
    input.type = 'file'
    input.accept = 'image/*'
    input.setAttribute('capture', 'environment')
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    input.style.top = '-9999px'
    document.body.appendChild(input)
  }


  const ensureModal = openResultModal.ensure

  uploadBtn.addEventListener('click', () => {
    input.click()
  })

  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (!file) return

    // 预览：把右侧卡片图替换为用户上传（不改布局尺寸）
    const url = URL.createObjectURL(file)
    if (previewImg) previewImg.src = url
    if (previewCard) previewCard.style.backgroundImage = previewCard.style.backgroundImage

    ensureModal()

    try {
      uploadBtn.setAttribute('data-loading', 'true')

      const result = await identifyWithPlantNet(file)

      openResultModal.open({
        name: result.name,
        genus: result.genus,
        family: result.family,
        careTips: result.careTips,
        score: result.score,
      })
    } catch (e) {
      openResultModal.open({
        name: '（识别失败）',
        genus: '',
        family: '',
        careTips: [e instanceof Error ? e.message : '请求失败'],
        score: 0,
      })
    } finally {
      uploadBtn.removeAttribute('data-loading')
    }
  })
}
