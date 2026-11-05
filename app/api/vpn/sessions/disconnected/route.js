import { NextResponse } from 'next/server';
import { vpnDb } from '@/lib/vpnStore';

export async function GET() {
  return NextResponse.json({ success: true, count: vpnDb.disconnectedSessions.length, sessions: vpnDb.disconnectedSessions });
}
