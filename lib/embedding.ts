const config = {
  apiKey: process.env.MINIMAX_API_KEY || '',
  baseUrl: 'https://api.minimax.chat/v1'
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${config.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'embo-01',
        texts: [text],
        type: 'query'
      })
    })

    const data = await response.json()
    
    if (data.base_resp?.status_code === 0 && data.vectors && data.vectors.length > 0) {
      return data.vectors[0] || []
    }
    
    return []
  } catch (error) {
    console.error('Embedding error:', error)
    return []
  }
}

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>
): Promise<{ content: string; tokens: number }> {
  try {
    const response = await fetch(`${config.baseUrl}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat',
        tokens_to_generate: 500,
        temperature: 0.7,
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      })
    })

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      const assistantMsg = data.choices[0].message
      return {
        content: assistantMsg?.content || '',
        tokens: data.usage?.total_tokens || 0
      }
    }
    
    throw new Error(data.base_resp?.status_msg || 'API error')
  } catch (error) {
    console.error('Chat completion error:', error)
    throw error
  }
}