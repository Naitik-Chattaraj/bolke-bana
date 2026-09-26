"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { useProjectStore } from '@/lib/store';
import { 
  User, 
  LogOut, 
  Plus, 
  ChevronDown, 
  ShieldCheck, 
  Settings, 
  Sparkles,
  Database
} from 'lucide-react';

export function UserProfileMenu() {
  const { user, signOut, isConfigured } = useAuth();
  const { startNewSession } = useProjectStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewSession = () => {
    startNewSession();
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    startNewSession();
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="relative flex items-center gap-2" ref={menuRef}>
        {!isConfigured && (
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            title="Supabase is not configured yet"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Connect Supabase</span>
          </button>
        )}

        {user ? (
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-background hover:bg-accent transition-colors text-xs font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[120px] truncate hidden sm:inline">{user.email}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-background p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b mb-1">
                  <p className="text-[11px] font-medium text-muted-foreground">Signed in as</p>
                  <p className="text-xs font-semibold truncate text-foreground">{user.email}</p>
                </div>

                <button
                  onClick={handleNewSession}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-accent text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Start New Session</span>
                </button>

                <div className="my-1 border-t" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthMode('signin');
                setAuthModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-secondary transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Supabase Config Guidance Modal */}
      {showConfigModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="w-full max-w-lg bg-background border rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Database className="w-5 h-5" />
                <span>Supabase Configuration</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-secondary"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              To store chat history per user and enable email logins, add your Supabase project keys to <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground font-mono">.env.local</code>:
            </p>

            <div className="p-4 rounded-xl bg-secondary/60 border font-mono text-xs space-y-2 overflow-x-auto">
              <p className="text-muted-foreground"># Add to .env.local</p>
              <p className="text-foreground">NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co</p>
              <p className="text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...</p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground">Steps to setup:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-primary underline">supabase.com</a>.</li>
                <li>Go to <b>Project Settings → API</b> and copy the Project URL and Anon API key.</li>
                <li>Run the SQL script located in <code className="font-mono text-foreground">supabase/schema.sql</code> in your Supabase SQL Editor.</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
              >
                Got it
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
