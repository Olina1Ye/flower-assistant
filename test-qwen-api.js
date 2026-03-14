import 'dotenv/config'

const apiKey = process.env.VITE_QWEN_API_KEY

console.log('测试 Qwen API 直接调用...\n')

const testMessages = [
  { role: 'system', content: '你是一位经验丰富的养花专家。' },
  { role: 'user', content: '叶子发黄怎么办？' }
]

const knowledge = '黄叶可能是浇水过多、光照不足或根系问题。建议检查土壤湿度，调整浇水量，确保适当光照。'

let prompt = ''
for (const msg of testMessages) {
  if (msg.role === 'system') {
    let systemContent = msg.content
    if (knowledge) {
      systemContent += `\n\n你还可以参考以下的专家知识来更好地回答用户的问题：\n---\n${knowledge}\n---`
    }
    prompt += systemContent + '\n\n'
  } else if (msg.role === 'user') {
    prompt += `用户：${msg.content}\n`
  } else if (msg.role === 'assistant') {
    prompt += `助手：${msg.content}\n`
  }
}
prompt += '助手：'

console.log('发送的请求提示词:')
console.log(prompt)
console.log('\n---\n')

try {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      input: {
        prompt: prompt,
      },
      parameters: {
        temperature: 0.6,
        top_p: 0.8,
        max_tokens: 500,
      },
    }),
  })

  const data = await response.json()
  
  console.log('HTTP 状态码:', response.status)
  console.log('\n完整响应:')
  console.log(JSON.stringify(data, null, 2))
  
  if (response.ok && data.output && data.output.text) {
    console.log('\n✅ AI 回复内容:')
    console.log(data.output.text)
  } else {
    console.log('\n❌ API 返回错误')
    if (data.code) {
      console.log('错误代码:', data.code)
    }
    if (data.message) {
      console.log('错误信息:', data.message)
    }
  }
} catch (error) {
  console.error('请求失败:', error)
}
