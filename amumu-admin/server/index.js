// 独立后台管理服务：定价 + 视频上传配置
require('dotenv').config()
const path = require('path')
const express = require('express')
const multer = require('multer')
const { getConfig, saveConfig, uploadVideoFile, resolveVideoUrl, ENV_ID } = require('./cloudbase-config')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 * 1024, files: 1 }, // 300MB 上限
})

// 统一 JSON 错误处理：multer 抛错（如文件过大）等都会被转成 JSON，而非 Express 默认 HTML
function jsonErrorHandler(err, req, res, next) {
  const code = err && err.code
  let status = err && err.status ? err.status : 500
  let msg = (err && err.message) || String(err)
  if (code === 'LIMIT_FILE_SIZE') {
    status = 413
    msg = '文件过大：超过 300MB 上限，请压缩后再上传'
  } else if (code && code.startsWith('LIMIT_')) {
    status = 400
    msg = '上传参数不合法：' + msg
  }
  console.error('[api error]', req.method, req.path, status, msg)
  res.status(status).json({ ok: false, error: msg, code: code || '' })
}

// GET 配置
app.get('/api/config', async (req, res) => {
  try {
    const cfg = await getConfig()
    res.json({ ok: true, env: ENV_ID, data: cfg })
  } catch (e) {
    res.status(500).json({ ok: false, error: String((e && e.message) || e) })
  }
})

// PUT 配置（全量替换 pricing / videoUrl / videoFileId）
app.put('/api/config', async (req, res) => {
  try {
    const cfg = await saveConfig(req.body || {})
    res.json({ ok: true, env: ENV_ID, data: cfg })
  } catch (e) {
    res.status(500).json({ ok: false, error: String((e && e.message) || e) })
  }
})

// POST /api/video 上传视频（multipart 字段名 file）→ 存 CloudBase 存储 → 回写 fileId
app.post('/api/video', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: '未收到文件（字段名应为 file）' })
    }
    const { fileId, tempUrl } = await uploadVideoFile(req.file.buffer, req.file.originalname)
    await saveConfig({ videoFileId: fileId }) // 存 fileID，官网端换新临时链接
    res.json({ ok: true, env: ENV_ID, fileId, url: tempUrl })
  } catch (e) {
    res.status(500).json({ ok: false, error: String((e && e.message) || e) })
  }
})

// GET /api/video/url 取当前官网要用的视频地址（fileId 换新临时链接）
app.get('/api/video/url', async (req, res) => {
  try {
    const cfg = await getConfig()
    const url = await resolveVideoUrl(cfg)
    res.json({ ok: true, url })
  } catch (e) {
    res.status(500).json({ ok: false, error: String((e && e.message) || e) })
  }
})

// 统一错误处理（放在所有路由之后）
app.use(jsonErrorHandler)

const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
  console.log(`[amumu-admin] 后台已启动: http://localhost:${PORT}`)
  console.log(`[amumu-admin] CloudBase 环境: ${ENV_ID}`)
  console.log(`[amumu-admin] 接口: GET/PUT /api/config · POST /api/video · GET /api/video/url`)
})