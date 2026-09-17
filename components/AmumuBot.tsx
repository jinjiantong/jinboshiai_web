'use client'

/**
 * 阿木木 AI 销售老师吉祥物 (AmumuBot)
 * 活力橙主色（温暖亲切）+ 明黄能量核心（老师温度）
 * 扁平化现代设计，纯色块 + 细腻层次
 */
export default function AmumuBot({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="阿木木"
    >
      {/* 天线 */}
      <line x1="100" y1="34" x2="100" y2="56" stroke="#FF6B35" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="28" r="10" fill="#FF6B35" />
      <circle cx="97" cy="25" r="3.5" fill="#FFFFFF" opacity="0.9" />

      {/* 头部 - 球形 */}
      <circle cx="100" cy="92" r="66" fill="#FF6B35" />
      {/* 头顶高光 */}
      <ellipse cx="76" cy="66" rx="22" ry="13" fill="#FFFFFF" opacity="0.18" />

      {/* 脸部白色区域 */}
      <ellipse cx="100" cy="102" rx="44" ry="34" fill="#FFFFFF" />

      {/* 腮红 */}
      <ellipse cx="62" cy="110" rx="11" ry="7" fill="#FFD9C8" />
      <ellipse cx="138" cy="110" rx="11" ry="7" fill="#FFD9C8" />

      {/* 左眼 */}
      <circle cx="80" cy="96" r="9.5" fill="#0F172A" />
      <circle cx="84" cy="92" r="3.2" fill="#FFFFFF" />
      {/* 右眼 */}
      <circle cx="120" cy="96" r="9.5" fill="#0F172A" />
      <circle cx="124" cy="92" r="3.2" fill="#FFFFFF" />

      {/* 微笑 - 老师式的自信微笑 */}
      <path d="M 86 125 Q 100 138 114 125" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* 舌头（温暖点缀） */}
      <path d="M 92 128 Q 100 134 108 128" fill="#E85A2B" opacity="0.9" />

      {/* 身体 */}
      <ellipse cx="100" cy="164" rx="40" ry="26" fill="#FF6B35" />
      {/* 身体暗部 */}
      <ellipse cx="100" cy="172" rx="30" ry="12" fill="#E85A2B" opacity="0.4" />

      {/* 胸口能量核心 - 温暖的"老师之心" */}
      <circle cx="100" cy="161" r="13" fill="#FFFFFF" opacity="0.95" />
      <circle cx="100" cy="161" r="7" fill="#FBBF24" />
      <circle cx="98" cy="159" r="2.5" fill="#FFFFFF" />

      {/* 两侧小光点 */}
      <circle cx="58" cy="156" r="4" fill="#FFB899" opacity="0.8" />
      <circle cx="142" cy="156" r="4" fill="#FFB899" opacity="0.8" />
    </svg>
  )
}
