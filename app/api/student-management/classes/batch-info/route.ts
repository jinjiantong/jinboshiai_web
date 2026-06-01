import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const classCache: Map<string, { fields: any; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    });

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    } else {
      throw new Error(`Failed to get access token: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const recordIds: string[] = body.record_ids || [];
    
    if (recordIds.length === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: [] 
      });
    }
    
    const now = Date.now();
    const uncachedIds: string[] = [];
    const cachedInfos: any[] = [];
    
    recordIds.forEach((id, index) => {
      const cached = classCache.get(id);
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        cachedInfos.push({
          record_id: id,
          fields: cached.fields
        });
      } else {
        uncachedIds.push(id);
      }
    });
    
    let classInfos = [...cachedInfos];
    
    if (uncachedIds.length > 0) {
      let newClassInfos: any[] = [];
      
      if (uncachedIds.length === 1) {
        const response = await axios.get(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/${uncachedIds[0]}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        );
        
        if (response.data.code === 0) {
          const fields = response.data.data?.record?.fields || {};
          classCache.set(uncachedIds[0], { fields, timestamp: now });
          newClassInfos = [{
            record_id: uncachedIds[0],
            fields
          }];
        }
      } else {
        const batchPromises = [];
        const batchSize = 10;
        
        for (let i = 0; i < uncachedIds.length; i += batchSize) {
          const batchIds = uncachedIds.slice(i, i + batchSize);
          batchPromises.push(
            axios.post(
              `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/batch_get`,
              {
                record_ids: batchIds,
                fields: ['班级分类', '班级ID', '班级状态', '开班日期', '结课日期', '班级状态', '总课时数']
              },
              {
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                timeout: 10000
              }
            )
          );
        }
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach((response: any) => {
          if (response.data.code === 0 && response.data.data?.records) {
            response.data.data.records.forEach((record: any) => {
              const fields = record.fields || {};
              classCache.set(record.record_id, { fields, timestamp: now });
              newClassInfos.push({
                record_id: record.record_id,
                fields
              });
            });
          }
        });
      }
      
      classInfos = classInfos.concat(newClassInfos);
    }
    
    return NextResponse.json({ 
      code: 0, 
      data: classInfos 
    });
  } catch (error: any) {
    console.error('Error fetching class info:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch class info' 
    }, { status: 500 });
  }
}