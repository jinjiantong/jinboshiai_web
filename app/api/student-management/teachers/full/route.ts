import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TEACHERS_TABLE_ID = 'tblxN3e1fyhOMTSt';
const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    }
    throw new Error(`Failed to get access token`);
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function getClassInfo(recordId: string, token: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      }
    );
    
    if (response.data.code === 0) {
      return response.data.data?.record?.fields || {};
    }
    return {};
  } catch (error) {
    console.error('Error fetching class:', recordId, error);
    return {};
  }
}

export async function GET() {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to fetch teachers: ${response.data.msg}`);
    }

    const teachers = response.data.data?.items || [];
    
    const allClassIds = new Set<string>();
    teachers.forEach((teacher: any) => {
      const classIds = teacher.fields['上课班级ID']?.[0]?.record_ids || [];
      classIds.forEach((id: string) => allClassIds.add(id));
    });
    
    if (allClassIds.size > 0) {
      const classPromises = Array.from(allClassIds).map(id => getClassInfo(id, token));
      const classResults = await Promise.all(classPromises);
      
      const classIdToInfo = new Map<string, any>();
      Array.from(allClassIds).forEach((id, index) => {
        classIdToInfo.set(id, classResults[index]);
      });
      
      teachers.forEach((teacher: any) => {
        const classIds = teacher.fields['上课班级ID']?.[0]?.record_ids || [];
        if (classIds.length > 0) {
          teacher.fields['管理班级分类'] = classIds.map((id: string) => {
            const info = classIdToInfo.get(id);
            return info?.['班级分类'] || '班级';
          });
        }
      });
    }

    return NextResponse.json({ 
      code: 0, 
      data: teachers,
      cached: false
    });
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch teachers' 
    }, { status: 500 });
  }
}
