import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '作品展示台',
  description: '金博士AI作品展示台，汇集所有通过AI独立完成的实战项目，包括AI智能体、AI应用、AI游戏等多种类型作品。',
  keywords: ['AI作品', 'AI项目', 'AI作品集', 'AI智能体', 'AI应用展示', '金博士AI作品'],
  openGraph: {
    title: '作品展示台 | 金博士AI',
    description: '金博士AI作品展示台，汇集所有通过AI独立完成的实战项目。',
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
