import { vectorDB } from './vector-db'
import { getEmbedding } from './embedding'

const COLLECTION_NAME = 'chatbot_knowledge'
const TOP_K = 3

interface RAGResult {
  context: string
  sources: Array<{
    title: string
    category: string
    score: number
  }>
  found: boolean
}

export async function retrieve(query: string): Promise<RAGResult> {
  const queryVector = await getEmbedding(query)
  
  if (!queryVector.length) {
    return { context: '', sources: [], found: false }
  }

  try {
    const results = await vectorDB.search(COLLECTION_NAME, queryVector, TOP_K)

    if (!results.length) {
      return { context: '', sources: [], found: false }
    }

    const context = results
      .map((r, i) => `[参考${i + 1}] ${r.payload?.text || ''}`)
      .join('\n\n')

    const sources = results.map(r => ({
      title: r.payload?.title || '未知',
      category: r.payload?.category || '其他',
      score: r.score
    }))

    return { context, sources, found: true }
  } catch (error) {
    console.error('RAG retrieve error:', error)
    return { context: '', sources: [], found: false }
  }
}

export async function initKnowledgeBase(knowledgeItems: any[]): Promise<number> {
  console.log('Initializing knowledge base...')

  try {
    const exists = await vectorDB.collectionExists(COLLECTION_NAME)
    
    if (!exists) {
      console.log('Creating collection...')
      await vectorDB.createCollection(COLLECTION_NAME, 1024)
    } else {
      const count = await vectorDB.getCollectionPointsCount(COLLECTION_NAME)
      if (count > 0) {
        console.log(`Collection already has ${count} vectors`)
        return count
      }
    }

    const vectors = []
    
    for (let i = 0; i < knowledgeItems.length; i++) {
      const item = knowledgeItems[i]
      const text = `${item.title}\n\n${item.content}`
      
      console.log(`Processing: ${item.title} (${i + 1}/${knowledgeItems.length})`)
      
      const vector = await getEmbedding(text)
      
      if (vector.length > 0) {
        vectors.push({
          id: i + 1,
          text,
          vector,
          metadata: {
            title: item.title,
            category: item.category,
            subCategory: item.sub_category,
            keywords: item.keywords || []
          }
        })
      }
      
      await new Promise(r => setTimeout(r, 300))
    }

    if (vectors.length > 0) {
      await vectorDB.upsert(COLLECTION_NAME, vectors)
      console.log(`Knowledge base initialized with ${vectors.length} items`)
    }
    
    return vectors.length
  } catch (error) {
    console.error('Failed to initialize knowledge base:', error)
    throw error
  }
}