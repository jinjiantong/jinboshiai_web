// 验证 CloudBase 云数据库连通性 v2：凭据来自环境变量
const tcb = require('@cloudbase/node-sdk')

const ENV_ID = process.env.TENCENTCLOUD_ENV || 'amumu-d8gqz038oab87f530'
const REGION = process.env.TENCENTCLOUD_REGION || 'ap-shanghai'

async function main() {
  const app = tcb.init({
    env: ENV_ID,
    region: REGION,
    credentials: {
      secretId: process.env.TENCENTCLOUD_SECRETID,
      secretKey: process.env.TENCENTCLOUD_SECRETKEY,
      token: process.env.TENCENTCLOUD_SESSIONTOKEN,
    },
  })
  const db = app.database()
  try {
    const res = await db.collection('app_config').get()
    console.log('app_config read OK, docs:', res.data ? res.data.length : 0)
  } catch (e) {
    console.log('app_config error:', String((e && e.message) || e).slice(0, 300))
  }
}

main().catch((e) => console.error('FAIL', (e && e.message) || e))