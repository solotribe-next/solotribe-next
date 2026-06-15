'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleTheme } = useTheme();

  return (
    <div className="dashboard-body">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <header className="dash-mobile-header">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <Link href="/" className="sidebar-logo">
          <span className="logo-solo">Solo</span>
          <span className="logo-tribe">
            Tribe.<span className="logo-circle"></span>
          </span>
        </Link>
        <button
          className="theme-toggle-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <svg className="theme-icon sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="theme-icon moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </header>

      <main className="dash-main">{children}</main>
    </div>
  );
}
