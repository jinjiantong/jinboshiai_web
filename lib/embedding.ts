import crypto from 'crypto'

const config = {
  apiKey: process.env.MINIMAX_API_KEY || '',
  baseUrl: 'https://api.minimax.chat/v1'
}

function generateSignature(): { signature: string; timestamp: number } {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = crypto.createHmac('sha256', config.apiKey)
    .update(`${config.apiKey}${timestamp}`)
    .digest('hex')
  return { signature, timestamp }
}

export async function getEmbedding(text: string): Promise<number[]> {
  const { signature, timestamp } = generateSignature()

  try {
    const response = await fetch(`${config.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'embo-01',
        texts: [text]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Embedding API error:', error)
      return []
    }

    const data = await response.json()
    return data.data?.[0]?.embedding || []
  } catch (error) {
    console.error('Embedding error:', error)
    return []
  }
}

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<{ content: string; tokens: number }> {
  const { signature, timestamp } = generateSignature()

  try {
    const response = await fetch(`${config.baseUrl}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        tokens_to_generate: options?.maxTokens || 1024,
        temperature: options?.temperature || 0.7,
        messages: messages.map(m => ({
          sender_type: m.role === 'assistant' ? 'bot' : m.role,
          text: m.content
        })),
        signature,
        timestamp
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Chat API error:', error)
      throw new Error(`Chat API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantMsg = data.choices?.[0]?.messages?.find((m: any) => m.sender_type === 'bot')

    return {
      content: assistantMsg?.text || '抱歉，服务暂时不可用。',
      tokens: data.usage?.tokens || 0
    }
  } catch (error) {
    console.error('Chat completion error:', error)
    throw error
  }
}

export async function testMiniMaxConnection(): Promise<boolean> {
  try {
    const embedding = await getEmbedding('测试')
    return embedding.length > 0
  } catch {
    return false
  }
}