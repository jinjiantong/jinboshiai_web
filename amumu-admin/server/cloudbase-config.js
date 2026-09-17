// CloudBase 配置存取模块：读写 app_config 集合（定价 + 视频URL）
const tcb = require('@cloudbase/node-sdk')

const ENV_ID = process.env.TENCENTCLOUD_ENV || 'amumu-d8gqz038oab87f530'
const REGION = process.env.TENCENTCLOUD_REGION || 'ap-shanghai'
const COLL = 'app_config'
const DOC_ID = 'site'

// 不存在的集合会在这层兜底：先 ensure 再读写
async function getApp() {
  const base = { env: ENV_ID, region: REGION }
  // 本机/local：用 .env 里的显式凭据；部署到 CloudBase 云托管/函数运行时：省略凭据走运行时内置鉴权
  const sid = process.env.TENCENTCLOUD_SECRETID
  const skey = process.env.TENCENTCLOUD_SECRETKEY
  const tok = process.env.TENCENTCLOUD_SESSIONTOKEN
  if (sid && skey) {
    base.credentials = { secretId: sid, secretKey: skey }
    if (tok) base.credentials.token = tok
  }
  return tcb.init(base)
}

async function ensureCollection(db) {
  try {
    const colls = await db.listCollections() // 或 getCollection
    const has = Array.isArray(colls) && colls.some((c) => c.name === COLL)
    if (!has) {
      await db.createCollection(COLL).catch(() => {})
    }
  } catch (e) {
    // 部分 SDK 用 createCollection；忽略 list 失败，尽量 create
    await db.createCollection(COLL).catch(() => {})
  }
}

// 默认值（与当前站点线上价一致）
const DEFAULT_CONFIG = {
  pricing: { month: 98, quarter: 258, year: 828 },
  videoUrl: '', // 直链（外部/临时）——官网《video》直接用
  videoFileId: '', // 存到 CloudBase 哪个存储文件的 fileID（云存储，长按）
}

function stripMeta(d) {
  const { _id, _openid, _createTime, _updateTime, ...rest } = d || {}
  return rest
}

async function getConfig() {
  const app = await getApp()
  const db = app.database()
  try {
    const res = await db.collection(COLL).doc(DOC_ID).get()
    if (res && res.data && res.data.length > 0) {
      return { ...DEFAULT_CONFIG, ...stripMeta(res.data[0]) }
    }
  } catch (e) {
    // doc 不存在，稍后 seed
  }
  // seed 默认
  await ensureCollection(db)
  try {
    await db.collection(COLL).add({ ...DEFAULT_CONFIG, _id: DOC_ID })
  } catch (e) {
    // 已存在则忽略
  }
  return { ...DEFAULT_CONFIG }
}

async function saveConfig(patch) {
  const app = await getApp()
  const db = app.database()
  await ensureCollection(db)
  const coll = db.collection(COLL)
  const doc = coll.doc(DOC_ID)
  // 规范化 patch：只允许 pricing / videoUrl / videoFileId
  const clean = {}
  if (patch && patch.pricing) clean.pricing = patch.pricing
  if (patch && patch.videoUrl !== undefined) clean.videoUrl = patch.videoUrl
  if (patch && patch.videoFileId !== undefined) clean.videoFileId = patch.videoFileId
  const now = Date.now()
  await doc
    .set({ ...(await getConfigForSet(db)), ...clean, updatedAt: now })
    .catch(async () => {
      await coll.add({ ...DEFAULT_CONFIG, ...clean, _id: DOC_ID, updatedAt: now })
    })
  return getConfig()
}

// 上传视频到 CloudBase 存储，返回 { fileId, tempUrl }
async function uploadVideoFile(fileContent, originalName = 'demo.mp4') {
  const app = await getApp()
  const safeName = (originalName || 'demo.mp4').replace(/[^\w.\-]/g, '_')
  const cloudPath = `amumu/videos/${Date.now()}_${safeName}`
  const up = await app.uploadFile({ cloudPath, fileContent })
  const fileId = up && up.fileID
  if (!fileId) throw new Error('上传失败：未返回 fileID')
  const tmp = await app.getTempFileURL({ fileList: [fileId] })
  const url = tmp && tmp.fileList && tmp.fileList[0] && tmp.fileList[0].tempFileURL
  return { fileId, tempUrl: url || '' }
}

// 根据配置解析官网真正要用的视频地址（有云存储 fileId 就换新临时链接，否则用直链）
async function resolveVideoUrl(cfg) {
  const app = await getApp()
  if (cfg && cfg.videoFileId) {
    try {
      const tmp = await app.getTempFileURL({ fileList: [cfg.videoFileId] })
      const url = tmp && tmp.fileList && tmp.fileList[0] && tmp.fileList[0].tempFileURL
      if (url) return url
    } catch (e) {
      /* 解析失败则回退直链 */
    }
  }
  return (cfg && cfg.videoUrl) || ''
}

async function getConfigForSet(db) {
  try {
    const res = await db.collection(COLL).doc(DOC_ID).get()
    if (res && res.data && res.data.length > 0) {
      const d = res.data[0]
      const { _id, _openid, _createTime, _updateTime, ...rest } = d || {}
      return rest
    }
  } catch (e) {
    /* not found */
  }
  return { ...DEFAULT_CONFIG }
}

module.exports = { getConfig, saveConfig, uploadVideoFile, resolveVideoUrl, DEFAULT_CONFIG, ENV_ID, COLL }