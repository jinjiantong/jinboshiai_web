import { NextResponse } from 'next/server'

const WORKS_TABLE_ID = process.env.FEISHU_WORKS_TABLE_ID || 'tblXXXX'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('force_refresh') === 'true'

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records`
    const headers = {
      'Authorization': `Bearer ${process.env.FEISHU_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      return NextResponse.json({ success: false, msg: '获取作品数据失败' }, { status: 500 })
    }

    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        success: true,
        data: {
          works: data.data?.items || [],
          total: data.data?.total || 0
        }
      })
    } else {
      return NextResponse.json({ success: false, msg: data.msg || '获取作品数据失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('获取作品数据失败:', error)
    return NextResponse.json({ success: false, msg: '获取作品数据失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fields = {} } = body

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records`
    const headers = {
      'Authorization': `Bearer ${process.env.FEISHU_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields })
    })

    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        success: true,
        msg: '添加成功',
        data: { record: data.data }
      })
    } else {
      return NextResponse.json({ code: data.code, success: false, msg: data.msg || '添加失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('添加作品失败:', error)
    return NextResponse.json({ code: 1, success: false, msg: '添加作品失败' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { recordId, fields = {} } = body

    if (!recordId) {
      return NextResponse.json({ code: 1, success: false, msg: '缺少recordId' }, { status: 400 })
    }

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records/${recordId}`
    const headers = {
      'Authorization': `Bearer ${process.env.FEISHU_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ fields })
    })

    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        success: true,
        msg: '更新成功',
        data: { record: data.data }
      })
    } else {
      return NextResponse.json({ code: data.code, success: false, msg: data.msg || '更新失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('更新作品失败:', error)
    return NextResponse.json({ code: 1, success: false, msg: '更新作品失败' }, { status: 500 })
  }
}