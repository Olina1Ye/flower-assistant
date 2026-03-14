import fs from 'fs'

const filePath = 'c:\\Users\\20958\\CodeBuddy\\20260210154055\\server.js'
let content = fs.readFileSync(filePath, 'utf-8')

// 替换 CORS 配置
const oldCors = 'app.use(cors())'
const newCors = `app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))`

if (content.includes(oldCors)) {
  content = content.replace(oldCors, newCors)
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log('✅ CORS 配置已更新')
} else {
  console.log('❌ 未找到原始 CORS 配置')
}
