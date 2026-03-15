import type { FlowerIdentifyResult, PlantOrgan } from '../types'
import { translateTaxonomy } from './taxonomy'

const API_BASE = "/api";

type IdentifyParams = {
  file: File
  organ: PlantOrgan
}

type PlantNetSpecies = {
  scientificNameWithoutAuthor?: string
  scientificName?: string
  commonNames?: string[]
  genus?: { scientificNameWithoutAuthor?: string }
  family?: { scientificNameWithoutAuthor?: string }
}

type PlantNetResult = {
  score: number
  species: PlantNetSpecies
}

type PlantNetResponse = {
  results?: PlantNetResult[]
}

function pickName(species: PlantNetSpecies) {
  const common = species.commonNames?.find((n) => /[\u4e00-\u9fa5]/.test(n)) || species.commonNames?.[0]
  return common || species.scientificNameWithoutAuthor || species.scientificName || '未知花卉'
}

export async function identifyFlower(params: IdentifyParams): Promise<FlowerIdentifyResult> {
  const url = new URL(`${API_BASE}/identify`, window.location.origin)
  url.searchParams.set('lang', 'zh')
  url.searchParams.set('include-related-images', 'false')

  const form = new FormData()
  form.append('images', params.file)
  form.append('organs', params.organ)

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: form,
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`识花 API 请求失败：${res.status}${text ? ` - ${text.slice(0, 140)}` : ''}`)
  }

  const data = (await res.json()) as PlantNetResponse
  const top = data.results?.[0]

  if (!top) {
    throw new Error('识花 API 未返回结果，请换一张更清晰的图片试试')
  }

  const name = pickName(top.species)
  const [genus, family] = await Promise.all([
    translateTaxonomy(top.species.genus?.scientificNameWithoutAuthor),
    translateTaxonomy(top.species.family?.scientificNameWithoutAuthor),
  ]);

  // 调用新的后端服务获取养护要点
  const careTipsRes = await fetch(`${API_BASE}/care-tips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, genus, family }),
  });

  if (!careTipsRes.ok) {
    // 如果获取养护要点失败，可以返回一个默认提示或错误
    console.error('Failed to fetch care tips');
    throw new Error('获取养护建议失败');
  }

  const careTipsData = await careTipsRes.json();
  const careTips = careTipsData.tips || [];

  return {
    name,
    genus,
    family,
    score: top.score,
    careTips,
  }
}
