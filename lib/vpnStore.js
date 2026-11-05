// lib/vpnStore.js

global.__vpnDb = global.__vpnDb || {
  version: '2.5.0',
  protocol: 'wireguard-v2',
  countries: [
    { id: 'us', name: 'United States', code: 'US', flag: '🇺🇸', status: 'available' },
    { id: 'gb', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', status: 'available' },
    { id: 'de', name: 'Germany', code: 'DE', flag: '🇩🇪', status: 'available' },
    { id: 'jp', name: 'Japan', code: 'JP', flag: '🇯🇵', status: 'available' },
    { id: 'ca', name: 'Canada', code: 'CA', flag: '🇨🇦', status: 'available' },
    { id: 'au', name: 'Australia', code: 'AU', flag: '🇦🇺', status: 'available' },
    { id: 'fr', name: 'France', code: 'FR', flag: '🇫🇷', status: 'available' },
    { id: 'sg', name: 'Singapore', code: 'SG', flag: '🇸🇬', status: 'available' },
    { id: 'ch', name: 'Switzerland', code: 'CH', flag: '🇨🇭', status: 'available' },
    { id: 'br', name: 'Brazil', code: 'BR', flag: '🇧🇷', status: 'available' },
  ],
  // Initial 10 VPN IPs
  ips: [
    { id: 1, ip: '198.51.100.1', country: 'US', status: 'available' },
    { id: 2, ip: '198.51.100.2', country: 'GB', status: 'available' },
    { id: 3, ip: '198.51.100.3', country: 'DE', status: 'available' },
    { id: 4, ip: '198.51.100.4', country: 'JP', status: 'available' },
    { id: 5, ip: '198.51.100.5', country: 'CA', status: 'available' },
    { id: 6, ip: '198.51.100.6', country: 'AU', status: 'available' },
    { id: 7, ip: '198.51.100.7', country: 'FR', status: 'available' },
    { id: 8, ip: '198.51.100.8', country: 'SG', status: 'available' },
    { id: 9, ip: '198.51.100.9', country: 'CH', status: 'available' },
    { id: 10, ip: '198.51.100.10', country: 'BR', status: 'available' },
  ],
  connectedSessions: [],
  disconnectedSessions: [],
  currentConnection: null,
};

export const vpnDb = global.__vpnDb;
