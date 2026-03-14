// 测试前端到后端的 chat API 调用
async function testChat() {
  const messages = [
    { role: 'user', content: '我的植物叶子发黄了，怎么办？' }
  ]
  
  const systemPrompt = '你是一位经验丰富的养花专家和园艺顾问。'
  
  const knowledge = '黄叶可能是浇水过多或缺肥导致的。'
  
  console.log('🚀 开始测试 Chat API...')
  
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
        knowledge,
      }),
    })
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error:', errorText)
      return
    }
    
    const data = await response.json()
    console.log('✅ Response data:')
    console.log(JSON.stringify(data, null, 2))
    
    const replyText = data.output?.text
    if (replyText && replyText.trim()) {
      console.log('\n💬 AI 回复:', replyText)
    } else {
      console.warn('⚠️ AI 返回空响应')
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }
}

testChat()
