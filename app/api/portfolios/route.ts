import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://tcvfizogknylpgpuinoy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjdmZpem9na255bHBncHVpbm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc5MDQsImV4cCI6MjA5MDUzMzkwNH0.E4pkfKhNGAy0Ku3-mnJ8Snr_GA1Tr9UhD0njWFp4OAA';

export async function GET() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/portfolios?select=*&is_active=eq.true&order=sort_order.asc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch portfolios',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
