# 金博士AI - 零基础AI实战教育培训平台

专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。

## 项目简介

金博士AI是一个现代化的AI教育培训平台，旨在帮助零基础用户快速掌握AI技能，提升工作效率和创造力。

## 核心功能

### 1. 官网展示
- 课程介绍、学习路径、联系方式
- 学员作品集展示
- 在线咨询报名

### 2. 智能客服系统（AI-Powered）
基于RAG技术打造的智能客服系统，为用户提供7x24小时的课程咨询和技术答疑服务。

**技术架构**：
```
用户提问 → Redis缓存 → MiniMax Embedding → Qdrant向量库 → MiniMax Chat → MySQL存储 → 返回
```

**核心特性**：
- RAG检索增强生成，精准回答
- Redis缓存加速，响应时间4s→11ms
- MySQL持久化存储，统计分析
- 后台管理，知识库同步

### 3. 实验室企业案例
展示基于金博士AI技术打造的智能应用案例。

## 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **工具**: [Tailwind Merge](https://github.com/dcastil/tailwind-merge)

### AI服务
- **大模型**: MiniMax API (对话生成、向量嵌入)
- **向量数据库**: Qdrant (语义检索)
- **业务数据库**: MySQL (对话记录)
- **缓存服务**: Redis (响应加速)

## 项目结构

```
jinboshiAI/web/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── chat/         # 智能对话 API
│   │   ├── sync/         # 知识库同步 API
│   │   ├── chat-stats/   # 问题统计 API
│   │   └── chatbot-stats/ # 系统统计 API
│   ├── dashboard/        # 后台管理首页
│   ├── admin/           # 后台管理
│   │   ├── chatbot/     # 智能客服管理
│   │   └── cases/      # 企业案例展示
│   └── page.tsx         # 官网首页
├── components/            # 组件目录
│   ├── Chatbot.tsx      # 智能客服组件
│   ├── layout/          # 布局组件
│   └── sections/        # 页面区块
├── lib/                  # 核心库
│   ├── rag.ts           # RAG检索逻辑
│   ├── embedding.ts     # MiniMax API封装
│   └── vector-db.ts     # Qdrant客户端
├── docs/                  # 技术文档
└── next.config.js        # Next.js 配置
```

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm 或 yarn 或 pnpm

### 环境变量

创建 `.env.local` 文件：

```bash
# MiniMax API
MINIMAX_API_KEY=your_api_key

# Qdrant 向量数据库
QDRANT_HOST=localhost
QDRANT_PORT=6333

# MySQL 数据库
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=chatbot_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=chatbot

# Redis 缓存
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

## 页面功能

### 官网首页
- 英雄区：展示平台核心价值和主要特性
- 课程介绍：展示各类AI培训课程
- 学习路径：提供系统化的学习指南
- 联系方式：提供咨询和报名入口

### 后台管理 (/dashboard)
- 用户管理
- 智能客服管理
- 实验室企业案例

### 智能客服管理 (/admin/chatbot)
- 知识库管理：同步课程知识到向量库
- 服务状态：监控Qdrant/MySQL/Redis状态
- 数据统计：高频问题TOP10分析
- 配置信息：服务器IP、端口等

### 企业案例 (/admin/cases)
- 金博士AI实验室企业案例展示
- 技术架构说明
- 性能指标展示

## API接口

| 接口 | 方法 | 功能 |
|------|------|------|
| /api/chat | POST | 智能对话（带缓存） |
| /api/sync | POST | 知识库同步 |
| /api/chatbot-stats | GET | 数据库统计 |
| /api/chat-stats | GET | 问题统计 |

## 智能客服链路

```
用户提问
    ↓
Redis缓存检查（命中直接返回）
    ↓
MiniMax Embedding API（生成1536维向量）
    ↓
Qdrant向量库（语义检索TOP3）
    ↓
MiniMax Chat API（生成回答）
    ↓
Redis缓存设置（1小时过期）
    ↓
MySQL存储（会话+消息）
    ↓
返回给用户
```

## 开发说明

### 添加新页面

在 `app/` 目录下创建新的路由文件夹或文件。

### 添加新组件

- 布局组件放在 `components/layout/`
- 页面区块组件放在 `components/sections/`
- 通用组件可以放在 `components/` 根目录

### 样式规范

使用 Tailwind CSS 进行样式开发，遵循原子化 CSS 设计理念。

## 技术文档

详细技术文档位于 `docs/` 目录：

- 智能客服系统技术方案.md
- 智能客服测试用例.md
- 智能客服链路测试用例.md
- 智能客服链路测试报告.md
- RAG方案审查报告.md

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/jinjiantong/jinboshiai_web
- 官方网站: https://jinboshiai.com
- 咨询电话: 15811055744
- 咨询邮箱: 26256649@qq.com
