import http from 'http';

const data = JSON.stringify({ name: '玫瑰' });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/care-tips',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`状态码：${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('响应:', body);
  });
});

req.on('error', (e) => {
  console.error('请求错误:', e.message);
});

req.write(data);
req.end();
