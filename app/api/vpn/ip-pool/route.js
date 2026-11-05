import { NextResponse } from 'next/server';
import { vpnDb } from "@/lib/vpnStore";

export async function GET() {
  return NextResponse.json({ success: true, count: vpnDb.ips.length, ips: vpnDb.ips });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { ip, country } = body;

  if (!ip) {
    return NextResponse.json({ success: false, error: 'IP address is required' }, { status: 400 });
  }

  const newIpEntry = {
    id: vpnDb.ips.length + 1,
    ip,
    country: (country || 'US').toUpperCase(),
    status: 'available',
  };

  vpnDb.ips.push(newIpEntry);
  return NextResponse.json({ success: true, message: 'VPN IP set/added successfully', ip: newIpEntry }, { status: 201 });
}
