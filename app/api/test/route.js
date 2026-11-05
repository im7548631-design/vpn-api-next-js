import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const msParam = searchParams.get('ms');
  const sleepMs = msParam ? parseInt(msParam, 10) : 100;

  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, Math.min(sleepMs, 5000)));
  const duration = Date.now() - start;

  return NextResponse.json({
    success: true,
    requestedSleepMs: sleepMs,
    actualLatencyMs: duration,
  });
}
