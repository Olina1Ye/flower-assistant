// 测试前端到后端的请求
const testMessages = [
  { role: 'system', content: '你是一位经验丰富的养花专家。' },
  { role: 'user', content: '叶子发黄怎么办？' }
]

const knowledge = '黄叶可能是浇水过多、光照不足或根系问题。建议检查土壤湿度，调整浇水量，确保适当光照。'

async function testBackend() {
  console.log('测试前端 -> 后端 /api/chat 端点...\n')
  
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: testMessages,
        knowledge: knowledge,
      }),
    })

    const data = await response.json()
    
    console.log('HTTP 状态码:', response.status)
    console.log('\n完整响应:')
    console.log(JSON.stringify(data, null, 2))
    
    if (response.ok && data.output && data.output.text) {
      console.log('\n✅ AI 回复内容:')
      console.log(data.output.text.substring(0, 200) + '...')
    } else {
      console.log('\n❌ API 返回错误')
      if (data.error) {
        console.log('错误信息:', data.error)
      }
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
}

testBackend()
