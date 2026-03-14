// 测试 /api/chat 端点
const fetch = require('node-fetch')

async function testChatEndpoint() {
  try {
    console.log('测试 /api/chat 端点...')
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: '你是一位植物养护专家。请用简洁、友好的中文回答用户的问题。'
          },
          {
            role: 'user',
            content: '绿萝叶子发黄怎么办？'
          }
        ],
        knowledge: '绿萝黄叶可能原因：1.浇水过多 2.光照不足 3.温度过低'
      }),
    })

    const data = await response.json()
    
    console.log('\n=== 响应状态 ===')
    console.log('Status:', response.status)
    console.log('OK:', response.ok)
    
    console.log('\n=== 响应数据 ===')
    console.log(JSON.stringify(data, null, 2))
    
    if (data.output && data.output.text) {
      console.log('\n=== AI 回复 ===')
      console.log(data.output.text)
    }
    
  } catch (error) {
    console.error('\n=== 错误 ===')
    console.error(error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  }
}

testChatEndpoint()
