// 初始化 app_config 集合 + 默认配置
require('dotenv').config()
const { getConfig, DEFAULT_CONFIG, ENV_ID, COLL } = require('../server/cloudbase-config')

async function main() {
  // getConfig 会 ensure 集合并在不存在时 seed 默认值；这里再显式打印当前已存对象
  const cfg = await getConfig()
  console.log('环境:', ENV_ID)
  console.log('集合:', COLL)
  console.log('当前配置:', JSON.stringify(cfg, null, 2))
  console.log('若显示的是默认值，说明已初始化成功；你可在后台/接口里改。')
}
main().catch((e) => console.error('FAIL', (e && e.message) || e))