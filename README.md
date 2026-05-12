# 🌸 AI 养花助手 - 花伴

一个基于 AI 的植物养护助手，帮助你轻松养好每一盆花。

## ✨ 核心功能

- **📷 拍照识花** - 上传植物照片，自动识别花卉品种
- **💬 AI 问答** - 智能解答养花问题，提供个性化养护建议
- **🌿 规则引擎** - 针对常见问题（黄叶/烂根/虫害等）提供专业解答
- **💬 意见反馈** - 用户反馈收集系统

## 🛠️ 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **路由**: React Router DOM 7
- **动画**: Framer Motion
- **样式**: CSS Modules

### 后端
- **运行时**: Node.js (ESM)
- **框架**: Express 5
- **文件上传**: Multer
- **数据存储**: JSON 文件 + LocalStorage

### AI 服务
- **对话模型**: 通义千问 (qwen-plus)
- **图像识别**: PlantNet API

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 配置环境变量
复制 `.env.example` 为 `.env` 并填写 API Key：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 通义千问 API Key（必需）
VITE_QWEN_API_KEY=your_qwen_api_key

# PlantNet API Key（可选，用于拍照识花）
PLANTNET_API_KEY=your_plantnet_api_key
```

**获取 API Key：**
- 通义千问：https://dashscope.console.aliyun.com/overview
- PlantNet：https://my.plantnet.org/

### 启动开发服务器
```bash
npm run dev
```

启动后访问：
- 前端：http://localhost:5000
- 后端：http://localhost:3001

如果 `5000` 端口已被占用，Vite 会自动切换到下一个可用端口，请以终端输出的 `Local` 地址为准，例如 `http://localhost:5001/`。

## 📦 构建与部署

### 生产构建
```bash
npm run build
```
构建产物输出到 `dist/` 目录。

### 生产预览
```bash
npm run preview
```

### 仅启动后端
```bash
npm start
# 或
node server.js
```

### 部署建议

#### 方案 A：前后端一起部署
适合部署到支持 Node.js 的平台（Railway、Render、Heroku）：

1. 构建前端：`npm run build`
2. 配置环境变量（平台管理面板）
3. 启动命令：`node server.js`

#### 方案 B：前后端分离部署
- **前端**：将 `dist/` 部署到 Vercel/Netlify
- **后端**：将 `server.js` 部署到 Railway/Render
- 修改 `vite.config.ts` 中的 `proxy` 目标为后端生产地址

## 📁 项目结构

```
├── src/
│   ├── components/      # UI 组件
│   │   ├── Layout.tsx
│   │   ├── Feedback.tsx
│   │   └── Page.tsx
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── AssistantPage.tsx
│   │   └── IdentifyPage.tsx
│   ├── services/        # API 服务
│   │   ├── chat.ts
│   │   ├── identify.ts
│   │   └── plantnet.ts
│   ├── types.ts         # TypeScript 类型
│   └── main.tsx         # 应用入口
├── server.js            # Express 后端
├── feedback.json        # 反馈数据
├── .env.example         # 环境变量模板
├── vite.config.ts       # Vite 配置
└── package.json
```

## 🔌 API 接口

### 反馈系统
```http
POST /api/feedback
Content-Type: application/json

{
  "content": "反馈内容"
}

GET /api/feedback
```

### 拍照识花
```http
POST /api/identify
Content-Type: multipart/form-data

FormData:
- images: File (图片文件)
- organs: String (flower|leaf|fruit|bark)
```

### AI 问答
```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "问题内容" }
  ],
  "knowledge": "可选的专家知识",
  "plantContext": "可选的植物上下文"
}
```

## 🎯 功能说明

### 1. 拍照识花
- 支持识别器官：花、叶、果、树皮
- 调用 PlantNet API 进行图像识别
- 识别结果包含：品种名称、置信度、养护建议
- 支持一键跳转到 AI 问答，继续咨询该植物

### 2. AI 养花问答
- 基于通义千问大模型
- 支持多轮对话，上下文记忆
- 内置规则引擎，针对常见问题快速回复：
  - 黄叶问题
  - 烂根/闷根处理
  - 虫害防治
  - 不开花/落蕾
  - 缓苗指南
  - 施肥建议
- 聊天记录本地持久化（LocalStorage）

### 3. 意见反馈
- 用户可提交使用反馈
- 数据存储于 `feedback.json`
- 支持实时提交与验证

## ⚠️ 注意事项

1. **API Key 安全**：不要将 `.env` 文件提交到版本控制
2. **CORS 配置**：后端默认允许本地开发来源（`localhost` / `127.0.0.1` 的任意端口）跨域
3. **文件大小限制**：图片上传限制为 10MB
4. **生产环境**：需配置反向代理或修改 API 请求地址

## 📝 开发脚本

```bash
# 开发模式（前后端并行）
npm run dev

# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run dev:backend

# 生产构建
npm run build

# 代码检查
npm run lint

# 生产预览
npm run preview
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**开发时间**: 2026 年 3 月  
**版本**: 1.0.0
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
