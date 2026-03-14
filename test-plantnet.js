const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testPlantNet() {
  const apiKey = process.env.PLANTNET_API_KEY;
  
  if (!apiKey) {
    console.error('错误：缺少 PLANTNET_API_KEY 环境变量');
    process.exit(1);
  }

  console.log('使用 API Key:', apiKey.substring(0, 6) + '...');

  // 使用一个测试图片（如果没有，会创建一个简单的占位文件）
  const testImage = 'test_plant.jpg';
  
  if (!fs.existsSync(testImage)) {
    console.log(`创建测试图片文件：${testImage}`);
    // 创建一个空的占位文件用于测试
    fs.writeFileSync(testImage, Buffer.from([]));
  }

  const url = new URL('https://my-api.plantnet.org/v2/identify/all');
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('lang', 'zh');
  url.searchParams.set('include-related-images', 'false');

  const form = new FormData();
  form.append('images', fs.createReadStream(testImage), testImage);
  form.append('organs', 'leaf');

  console.log('发送请求到 PlantNet API...');
  
  try {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    console.log('响应状态:', resp.status);
    
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.error('PlantNet API 错误:', resp.status, text);
      return;
    }

    const data = await resp.json();
    console.log('PlantNet 返回数据:', JSON.stringify(data, null, 2));
    
    if (data.results && data.results.length > 0) {
      console.log('\n识别结果:');
      data.results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.species.name} (${result.score.toFixed(1)}%)`);
      });
    } else {
      console.log('未识别出植物');
    }
  } catch (error) {
    console.error('测试失败:', error.message);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testImage)) {
      fs.unlinkSync(testImage);
      console.log('\n已清理测试文件');
    }
  }
}

testPlantNet();
