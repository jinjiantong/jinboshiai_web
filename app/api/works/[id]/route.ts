import { NextResponse } from 'next/server'

const WORKS_TABLE_ID = process.env.FEISHU_WORKS_TABLE_ID || 'tblXXXX'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ code: 1, success: false, msg: '缺少recordId' }, { status: 400 })
    }

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records/${id}`
    const headers = {
      'Authorization': `Bearer ${process.env.FEISHU_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    })

    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        success: true,
        msg: '删除成功'
      })
    } else {
      return NextResponse.json({ code: data.code, success: false, msg: data.msg || '删除失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('删除作品失败:', error)
    return NextResponse.json({ code: 1, success: false, msg: '删除作品失败' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { fields = {} } = body

    if (!id) {
      return NextResponse.json({ code: 1, success: false, msg: '缺少recordId' }, { status: 400 })
    }

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records/${id}`
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ code: 1, success: false, msg: '缺少recordId' }, { status: 400 })
    }

    const url = `https://open.feishu.cn/open-apis/bitable/v1/app-tables/${WORKS_TABLE_ID}/records/${id}`
    const headers = {
      'Authorization': `Bearer ${process.env.FEISHU_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, { headers })

    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        success: true,
        data: { record: data.data }
      })
    } else {
      return NextResponse.json({ code: data.code, success: false, msg: data.msg || '获取作品详情失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('获取作品详情失败:', error)
    return NextResponse.json({ code: 1, success: false, msg: '获取作品详情失败' }, { status: 500 })
  }
}