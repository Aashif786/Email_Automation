"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEmailStore } from '@/store/useEmailStore';

const ThemeToggle = () => {
  const theme = useEmailStore((state) => state.theme);
  const toggleTheme = useEmailStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded border border-caldim-border bg-caldim-dark hover:border-caldim-primary/40 hover:text-caldim-accent transition-all text-caldim-text-muted font-mono text-xxs tracking-widest uppercase shadow-sm active:scale-95"
    >
      {theme === 'dark' ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Light Mode
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          Dark Mode
        </>
      )}
    </button>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => 
    pathname === path 
      ? 'bg-caldim-primary/20 text-caldim-accent border-r-4 border-caldim-primary' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';

  return (
    <div className="w-64 bg-caldim-panel border-r border-caldim-border flex flex-col h-screen shrink-0 shadow-xl z-20 relative">
      <div className="p-6 border-b border-caldim-border bg-caldim-dark/30">
        <h1 className="text-xl font-black text-slate-100 tracking-wider flex items-center gap-2">
          <div className="w-4 h-4 bg-caldim-primary shadow-[0_0_8px_rgba(13,148,136,0.8)]">
          CALDIM<span className="text-caldim-primary font-light">POSTMASTER</span>
          </div>
        </h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-mono">Intelligent Email Classification Engine</p>
      </div>
      <nav className="flex-1 py-6 flex flex-col gap-2">
        <Link href="/" className={`px-6 py-3 text-sm font-semibold transition-colors uppercase tracking-wider flex items-center gap-3 ${isActive('/')}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Analytics
        </Link>
        <Link href="/inbox" className={`px-6 py-3 text-sm font-semibold transition-colors uppercase tracking-wider flex items-center gap-3 ${isActive('/inbox')}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          Inbox Streams
        </Link>
        <Link href="/triage" className={`px-6 py-3 text-sm font-semibold transition-colors uppercase tracking-wider flex items-center justify-between ${isActive('/triage')}`}>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Queue
          </div>
          <span className="bg-red-500/20 text-red-500 text-xxs px-1.5 py-0.5 rounded border border-red-500/30 font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]">!</span>
        </Link>
        <Link href="/junk" className={`px-6 py-3 text-sm font-semibold transition-colors uppercase tracking-wider flex items-center gap-3 ${isActive('/junk')}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Junk / Spam
        </Link>
        <Link href="/audit" className={`px-6 py-3 text-sm font-semibold transition-colors uppercase tracking-wider flex items-center gap-3 ${isActive('/audit')}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Audit Trail
        </Link>
      </nav>

    </div>
  );
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const theme = useEmailStore((state) => state.theme);
  const searchQuery = useEmailStore((state) => state.searchQuery);
  const setSearchQuery = useEmailStore((state) => state.setSearchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        // Do not intercept if the user is already typing in an input/textarea
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA' ||
          (document.activeElement as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <div className={`flex h-screen bg-caldim-dark text-caldim-text overflow-hidden font-sans selection:bg-caldim-primary/30 ${theme}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <header className="h-16 bg-caldim-panel/80 backdrop-blur border-b border-caldim-border flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className="absolute w-full h-full rounded-full bg-emerald-500 opacity-20 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">Node.js Engine Active</span>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH EMAILS (PRESS '/' TO FOCUS)"
                className="w-full pl-10 pr-10 py-1.5 bg-caldim-dark/50 border border-caldim-border rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-caldim-primary/60 focus:ring-1 focus:ring-caldim-primary/20 transition-all uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />
            <div className="text-xs font-mono text-slate-500">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
