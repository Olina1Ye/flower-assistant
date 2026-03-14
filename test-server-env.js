import 'dotenv/config'

console.log('VITE_QWEN_API_KEY:', process.env.VITE_QWEN_API_KEY ? '存在' : '不存在')
console.log('API Key 长度:', process.env.VITE_QWEN_API_KEY?.length || 0)
console.log('API Key 前缀:', process.env.VITE_QWEN_API_KEY?.substring(0, 10) || 'N/A')
