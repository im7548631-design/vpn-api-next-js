import { NextResponse } from 'next/server';
import { vpnDb } from '@/lib/vpnStore';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const countryCode = (body.countryCode || 'US').toUpperCase();

  // Validate country code presence in memory DB
  const countryExists = vpnDb.countries.find((c) => c.code === countryCode);
  if (!countryExists) {
    return NextResponse.json(
      { success: false, error: `Country code '${countryCode}' not found`, code: 404 },
      { status: 404 }
    );
  }

  // Find or fallback IP allocation
  let assignedIp = vpnDb.ips.find((i) => i.country === countryCode && i.status === 'available');
  if (!assignedIp) {
    assignedIp = vpnDb.ips.find((i) => i.status === 'available') || vpnDb.ips[0];
  }
  assignedIp.status = 'assigned';

  const connectedTime = new Date().toISOString();
  const session = {
    sessionId: `sess_${Date.now()}`,
    countryCode,
    countryName: countryExists.name,
    ip: assignedIp.ip,
    connectedTime,
    connectedAt: connectedTime,
    status: 'active',
  };

  vpnDb.currentConnection = session;
  vpnDb.connectedSessions.push(session);

  return NextResponse.json({ success: true, message: 'VPN connected successfully', session });
}
