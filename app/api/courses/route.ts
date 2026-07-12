import { NextResponse } from 'next/server'
import axios from 'axios'

const APP_ID = 'cli_a96bb944bef89bcb'
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp'
const WIKI_URL = 'https://bcn9tapz6cxp.feishu.cn/wiki/KwzLwiAL6iOJFxkzMgScPKUdnCb'

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (accessToken && now < tokenExpiry) {
    return accessToken
  }

  const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: APP_ID,
    app_secret: APP_SECRET,
  })

  if (response.data.code === 0) {
    accessToken = response.data.tenant_access_token
    tokenExpiry = now + (response.data.expire - 60) * 1000
    return accessToken!
  } else {
    throw new Error(`Failed to get access token: ${response.data.msg}`)
  }
}

interface Module {
  title: string
  description: string
  tags?: string[]
}

interface Course {
  id: number
  title: string
  subtitle: string
  duration: string
  modules: Module[]
  tools?: string
  result: string
  gradient: string
  color: string
}

export async function GET() {
  try {
    const token = await getAccessToken()
    const nodeToken = WIKI_URL.match(/wiki\/([^\?]+)/)?.[1]

    const wikiResponse = await axios.get(`https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { token: nodeToken },
    })

    const documentId = wikiResponse.data.data?.node?.obj_token

    if (!documentId) {
      throw new Error('Failed to get document ID')
    }

    const blocksResponse = await axios.get(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_token: '', page_size: 500 },
    })

    const blocks = blocksResponse.data?.data?.items || []
    const courses = parseAllCoursesFromBlocks(blocks)

    return NextResponse.json({
      success: true,
      data: {
        title: '金博士AI实验室课程',
        courses: courses
      }
    })

  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({
      success: false,
      error: error.message || '获取课程数据失败'
    }, { status: 500 })
  }
}

function extractTextFromElements(elements: any[]): string {
  if (!elements || !Array.isArray(elements)) {
    return ''
  }
  return elements.map(el => el.text_run?.content || '').join('')
}

function parseAllCoursesFromBlocks(blocks: any[]): Course[] {
  const courses: Course[] = []

  let currentChapter: number | null = null
  let currentModule: Module | null = null as Module | null
  let pendingDescription: string[] = []

  const courseConfig: { [key: number]: any } = {
    1: {
      id: 1,
      title: '第一章：课程简介',
      subtitle: '开启AI学习之旅，了解课程全貌与实战项目',
      duration: '',
      modules: [],
      result: '建立清晰的学习目标与路径规划',
      gradient: 'from-blue-400 to-blue-600',
      color: 'blue'
    },
    2: {
      id: 2,
      title: '第二章：一图吃透AI概念',
      subtitle: '快速理解AI核心概念，听完轻松拿捏',
      duration: '',
      modules: [],
      result: '掌握AI基础概念，理清龙虾、Skill、Agent、Token、MCP等核心术语',
      gradient: 'from-purple-400 to-purple-600',
      color: 'purple'
    },
    3: {
      id: 3,
      title: '第三章：提示词工程核心',
      subtitle: '掌握大模型使用秘诀，让AI更懂你',
      duration: '',
      modules: [],
      result: '掌握高效提示词写法，让AI产出更精准',
      gradient: 'from-green-400 to-green-600',
      color: 'green'
    },
    4: {
      id: 4,
      title: '第四章：一切皆技能',
      subtitle: '打造AI技能库，靠技能在AI时代取胜',
      duration: '',
      modules: [],
      result: '建立个人AI技能体系，实现工作流自动化',
      gradient: 'from-yellow-400 to-orange-500',
      color: 'yellow'
    },
    5: {
      id: 5,
      title: '第五章：AI办公',
      subtitle: '一招赶超10年老员工，办公效率翻倍',
      duration: '',
      modules: [],
      result: '掌握AI办公技巧，提升职场竞争力',
      gradient: 'from-cyan-400 to-cyan-600',
      color: 'cyan'
    },
    6: {
      id: 6,
      title: '第六章：智能体开发',
      subtitle: '拥有AI"员工"，高效又省心',
      duration: '',
      modules: [],
      result: '掌握智能体搭建，实现7×24自动化运行',
      gradient: 'from-rose-400 to-rose-600',
      color: 'rose'
    },
    7: {
      id: 7,
      title: '第七章：0基础做应用',
      subtitle: '不用编程基础，也能做出自己的AI应用',
      duration: '',
      modules: [],
      result: '独立完成AI应用开发，拥有专属作品集',
      gradient: 'from-indigo-400 to-indigo-600',
      color: 'indigo'
    },
    8: {
      id: 8,
      title: '第八章：企业实战案例',
      subtitle: '从微型企业到大型企业，真实案例深度剖析',
      duration: '',
      modules: [],
      result: '具备企业级AI项目落地能力',
      gradient: 'from-amber-400 to-amber-600',
      color: 'amber'
    }
  }

  const chapterPatterns = [
    { pattern: /^1\.\s*课程简介/, chapter: 1 },
    { pattern: /^2\.\s*一图吃透/, chapter: 2 },
    { pattern: /^3\.\s*为啥我的/, chapter: 3 },
    { pattern: /^4\.\s*一切皆技能/, chapter: 4 },
    { pattern: /^5\.\s*AI办公/, chapter: 5 },
    { pattern: /^6\.\s*我有智能体/, chapter: 6 },
    { pattern: /^7\.\s*0基础/, chapter: 7 },
    { pattern: /^8\.\s*企业实战/, chapter: 8 }
  ]

  blocks.forEach((block: any, index: number) => {
    const blockType = block.block_type

    if (blockType === 4 && block.heading2) {
      const chapterTitle = extractTextFromElements(block.heading2.elements)

      for (const cp of chapterPatterns) {
        if (cp.pattern.test(chapterTitle)) {
          if (currentModule && currentChapter !== null) {
            if (pendingDescription.length > 0) {
              currentModule.description = pendingDescription.join('；').substring(0, 300)
            }
            courseConfig[currentChapter].modules.push(currentModule)
          }

          currentChapter = cp.chapter
          currentModule = null
          pendingDescription = []
          break
        }
      }
    }

    if (blockType === 6 && block.heading4 && currentChapter !== null) {
      const moduleTitleRaw = extractTextFromElements(block.heading4.elements)
      let moduleTitle = moduleTitleRaw.replace(/【.*?】/g, '').replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim()

      if (moduleTitle.length < 3) {
        return
      }

      const tags: string[] = []
      if (moduleTitleRaw.includes('【实战】')) tags.push('实战')
      if (moduleTitleRaw.includes('【实验室】')) tags.push('实验室')

      if (currentModule) {
        if (pendingDescription.length > 0) {
          currentModule.description = pendingDescription.join('；').substring(0, 300)
        }
        courseConfig[currentChapter].modules.push(currentModule)
      }

      currentModule = {
        title: moduleTitle,
        description: '',
        tags: tags.length > 0 ? tags : undefined
      } as Module
      pendingDescription = []
    }

    if (blockType === 2 && block.text && currentModule && currentChapter !== null) {
      const text = extractTextFromElements(block.text.elements)

      if (text.trim() && !text.includes('##') && !text.includes('```') &&
          text.length > 5 && text.length < 300 &&
          !text.includes('http') && !text.includes('feishu.cn')) {
        if (!pendingDescription.includes(text)) {
          pendingDescription.push(text)
        }
      }
    }
  })

  if (currentModule && currentChapter !== null) {
    if (pendingDescription.length > 0) {
      currentModule.description = pendingDescription.join('；').substring(0, 300)
    }
    courseConfig[currentChapter].modules.push(currentModule)
  }

  for (let i = 1; i <= 8; i++) {
    if (courseConfig[i].modules.length > 0) {
      courses.push(courseConfig[i])
    }
  }

  return courses
}