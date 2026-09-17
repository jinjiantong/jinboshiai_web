// 营销站共享：从 CloudBase 读取站点配置（定价 / 视频URL）
import tcb from '@cloudbase/node-sdk'

const ENV_ID = process.env.TENCENTCLOUD_ENV || 'amumu-d8gqz038oab87f530'
const REGION = process.env.TENCENTCLOUD_REGION || 'ap-shanghai'

const DEFAULT_CONFIG = {
  pricing: { month: 98, quarter: 258, year: 828 },
  videoUrl: '',
}

let cached: any = null
let cachedAt = 0
const TTL = 30_000 // 30s 缓存，减少对云数据库的频繁读取

export async function getSiteConfig(force = false) {
  const now = Date.now()
  if (!force && cached && now - cachedAt < TTL) return cached
  let app: any = null
  try {
    app = tcb.init({
      env: ENV_ID,
      region: REGION,
      secretId: process.env.TENCENTCLOUD_SECRETID || undefined,
      secretKey: process.env.TENCENTCLOUD_SECRETKEY || undefined,
      sessionToken: process.env.TENCENTCLOUD_SESSIONTOKEN || undefined,
    })
    const db = app.database()
    const res = await db.collection('app_config').doc('site').get()
    let cfg: any = { ...DEFAULT_CONFIG }
    if (res && res.data && res.data.length > 0) {
      const d = res.data[0]
      cfg.pricing = { ...cfg.pricing, ...(d.pricing || {}) }
      if (typeof d.videoUrl === 'string') cfg.videoUrl = d.videoUrl
      if (typeof d.videoFileId === 'string') cfg.videoFileId = d.videoFileId
    }
    // 有云存储 fileId → 换新临时链接；否则用直链
    if (cfg.videoFileId) {
      try {
        const tmp: any = await app.getTempFileURL({ fileList: [cfg.videoFileId] })
        const u = tmp && tmp.fileList && tmp.fileList[0] && tmp.fileList[0].tempFileURL
        if (u) cfg.videoUrl = u
      } catch (e) {
        /* 解析失败保持直链 */
      }
    }
    cached = cfg
    cachedAt = now
    return cfg
  } catch (e) {
    // 读失败回退默认值，保证页面可用
    if (cached) return cached
    return { ...DEFAULT_CONFIG }
  }
}