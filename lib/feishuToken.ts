import fs from 'fs'
import path from 'path'

const TOKEN_CACHE_FILE = path.join(process.cwd(), '.feishu_token_cache.json')

interface TokenCache {
  token: string
  expiry: number
  timestamp: number
}

let cachedToken = ''
let tokenExpiryTime = 0
let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function getAppCredentials(): { app_id: string; app_secret: string } {
  if (process.env.FEISHU_APP_ID && process.env.FEISHU_APP_SECRET) {
    return {
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }
  }
  throw new Error('Feishu app credentials not found. Set FEISHU_APP_ID and FEISHU_APP_SECRET in the deployment environment')
}

function loadTokenFromCache(): TokenCache | null {
  try {
    if (fs.existsSync(TOKEN_CACHE_FILE)) {
      const content = fs.readFileSync(TOKEN_CACHE_FILE, 'utf-8')
      const cache: TokenCache = JSON.parse(content)
      return cache
    }
  } catch (e) {
    console.warn('Failed to load token cache:', e)
  }
  return null
}

function saveTokenToCache(token: string, expiry: number): void {
  try {
    const cache: TokenCache = {
      token,
      expiry,
      timestamp: Date.now(),
    }
    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (e) {
    console.warn('Failed to save token cache:', e)
  }
}

async function fetchAccessToken(retries: number = 3): Promise<string> {
  const credentials = getAppCredentials()
  const now = Date.now()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[FeishuToken] Attempt ${attempt}/${retries} to fetch access token`)
      
      const response = await fetch(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.code === 0 && data.tenant_access_token) {
        const expiry = now + (data.expire - 60) * 1000
        saveTokenToCache(data.tenant_access_token, expiry)
        console.log(`[FeishuToken] Successfully fetched token, expires in ${Math.floor((expiry - now) / 1000)} seconds`)
        return data.tenant_access_token
      }

      throw new Error(data.msg || `Failed to get access token. code: ${data.code}`)
    } catch (error) {
      console.error(`[FeishuToken] Attempt ${attempt}/${retries} failed:`, error)
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`[FeishuToken] Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }

  throw new Error('Max retries exceeded')
}

export async function getFeishuToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken
  }

  if (!cachedToken) {
    const cached = loadTokenFromCache()
    if (cached && cached.token && now < cached.expiry) {
      cachedToken = cached.token
      tokenExpiryTime = cached.expiry
      console.log(`[FeishuToken] Loaded token from cache, expires in ${Math.floor((tokenExpiryTime - now) / 1000)} seconds`)
      return cachedToken
    }
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const token = await fetchAccessToken()
    cachedToken = token
    tokenExpiryTime = now + 6774000
    const waiters = refreshQueue
    refreshQueue = []
    waiters.forEach(({ resolve }) => resolve(token))
    return token
  } catch (error) {
    cachedToken = ''
    tokenExpiryTime = 0
    // 关键：刷新失败时必须让排队的调用一并失败，否则它们会永久挂起（构建期会导致静态生成超时）
    const waiters = refreshQueue
    refreshQueue = []
    waiters.forEach(({ reject }) => reject(error))
    console.error('[FeishuToken] Error getting tenant_access_token:', error)
    throw error
  } finally {
    isRefreshing = false
  }
}

export async function refreshFeishuToken(): Promise<string> {
  cachedToken = ''
  tokenExpiryTime = 0
  return getFeishuToken()
}

export function invalidateFeishuToken(): void {
  cachedToken = ''
  tokenExpiryTime = 0
  try {
    fs.unlinkSync(TOKEN_CACHE_FILE)
  } catch (e) {
    console.warn('Failed to delete token cache:', e)
  }
}

export function getTokenExpiry(): number {
  return tokenExpiryTime
}
