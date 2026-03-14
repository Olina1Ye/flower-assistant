// 测试反馈 API
const testFeedback = async () => {
  const API_BASE = 'http://127.0.0.1:3001/api';
  
  // 测试提交反馈
  console.log('测试提交反馈...');
  const submitResponse = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: '测试反馈内容 - ' + new Date().toISOString()
    })
  });
  
  const submitResult = await submitResponse.json();
  console.log('提交结果:', submitResult);
  
  // 测试查询反馈
  console.log('\n测试查询反馈...');
  const getResponse = await fetch(`${API_BASE}/feedback`);
  const getResult = await getResponse.json();
  console.log('查询结果:', getResult);
};

testFeedback().catch(console.error);
