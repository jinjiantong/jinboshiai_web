/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#E85A2B',
          light: '#FF8A5C',
        },
        secondary: '#10B981',
        accent: '#FBBF24',
        astro: {
          // 白色为主 · 扁平大气 · 活力橙主色 + 多彩点缀
          bg: '#FFFFFF',          // 主背景 纯白
          bgAlt: '#F6F7F9',       // 交替区块 极浅灰
          surface: '#FFFFFF',     // 卡片白
          ink: '#0F172A',         // 主文字 深蓝黑
          inkSoft: '#475569',     // 次文字
          muted: '#94A3B8',       // 辅助文字
          line: '#E6E8EC',        // 分割线 / 边框
          orange: '#FF6B35',      // 品牌主色 活力橙
          orangeDark: '#E85A2B',  // 深橙
          yellow: '#FBBF24',      // 温暖点缀 明黄
          green: '#10B981',       // 成功 / 可信
          pink: '#F472B6',        // 温暖点缀 粉
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(15, 23, 42, 0.06)',
        softLg: '0 20px 60px rgba(15, 23, 42, 0.08)',
        card: '0 1px 3px rgba(15, 23, 42, 0.05), 0 10px 30px rgba(15, 23, 42, 0.05)',
        brand: '0 10px 40px rgba(255, 107, 53, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
