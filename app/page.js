// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Load Google Fonts
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' });

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState('disconnected');
  const [connectedTime, setConnectedTime] = useState(null);
  const [currentIp, setCurrentIp] = useState('N/A');
  const [ipList, setIpList] = useState([]);
  const [version, setVersion] = useState('');
  const [connectedList, setConnectedList] = useState([]);
  const [disconnectedList, setDisconnectedList] = useState([]);
  const [latencyResult, setLatencyResult] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [errorMsg, setErrorMsg] = useState('');
  const [newIpInput, setNewIpInput] = useState('');

  const loadData = async () => {
    try {
      const [cRes, sRes, ipRes, poolRes, vRes, connRes, disconnRes] = await Promise.all([
        fetch('/api/countries').then((r) => r.json()),
        fetch('/api/vpn/status').then((r) => r.json()),
        fetch('/api/vpn/ip').then((r) => r.json()),
        fetch('/api/vpn/ip-pool').then((r) => r.json()),
        fetch('/api/vpn/version').then((r) => r.json()),
        fetch('/api/vpn/sessions/connected').then((r) => r.json()),
        fetch('/api/vpn/sessions/disconnected').then((r) => r.json()),
      ]);

      if (cRes.countries) setCountries(cRes.countries);
      if (sRes.status) setStatus(sRes.status);
      if (sRes.connectedTime) setConnectedTime(sRes.connectedTime);
      else setConnectedTime(null);
      if (ipRes.ip) setCurrentIp(ipRes.ip);
      if (poolRes.ips) setIpList(poolRes.ips);
      if (vRes.version) setVersion(vRes.version);
      if (connRes.sessions) setConnectedList(connRes.sessions);
      if (disconnRes.sessions) setDisconnectedList(disconnRes.sessions);
    } catch (err) {
      console.error('Failed fetching data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (countryCodeToUse = selectedCountry) => {
    setErrorMsg('');
    const res = await fetch('/api/vpn/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode: countryCodeToUse }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(`[HTTP ${res.status}] ${data.error || 'Connection failed'}`);
    }
    loadData();
  };

  const handleDisconnect = async () => {
    setErrorMsg('');
    await fetch('/api/vpn/disconnect', { method: 'POST' });
    loadData();
  };

  const handleAddIp = async () => {
    if (!newIpInput) return;
    await fetch('/api/vpn/ip-pool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: newIpInput, country: selectedCountry }),
    });
    setNewIpInput('');
    loadData();
  };

  const handleTestSleep = async (ms) => {
    const start = Date.now();
    const res = await fetch(`/api/test?ms=${ms}`).then((r) => r.json());
    setLatencyResult({ requested: ms, actual: Date.now() - start, serverReported: res.actualLatencyMs });
  };

  return (
    <main className={inter.className} style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto', lineHeight: '1.6', color: '#111827' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>VPN Control Panel</h1>
      <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
        <strong>Version:</strong> {version || 'Loading...'} | <strong>Current VPN IP:</strong>{' '}
        <code className={mono.className} style={{ background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
          {currentIp}
        </code>
      </p>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
          <strong>Error Response:</strong> {errorMsg}
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem', background: '#f9fafb' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>VPN Connection Controls</h2>
        <p>
          Status:{' '}
          <span style={{ fontWeight: 700, color: status === 'connected' ? '#059669' : '#dc2626' }}>
            {status.toUpperCase()}
          </span>
        </p>
        {connectedTime && (
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            <strong>Connected Time:</strong> {new Date(connectedTime).toLocaleString()}
          </p>
        )}

        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Target Country:</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', width: '220px', fontFamily: 'inherit' }}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>

          {status === 'disconnected' ? (
            <button
              onClick={() => handleConnect()}
              style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              Connect VPN
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              Disconnect VPN
            </button>
          )}

          <button
            onClick={() => handleConnect('INVALID_XYZ')}
            style={{ padding: '0.5rem 1rem', background: '#4b5563', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Test 404 Country Code
          </button>
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem', background: '#f9fafb' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Manage VPN IP Pool</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="e.g. 198.51.100.99"
            value={newIpInput}
            onChange={(e) => setNewIpInput(e.target.value)}
            className={mono.className}
            style={{ padding: '0.5rem', flex: 1, borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <button
            onClick={handleAddIp}
            style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Set / Add IP
          </button>
        </div>
        <h3 style={{ fontSize: '1rem', color: '#374151' }}>Pool Listing ({ipList.length})</h3>
        <ul className={mono.className} style={{ paddingLeft: '1.2rem', maxHeight: '140px', overflowY: 'auto', fontSize: '0.9rem' }}>
          {ipList.map((item) => (
            <li key={item.id}>
              <code>{item.ip}</code> — [{item.country}] ({item.status})
            </li>
          ))}
        </ul>
      </div>

      <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem', background: '#f9fafb' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Latency Test (`/api/test?ms`)</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleTestSleep(200)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
            Test 200ms
          </button>
          <button onClick={() => handleTestSleep(800)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
            Test 800ms
          </button>
        </div>
        {latencyResult && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Requested: <strong>{latencyResult.requested}ms</strong> | Round-trip: <strong>{latencyResult.actual}ms</strong>
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '1rem', marginTop: 0 }}>Connected Sessions ({connectedList.length})</h3>
          <ul className={mono.className} style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
            {connectedList.map((s, idx) => (
              <li key={idx} style={{ marginBottom: '0.4rem' }}>
                <b>{s.countryCode}</b> - {s.ip}
                <br />
                <small style={{ color: '#6b7280' }}>Time: {new Date(s.connectedTime).toLocaleTimeString()}</small>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '10px' }}>
          <h3 style={{ fontSize: '1rem', marginTop: 0 }}>Disconnected Sessions ({disconnectedList.length})</h3>
          <ul className={mono.className} style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
            {disconnectedList.map((s, idx) => (
              <li key={idx} style={{ marginBottom: '0.4rem' }}>
                <b>{s.countryCode}</b> - {s.ip}
                <br />
                <small style={{ color: '#6b7280' }}>Ended: {new Date(s.disconnectedTime).toLocaleTimeString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
