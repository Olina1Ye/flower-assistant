import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(cors())
app.use(express.json())

const usersDB = path.join(__dirname, 'users.json')
const feedbackDB = path.join(__dirname, 'feedback.json')

const readDB = (dbPath) => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${dbPath}:`, error);
    return [];
  }
};

const writeDB = (dbPath, data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${dbPath}:`, error);
  }
};

const createAdmin = async () => {
    const users = readDB(usersDB);
    const adminExists = users.some(user => user.username === 'admin');
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);
        users.push({ id: Date.now(), username: 'admin', password: hashedPassword, isAdmin: true });
        writeDB(usersDB, users);
        console.log('Admin user created');
    }
};

createAdmin();

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const users = readDB(usersDB);
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: '用户已存在' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { id: Date.now(), username, password: hashedPassword, isAdmin: false };
    users.push(newUser);
    writeDB(usersDB, users);

    res.status(201).json({ message: '用户创建成功' });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const users = readDB(usersDB);
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ error: '用户名或密码错误' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: '未提供令牌，授权失败' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: '令牌无效' });
    }
};

const admin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: '访问被拒绝' });
    }
    next();
};

app.post('/api/feedback', auth, (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: '反馈信息不能为空' });
    }

    const feedback = readDB(feedbackDB);
    const newFeedback = { 
        id: Date.now(), 
        userId: req.user.id, 
        username: req.user.username, 
        message, 
        createdAt: new Date().toISOString() 
    };
    feedback.push(newFeedback);
    writeDB(feedbackDB, feedback);

    res.status(201).json({ message: '反馈提交成功' });
});

app.get('/api/feedback', auth, admin, (req, res) => {
    const feedback = readDB(feedbackDB);
    res.json(feedback);
});

app.delete('/api/feedback/:id', auth, admin, (req, res) => {
    const { id } = req.params;
    let feedback = readDB(feedbackDB);
    const initialLength = feedback.length;
    feedback = feedback.filter(item => item.id !== parseInt(id));

    if (feedback.length === initialLength) {
        return res.status(404).json({ error: '未找到反馈' });
    }

    writeDB(feedbackDB, feedback);
    res.json({ message: '反馈删除成功' });
});

// 用 multer 处理 multipart/form-data（不要用 express.json 解析图片上传）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

app.post('/api/identify', upload.single('images'), async (req, res) => {
  try {
    const apiKey =
      process.env.PLANTNET_API_KEY ||
      process.env.VITE_PLANTNET_API_KEY ||
      (typeof req.query['api-key'] === 'string' ? req.query['api-key'] : '')

    console.log('PlantNet 识别请求:', {
      hasApiKey: !!apiKey,
      apiKeyPreview: apiKey ? apiKey.substring(0, 6) + '...' : 'N/A',
      fileName: req.file?.originalname,
      fileSize: req.file?.size,
    })

    if (!apiKey) {
      return res.status(400).json({ error: '缺少 api-key (请设置 PLANTNET_API_KEY 或 VITE_PLANTNET_API_KEY)' })
    }

    const file = req.file
    if (!file) {
      return res.status(400).json({ error: '缺少图像文件字段' })
    }

    const organ = typeof req.body.organs === 'string' && req.body.organs ? req.body.organs : 'flower'
    const lang = typeof req.query.lang === 'string' && req.query.lang ? req.query.lang : 'zh'
    const includeRelated =
      typeof req.query['include-related-images'] === 'string'
        ? req.query['include-related-images']
        : 'false'

    const url = new URL('https://my-api.plantnet.org/v2/identify/all')
    url.searchParams.set('api-key', apiKey)
    url.searchParams.set('lang', lang)
    url.searchParams.set('include-related-images', includeRelated)

    const form = new FormData()
    form.append('images', new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' }), file.originalname)
    form.append('organs', organ)

    console.log('向 PlantNet 发送请求:', url.toString())

    // 注意：不要手动设置 Content-Type，让 fetch 自动带 boundary
    const resp = await fetch(url.toString(), {
      method: 'POST',
      body: form,
    })

    console.log('PlantNet 响应状态:', resp.status)

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      console.error('PlantNet API 错误:', resp.status, text)
      return res.status(resp.status).json({ error: `PlantNet 错误: ${resp.status}`, detail: text })
    }

    const data = await resp.json()
    console.log('PlantNet 返回数据:', data)
    return res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : '未知错误'
    console.error('识花请求错误:', msg)
    return res.status(500).json({ error: msg })
  }
})

