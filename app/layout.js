// app/layout.js
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter'
});

const mono = JetBrains_Mono({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-mono'
});

export const metadata = {
  title: 'VPN Control Panel | Runsite',
  description: 'Next.js VPN API Management Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#ffffff', color: '#111827' }}>
        {children}
      </body>
    </html>
  );
}
