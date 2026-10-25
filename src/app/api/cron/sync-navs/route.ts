import { NextRequest, NextResponse } from 'next/server';
import { syncAmfiToDatabase } from '@/lib/db/syncNavs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds execution for cron sync

/**
 * Daily Cron Handler: GET/POST /api/cron/sync-navs
 * Scheduled daily to download official AMFI feeds and sync into database.
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const cronHeader = request.headers.get('x-cron-secret');
    const isDev = process.env.NODE_ENV === 'development';

    // Verify secret if configured and not in development
    if (cronSecret && !isDev) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` ||
        cronHeader === cronSecret ||
        request.nextUrl.searchParams.get('secret') === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid CRON_SECRET' },
          { status: 401 }
        );
      }
    }

    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    console.log(`[Cron Job] Starting daily AMFI sync pipeline at ${new Date().toISOString()}...`);

    const result = await syncAmfiToDatabase(limit);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to sync AMFI data',
          telemetry: result
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully executed daily AMFI synchronization pipeline',
      recordsProcessed: result.fundsProcessed,
      navEntriesProcessed: result.navEntriesProcessed,
      riskMetricsCalculated: result.riskMetricsCalculated,
      destination: result.databaseDestination,
      executionTimeMs: result.executionTimeMs,
      timestamp: result.timestamp,
      sampleSyncedFunds: result.sampleSyncedFunds
    });
  } catch (error: any) {
    console.error('[Cron Job Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error during cron execution'
      },
      { status: 500 }
    );
  }
}
