import { NextResponse } from 'next/server';
import { vpnDb } from '@/lib/vpnStore';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const countryCode = (body.countryCode || 'US').toUpperCase();

  const connectedTime = new Date().toISOString();
  const newSession = {
    sessionId: `sess_manual_${Date.now()}`,
    countryCode,
    ip: `198.51.100.${Math.floor(Math.random() * 200) + 10}`,
    connectedTime,
    createdAt: connectedTime,
    status: 'active',
  };

  vpnDb.connectedSessions.push(newSession);
  return NextResponse.json({ success: true, session: newSession }, { status: 201 });
}
