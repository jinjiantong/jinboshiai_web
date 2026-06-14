import './globals.css'
import Chatbot from '@/components/Chatbot'
import { headers } from 'next/headers'

export const metadata = {
  title: '金博士AI - 零基础AI实战教育培训',
  description: '金博士AI，专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
