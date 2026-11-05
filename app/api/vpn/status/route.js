import { NextResponse } from 'next/server';
import { vpnDb } from '@/lib/vpnStore';

export async function GET() {
  const current = vpnDb.currentConnection;
  let connectedDurationSeconds = 0;

  if (current) {
    connectedDurationSeconds = Math.floor((Date.now() - new Date(current.connectedTime).getTime()) / 1000);
  }

  return NextResponse.json({
    status: current ? 'connected' : 'disconnected',
    connectedTime: current ? current.connectedTime : null,
    connectedDurationSeconds,
    connection: current || null,
  });
}
