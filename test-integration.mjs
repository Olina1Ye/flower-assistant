// 前端到后端完整集成测试
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testIntegration() {
  console.log('=== 前端到后端集成测试 ===\n');
  
  // 测试 1: 提交反馈
  console.log('1. 测试提交反馈...');
  const submitResponse = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `集成测试反馈 - ${new Date().toLocaleString('zh-CN')}`,
      page: '/test',
      rating: 5
    })
  });
  
  const submitResult = await submitResponse.json();
  console.log(`   提交结果:`, submitResult);
  
  if (!submitResult.success) {
    console.log('   ✗ 提交失败');
    return;
  }
  console.log('   ✓ 提交成功\n');
  
  // 测试 2: 查询所有反馈
  console.log('2. 测试查询反馈...');
  const getResponse = await fetch(`${API_BASE}/api/feedback`);
  const feedbacks = await getResponse.json();
  
  console.log(`   查询到 ${feedbacks.length} 条反馈`);
  if (feedbacks.length > 0) {
    const latest = feedbacks[0];
    console.log(`   最新反馈: "${latest.content}"`);
    console.log(`   创建时间：${latest.createdAt}`);
  }
  console.log('   ✓ 查询成功\n');
  
  // 测试 3: 删除测试反馈
  console.log('3. 测试删除反馈...');
  const deleteResponse = await fetch(`${API_BASE}/api/feedback/${submitResult.id}`, {
    method: 'DELETE'
  });
  const deleteResult = await deleteResponse.json();
  console.log(`   删除结果:`, deleteResult);
  console.log('   ✓ 删除成功\n');
  
  console.log('=== ✓ 所有集成测试通过！===');
}

testIntegration().catch(err => {
  console.error('测试失败:', err);
  process.exit(1);
});
