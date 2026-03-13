import { getCareTips } from './tips'

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

export type IdentifyResult = {
  name: string
  genus?: string
  family?: string
  score: number
  careTips: string[]
}

function pickName(species: PlantNetSpecies) {
  const commonZh = species.commonNames?.find((n) => /[\u4e00-\u9fa5]/.test(n))
  const common = commonZh || species.commonNames?.[0]
  return common || species.scientificNameWithoutAuthor || species.scientificName || '鏈煡'
}

export async function identifyWithPlantNet(file: File): Promise<IdentifyResult> {
  const apiKey = import.meta.env.VITE_PLANTNET_API_KEY
  if (!apiKey) {
    throw new Error('鏈厤缃?VITE_PLANTNET_API_KEY')
  }

  // 閫氳繃鏈湴浠ｇ悊杞彂 multipart锛岄伩鍏嶆祻瑙堝櫒渚?CORS / 涓斾笉鐮村潖 boundary
  const url = new URL('http://localhost:3001/api/identify')
  url.searchParams.set('api-key', apiKey)
  url.searchParams.set('lang', 'zh')
  url.searchParams.set('include-related-images', 'false')

  const form = new FormData()
  form.append('images', file, file.name)
  form.append('organs', 'flower')

  const res = await fetch(url.toString(), { method: 'POST', body: form })

  // 检查响应类型是否为 JSON
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    console.error('非 JSON 响应:', text);
    throw new Error(PlantNet 返回了非 JSON 响应：);
  }

  // 检查响应类型是否为 JSON
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    console.error('非 JSON 响应:', text);
    throw new Error(PlantNet 返回了非 JSON 响应：);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`PlantNet 璇锋眰澶辫触锛?{res.status}${text ? ` - ${text.slice(0, 120)}` : ''}`)
  }

  const data = (await res.json()) as PlantNetResponse
  const top = data.results?.[0]
  if (!top) throw new Error('鏈繑鍥炶瘑鍒粨鏋?)

  const name = pickName(top.species)
  const genus = top.species.genus?.scientificNameWithoutAuthor
  const family = top.species.family?.scientificNameWithoutAuthor

  return {
    name,
    genus,
    family,
    score: top.score,
    careTips: getCareTips({ name, genus, family }),
  }
}


