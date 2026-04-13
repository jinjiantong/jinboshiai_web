# 金博士AI - 零基础AI实战教育培训平台

专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。

## 项目简介

金博士AI是一个现代化的AI教育培训平台，旨在帮助零基础用户快速掌握AI技能，提升工作效率和创造力。

## 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **工具**: [Tailwind Merge](https://github.com/dcastil/tailwind-merge)

## 项目结构

```
jinboshiAI/web/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── portfolios/    # 作品集 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件目录
│   ├── layout/            # 布局组件
│   │   ├── Navbar.tsx     # 导航栏
│   │   └── Footer.tsx     # 页脚
│   └── sections/          # 页面区块
│       ├── Hero.tsx       # 英雄区
│       ├── About.tsx      # 关于我们
│       ├── Courses.tsx    # 课程介绍
│       ├── LearningPath.tsx # 学习路径
│       ├── Portfolio.tsx  # 作品集
│       └── Contact.tsx    # 联系方式
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
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

### 启动生产服务器

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 页面功能

- **英雄区**: 展示平台核心价值和主要特性
- **关于我们**: 介绍平台背景和使命
- **课程介绍**: 展示各类AI培训课程
- **学习路径**: 提供系统化的学习指南
- **作品集**: 展示学员作品和成功案例
- **联系方式**: 提供咨询和报名入口

## 开发说明

### 添加新页面

在 `app/` 目录下创建新的路由文件夹或文件。

### 添加新组件

- 布局组件放在 `components/layout/`
- 页面区块组件放在 `components/sections/`
- 通用组件可以放在 `components/` 根目录

### 样式规范

使用 Tailwind CSS 进行样式开发，遵循原子化 CSS 设计理念。

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/jinjiantong/jinboshiai_web
- 官方网站: (待部署)
