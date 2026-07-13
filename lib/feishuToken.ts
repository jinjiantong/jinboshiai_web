import settings from '../setting.json'

let cachedToken = ''
let tokenExpiryTime = 0
let isRefreshing = false
let refreshQueue: Array<() => void> = []

export async function getFeishuToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken
  }

  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      refreshQueue.push(() => resolve(cachedToken))
    })
  }

  isRefreshing = true

  try {
    const response = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: settings.data.app_id,
          app_secret: settings.data.app_secret,
        }),
      }
    )

    const data = await response.json()

    if (data.code === 0 && data.tenant_access_token) {
      cachedToken = data.tenant_access_token
      tokenExpiryTime = now + (data.expire - 60) * 1000
      refreshQueue.forEach((cb) => cb())
      refreshQueue = []
      return cachedToken
    }

    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    cachedToken = ''
    tokenExpiryTime = 0
    console.error('Error getting tenant_access_token:', error)
    throw error
  } finally {
    isRefreshing = false
  }
}

export function invalidateFeishuToken(): void {
  cachedToken = ''
  tokenExpiryTime = 0
}
