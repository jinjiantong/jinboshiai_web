interface VectorItem {
  id: number
  text: string
  vector: number[]
  metadata?: Record<string, any>
}

interface SearchResult {
  id: number
  score: number
  payload: {
    text: string
    title: string
    category: string
    subCategory?: string
    keywords?: string[]
  }
}

export class QdrantClient {
  private baseUrl: string

  constructor(host: string = 'localhost', port: number = 6333) {
    this.baseUrl = `http://${host}:${port}`
  }

  async createCollection(name: string, dimension: number = 1024): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: {
          size: dimension,
          distance: 'Cosine'
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create collection: ${error}`)
    }
  }

  async upsert(name: string, vectors: VectorItem[]): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${name}/points?wait=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        points: vectors.map((v, i) => ({
          id: v.id || i + 1,
          vector: v.vector,
          payload: {
            text: v.text,
            ...v.metadata
          }
        }))
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to upsert vectors: ${error}`)
    }
  }

  async search(name: string, vector: number[], topK: number = 3): Promise<SearchResult[]> {
    const response = await fetch(`${this.baseUrl}/collections/${name}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector,
        limit: topK,
        with_payload: true,
        score_threshold: 0.5
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to search: ${error}`)
    }

    const data = await response.json()
    return data.result || []
  }

  async deleteCollection(name: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${name}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete collection`)
    }
  }

  async collectionExists(name: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/collections/${name}`)
    return response.ok
  }

  async getCollectionInfo(name: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/collections/${name}`)
    const data = await response.json()
    return data.result
  }

  async getCollectionPointsCount(name: string): Promise<number> {
    try {
      const info = await this.getCollectionInfo(name)
      return info?.points_count || 0
    } catch {
      return 0
    }
  }
}

export const vectorDB = new QdrantClient(
  process.env.QDRANT_HOST || 'localhost',
  parseInt(process.env.QDRANT_PORT || '6333')
)

export { VectorItem, SearchResult }