import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Digital Afterlife Manager',
  description: 'Securely manage and transfer your legacy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Font: Sora */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div className="gradient-text app-title">AfterLife Manager</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Manage subscriptions, assets & wishes</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn btn-glass">Profile</button>
              <button className="btn btn-primary">New Entry</button>
            </div>
          </header>

          <aside className="sidebar glass-panel">
            <nav>
              <Link href="/" className="nav-item">Dashboard</Link>
              <Link href="/assistant" className="nav-item">Assistant</Link>
              <Link href="/settings" className="nav-item">Settings</Link>
            </nav>
          </aside>

          <section className="content glass-panel">
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
