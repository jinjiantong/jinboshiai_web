import './globals.css'
import { ZCOOL_XiaoWei } from 'next/font/google'

const zcoolFont = ZCOOL_XiaoWei({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zcool',
})

export const metadata = {
  metadataBase: new URL('https://jinboshiai.com'),
  title: {
    default: '阿木木知晓AI CRM —— 会管客户、会教销售、还会自己进化的 AI 销售老师',
    template: '%s | 阿木木知晓AI CRM',
  },
  description:
    '阿木木知晓AI CRM，七大模块覆盖销售全流程：线索获取、商机管理、跟进作战、话术SOP复盘、定时任务、自动汇报、老板驾驶舱。支持飞书、龙虾、WorkBuddy 等主流智能体，按人订阅，15 天试用 ¥0。',
  keywords: [
    '阿木木知晓AI CRM',
    'AI CRM',
    'AI销售',
    '智能CRM',
    '销售管理',
    'CRM系统',
    '飞书CRM',
    'WorkBuddy',
    'AI智能体',
    'AI销售老师',
    '智能话术',
    '销售复盘',
  ],
  authors: [{ name: '阿木木知晓AI CRM' }],
  creator: '阿木木知晓AI CRM',
  publisher: '阿木木知晓AI CRM',
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
    siteName: '阿木木知晓AI CRM',
    title: '阿木木知晓AI CRM —— 会管客户、会教销售、还会自己进化的 AI 销售老师',
    description:
      '阿木木知晓AI CRM，七大模块覆盖销售全流程：线索获取、商机管理、跟进作战、话术SOP复盘、定时任务、自动汇报、老板驾驶舱。支持飞书、龙虾、WorkBuddy 等主流智能体，按人订阅，15 天试用 ¥0。',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '阿木木知晓AI CRM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '阿木木知晓AI CRM —— 会管客户、会教销售、还会自己进化的 AI 销售老师',
    description: '阿木木知晓AI CRM，七大模块覆盖销售全流程，支持飞书、龙虾、WorkBuddy 等主流智能体，按人订阅，15 天试用 ¥0。',
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
    '@type': 'Product',
    name: '阿木木知晓AI CRM',
    description:
      '支持飞书、龙虾、WorkBuddy 等主流智能体的 AI 销售老师。七大模块覆盖销售全流程：线索获取、商机管理、跟进作战、话术SOP复盘、定时任务、自动汇报、老板驾驶舱。会管客户、会教销售、还会自己进化，按人订阅，15 天试用 ¥0。',
    brand: {
      '@type': 'Brand',
      name: '阿木木知晓AI CRM',
    },
    slogan: 'AI 销售老师，越用越会卖',
    url: 'https://jinboshiai.com',
    logo: 'https://jinboshiai.com/logo.png',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'CNY',
      lowPrice: '98',
      highPrice: '828',
      offerCount: '3',
    },
  }

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={zcoolFont.variable}>
        {children}
      </body>
    </html>
  )
}
