import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ==================== 极简反馈接口 ====================

// POST /api/feedback - 提交反馈（无需登录）
app.post('/api/feedback', (req, res) => {
  try {
    const { message } = req.body;
    
    // 基础验证
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: '反馈内容不能为空' 
      });
    }
    
    // 插入数据库
    const stmt = db.prepare('INSERT INTO feedback (message, createdAt) VALUES (?, ?)');
    const result = stmt.run(message.trim(), new Date().toISOString());
    
    res.status(201).json({ 
      success: true, 
      message: '反馈提交成功',
      id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('提交反馈失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器错误，请稍后重试' 
    });
  }
});

// GET /api/feedback - 查询所有反馈（无需登录）
app.get('/api/feedback', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, message, createdAt FROM feedback ORDER BY createdAt DESC');
    const feedbackList = stmt.all();
    
    res.json({ 
      success: true, 
      data: feedbackList 
    });
  } catch (error) {
    console.error('查询反馈失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器错误，请稍后重试' 
    });
  }
});

// ==================== 其他现有 API 保持不变 ====================

app.listen(PORT, () => {
  console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
  console.log(`✅ SQLite 数据库已初始化`);
});
