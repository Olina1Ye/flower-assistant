# 用户反馈功能文档

## 功能概述

极简轻量化的用户反馈功能，无需登录即可提交反馈，管理员可查看和管理所有反馈。

## 技术栈

- **后端**: Node.js + Express + better-sqlite3
- **前端**: React + TypeScript + framer-motion
- **数据库**: SQLite (文件存储)

## API 端点

### 1. 提交反馈
```
POST http://localhost:3001/api/feedback
Content-Type: application/json

请求体:
{
  "content": "反馈内容",
  "page": "/页面路径",
  "rating": 5  // 可选，1-5 星
}

响应:
{
  "success": true,
  "id": 1,
  "message": "感谢你的反馈！"
}
```

### 2. 查询所有反馈
```
GET http://localhost:3001/api/feedback

响应:
[
  {
    "id": 1,
    "content": "反馈内容",
    "page": "/页面路径",
    "rating": 5,
    "createdAt": "2026-03-14T08:48:49.409Z"
  }
]
```

### 3. 删除反馈
```
DELETE http://localhost:3001/api/feedback/:id

响应:
{
  "success": true,
  "message": "反馈已删除"
}
```

## 使用方式

### 用户提交反馈

1. 访问网站任意页面
2. 点击右上角"意见反馈"按钮
3. 在弹出的模态框中输入反馈内容
4. 点击提交

### 管理员查看反馈

1. 访问 http://localhost:5173/admin/feedback
2. 查看所有用户提交的反馈
3. 可删除不当或已处理的反馈

## 数据库结构

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  page TEXT,
  rating INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

数据库文件位置：`feedback.db`（自动创建）

## 启动服务

### 后端服务器
```bash
node server.js
# 或
npm run dev:backend
```

服务器运行在：http://localhost:3001

### 前端开发服务器
```bash
npm run dev:frontend
# 或
npm run dev  # 同时启动前后端
```

前端运行在：http://localhost:5173

## 测试

### 运行集成测试
```bash
node test-feedback-integration.mjs
```

测试内容：
- ✓ 提交反馈
- ✓ 查询反馈
- ✓ 删除反馈

## 文件结构

```
src/
  components/
    Feedback.tsx          # 反馈按钮和模态框
    Feedback.module.css   # 反馈组件样式
  pages/
    FeedbackAdminPage.tsx # 反馈管理页面
  services/
    chat.ts               # (其他服务)
server.js                 # 后端服务器
feedback.db               # SQLite 数据库（自动生成）
```

## 特性

- ✅ 无需登录/注册
- ✅ 简洁的 UI 设计
- ✅ 实时提交反馈
- ✅ 输入验证（不能为空）
- ✅ 提交状态提示
- ✅ 管理员后台管理
- ✅ 数据持久化存储
- ✅ 响应式设计

## 注意事项

1. 数据库文件 `feedback.db` 会在首次运行时自动创建
2. 反馈管理页面对所有用户可见（无权限控制）
3. 所有 API 调用使用明文 HTTP（本地开发环境）
4. 生产环境建议添加 HTTPS 和权限验证

## 故障排除

### 后端启动失败
```bash
# 检查端口是否被占用
netstat -ano | findstr :3001

# 杀死占用端口的进程
taskkill /PID <PID> /F
```

### 前端无法连接后端
- 确认后端服务器已启动
- 检查 API 地址是否正确（http://localhost:3001）
- 查看浏览器控制台错误信息

### 数据库错误
```bash
# 删除数据库文件重新创建
Remove-Item feedback.db -Force
```

## 更新日志

### v1.0.0 (2026-03-14)
- ✨ 初始版本发布
- ✨ 实现基础提交、查询、删除功能
- ✨ 集成到前端应用
- ✨ 添加管理后台页面
