import { NextResponse } from 'next/server';
import { vpnDb } from '@/lib/vpnStore';

export async function POST() {
  if (vpnDb.currentConnection) {
    const disconnectedTime = new Date().toISOString();
    const closedSession = {
      ...vpnDb.currentConnection,
      disconnectedTime,
      disconnectedAt: disconnectedTime,
      status: 'disconnected',
    };

    vpnDb.disconnectedSessions.push(closedSession);
    vpnDb.connectedSessions = vpnDb.connectedSessions.filter(
      (s) => s.sessionId !== vpnDb.currentConnection.sessionId
    );

    const releasedIp = vpnDb.ips.find((i) => i.ip === vpnDb.currentConnection.ip);
    if (releasedIp) releasedIp.status = 'available';

    vpnDb.currentConnection = null;
    return NextResponse.json({ success: true, message: 'VPN disconnected successfully', session: closedSession });
  }

  return NextResponse.json({ success: true, message: 'No active VPN connection found' });
}
