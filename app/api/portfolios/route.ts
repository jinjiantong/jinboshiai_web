import { NextResponse } from 'next/server'

const BASE_TOKEN = 'D2S1bhTGTaorSCsJLiOc0QZvnPc'
const TABLE_ID = 'tblfYNMFjqvkNzod'

export async function GET() {
  try {
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records?page_size=100`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FEISHU_USER_ACCESS_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Feishu API error:', errorData)
      throw new Error(`Feishu API error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.data?.items) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch records',
        data: []
      })
    }

    const records = result.data.items
      .filter((record: any) => {
        const 是否展示 = record.fields.是否展示
        return 是否展示 === true || 是否展示 === 'true'
      })
      .map((record: any) => ({
        record_id: record.record_id,
        fields: {
          作品名称: record.fields.作品名称 || '',
          作品简介: record.fields.作品简介 || '',
          应用场景: record.fields.应用场景 || '',
          功能特性: record.fields.功能特性 || '',
          技术方案: record.fields.技术方案 || '',
          开发者: record.fields.开发者 || '',
          作品跳转链接: record.fields.作品跳转链接 || '',
          作品分类: record.fields.作品分类 || '',
          作品展示平台: record.fields.作品展示平台 || '',
          作品附件类型: record.fields.作品附件类型 || '',
          是否展示: record.fields.是否展示 || false,
          作品附件: record.fields.作品附件 || [],
          架构图: record.fields.架构图 || [],
          创建日期: record.fields.创建日期 || null,
        }
      }))

    return NextResponse.json(
      {
        success: true,
        data: records,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Portfolios API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch portfolios',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}
