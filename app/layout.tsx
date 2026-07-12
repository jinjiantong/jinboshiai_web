import './globals.css'
import Chatbot from '@/components/Chatbot'

export const metadata = {
  metadataBase: new URL('https://jinboshiai.com'),
  title: {
    default: '金博士AI - 零基础AI实战教育培训',
    template: '%s | 金博士AI',
  },
  description: '金博士AI，专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。',
  keywords: ['AI培训', 'AI教育', '人工智能培训', 'AI办公', 'AI视觉设计', 'AI音视频创作', 'AI编程', 'AI工作流', '零基础学AI', '金博士AI'],
  authors: [{ name: '金博士AI' }],
  creator: '金博士AI',
  publisher: '金博士AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://jinboshiai.com',
    siteName: '金博士AI',
    title: '金博士AI - 零基础AI实战教育培训',
    description: '金博士AI，专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '金博士AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '金博士AI - 零基础AI实战教育培训',
    description: '金博士AI，专注零基础AI技能实战教学',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://jinboshiai.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: '金博士AI',
    url: 'https://jinboshiai.com',
    logo: 'https://jinboshiai.com/logo.png',
    description: '专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。提供北京顺义AI培训、AI编程培训、企业AI培训、企业AI咨询、AI应用培训等全流程服务。',
    foundingDate: '2024',
    areaServed: {
      '@type': 'City',
      name: '北京顺义'
    },
    serviceType: [
      'AI编程培训',
      '企业AI内训',
      '企业AI咨询',
      'AI落地指导',
      'AI应用培训',
      'AI培训'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI培训课程',
      itemListElement: [
        { '@type': 'Offer', name: 'AI编程培训' },
        { '@type': 'Offer', name: '企业AI培训' },
        { '@type': 'Offer', name: 'AI应用培训' },
      ]
    },
    sameAs: [
      'https://space.feishu.cn/jinboshi',
    ],
  }

  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
