import { NextRequest, NextResponse } from 'next/server';
import { getCategoryPeers, calculatePeerRanking } from '@/lib/categoryAnalytics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'Flexi Cap';
    const schemeCode = searchParams.get('schemeCode') || '';
    const planType = searchParams.get('planType') || 'Direct';

    const peers = await getCategoryPeers(category, planType);
    const rankings = calculatePeerRanking(schemeCode, category);

    return NextResponse.json({
      success: true,
      category,
      totalPeers: peers.length || rankings.overallRank.totalPeers,
      rankings,
      peers: peers.slice(0, 15) // Top 15 peers
    });
  } catch (error) {
    console.error('Error in /api/funds/category-peers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category peers' },
      { status: 500 }
    );
  }
}
