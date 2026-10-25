import { NextRequest, NextResponse } from 'next/server';
import { searchAmfiFunds } from '@/lib/extractors/amfiParser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const results = await searchAmfiFunds(query, category, limit);

    return NextResponse.json({
      success: true,
      query,
      totalCount: results.length,
      results
    });
  } catch (error) {
    console.error('Error in /api/funds/search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search funds from AMFI feed',
        results: []
      },
      { status: 500 }
    );
  }
}
