10// 测试反馈功能的前端集成
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testFeedback() {
  console.log('=== 测试反馈功能 ===\n');
  
  // 1. 测试提交
  console.log('1. 测试提交反馈...');
  const submitResponse = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: '前端集成测试反馈',
      page: '/test',
      rating: 5
    }),
  });
  
  const submitResult = await submitResponse.json();
  console.log('提交结果:', submitResult);
  
  if (!submitResponse.ok) {
    console.error('❌ 提交失败');
    return;
  }
  console.log('✓ 提交成功\n');
  
  // 2. 测试查询
  console.log('2. 测试查询反馈...');
  const getResponse = await fetch(`${API_BASE}/api/feedback`);
  const feedbacks = await getResponse.json();
  console.log(`查询到 ${feedbacks.length} 条反馈`);
  
  const latestFeedback = feedbacks[feedbacks.length - 1];
  console.log('最新反馈:', latestFeedback);
  console.log('✓ 查询成功\n');
  
  // 3. 测试删除
  console.log('3. 测试删除反馈...');
  const deleteResponse = await fetch(`${API_BASE}/api/feedback/${latestFeedback.id}`, {
    method: 'DELETE',
  });
  
  if (!deleteResponse.ok) {
    console.error('❌ 删除失败');
    return;
  }
  console.log('✓ 删除成功\n');
  
  console.log('✓ 所有测试通过!');
}

testFeedback().catch(console.error);