// Qwen API 代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.VITE_QWEN_API_KEY
    if (!apiKey) {
      return res.status(400).json({ error: '缺少 VITE_QWEN_API_KEY' })
    }

    const messages = req.body.messages
    const knowledge = req.body.knowledge
    const plantContext = req.body.plantContext

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: '消息格式无效' })
    }

    let prompt = ''
    for (const msg of messages) {
      if (msg.role === 'system') {
        let systemContent = msg.content
        if (knowledge) {
          systemContent += `\n\n你还可以参考以下的专家知识来更好地回答用户的问题：\n---\n${knowledge}\n---`
        }
        if (plantContext) {
          systemContent += `\n\n当前用户正在询问关于「${plantContext}」的问题，请优先围绕它来回答。`
        }
        prompt += systemContent + '\n\n'
      } else if (msg.role === 'user') {
        prompt += `用户: ${msg.content}\n`
      } else if (msg.role === 'assistant') {
        prompt += `助手: ${msg.content}\n`
      }
    }
    prompt += '助手: '

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
          max_tokens: 1500,
        },
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Qwen API error:', data)
      return res.status(response.status).json(data)
    }

    // 调试：记录AI原始响应
    console.log('AI原始响应:', JSON.stringify(data, null, 2))
    
    return res.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : '未知错误'
    console.error('Qwen proxy error:', msg)
    return res.status(500).json({ error: msg })
  }
})

// 新增：AI 生成养护要点端点
app.post('/api/care-tips', async (req, res) => {
  try {
    const apiKey = process.env.VITE_QWEN_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: '缺少 VITE_QWEN_API_KEY' });
    }

    const { name, genus, family } = req.body;
    if (!name) {
      return res.status(400).json({ error: '缺少植物名称' });
    }

    const prompt = `请为「${name}」（${genus ? `属: ${genus}, ` : ''}${family ? `科: ${family}` : ''}）提供专业的养护要点。要点需要覆盖：光照、浇水、土壤、施肥、修剪。请严格按照JSON格式返回一个字符串数组，例如：["要点1", "要点2", "要点3"]。不要添加任何额外说明或代码块标记。`;

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: { prompt },
        parameters: { result_format: 'text' },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Qwen API error for care tips:', data);
      return res.status(response.status).json(data);
    }

    const textResponse = data.output.text;
    let tips = [];
    try {
      tips = JSON.parse(textResponse);
      if (!Array.isArray(tips)) {
        tips = textResponse.split('\n').map(s => s.trim()).filter(Boolean);
      }
    } catch (e) {
      console.error('Failed to parse care tips JSON, falling back to text split:', textResponse);
      tips = textResponse.split('\n').map(s => s.trim()).filter(Boolean);
    }
      
    return res.json({ tips });

  } catch (error) {
    const msg = error instanceof Error ? error.message : '未知错误';
    console.error('Care tips generation error:', msg);
    return res.status(500).json({ error: msg });
  }
});

// 新增：AI 翻译端点
app.post('/api/translate', async (req, res) => {
  try {
    const apiKey = process.env.VITE_QWEN_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: '缺少 VITE_QWEN_API_KEY' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: '缺少需要翻译的名称' });
    }

    const prompt = `请将植物分类学名 "${name}" 翻译成中文。请只返回中文名，不要任何多余的文字或符号。`;

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: { prompt },
        parameters: { result_format: 'text' },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Qwen API error for translation:', data);
      return res.status(response.status).json(data);
    }

    const translatedName = data.output.text.trim().replace(/["“”]/g, '');
    return res.json({ translatedName });

  } catch (error) {
    const msg = error instanceof Error ? error.message : '未知错误';
    console.error('Translation error:', msg);
    return res.status(500).json({ error: msg });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3001, '0.0.0.0', () => console.log('代理服务器运行在 http://127.0.0.1:3001'))
