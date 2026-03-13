export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export type PlantOrgan = 'flower' | 'leaf' | 'fruit' | 'bark'

export type FlowerIdentifyResult = {
  name: string
  genus?: string
  family?: string
  score: number
  careTips: string[]
}
