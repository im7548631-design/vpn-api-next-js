import { NextResponse } from 'next/server';
import { vpnDb } from '../../../lib/vpnStore';

export async function GET() {
  const currentIp = vpnDb.currentConnection ? vpnDb.currentConnection.ip : '127.0.0.1 (Unprotected)';
  return NextResponse.json({ success: true, ip: currentIp, connection: vpnDb.currentConnection });
}
