import fetch from 'node-fetch'

const API_BASE = 'http://localhost:3001/api'

async function testFeedback() {
  console.log('=== 测试反馈功能 ===\n')
  
  // 测试提交反馈
  console.log('1. 测试提交反馈...')
  try {
    const submitRes = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '这是一个测试反馈-' + Date.now() })
    })
    const submitData = await submitRes.json()
    console.log('提交结果:', submitData)
    
    if (submitData.success) {
      console.log('✓ 提交成功\n')
      
      // 测试查询反馈
      console.log('2. 测试查询反馈...')
      const getRes = await fetch(`${API_BASE}/feedback`)
      const feedbacks = await getRes.json()
      console.log(`查询到 ${feedbacks.length} 条反馈:`)
      feedbacks.forEach((f, i) => {
        console.log(`   ${i + 1}. [ID: ${f.id}] ${f.content.substring(0, 30)}... (${f.createdAt})`)
      })
      console.log('\n✓ 所有测试通过!\n')
    } else {
      console.log('✗ 提交失败\n')
    }
  } catch (error) {
    console.error('测试失败:', error.message)
    console.log('\n请确保服务器正在运行：node server.js\n')
  }
}

testFeedback()
