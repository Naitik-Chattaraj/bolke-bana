"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProjectStore } from '@/lib/store';
import { 
  fetchUserSessions, 
  fetchSessionMessages, 
  deleteSession, 
  createSession 
} from '@/lib/services/chat-service';
import { 
  History, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Clock, 
  Loader2, 
  ChevronRight,
  LogIn,
  Search
} from 'lucide-react';
import { AuthModal } from './auth-modal';

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionSidebar({ isOpen, onClose }: SessionSidebarProps) {
  const { user, isConfigured } = useAuth();
  const { 
    sessions, 
    setSessions, 
    activeSessionId, 
    setActiveSessionId, 
    setSpec, 
    setChatHistory, 
    startNewSession, 
    removeSession 
  } = useProjectStore();

  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load sessions when user changes or drawer opens
  useEffect(() => {
    if (user && isConfigured) {
      setLoading(true);
      fetchUserSessions(user.id)
        .then((data) => setSessions(data))
        .finally(() => setLoading(false));
    }
  }, [user, isConfigured, setSessions]);

  const handleSelectSession = async (session: any) => {
    if (session.id === activeSessionId) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      setActiveSessionId(session.id);
      setSpec(session.spec || null);

      // Fetch messages for this session
      const messages = await fetchSessionMessages(session.id);
      setChatHistory(
        messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at).getTime(),
        }))
      );
      onClose();
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    startNewSession();
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this session and its chats?')) return;

    setDeletingId(sessionId);
    try {
      const ok = await deleteSession(sessionId);
      if (ok) {
        removeSession(sessionId);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <aside className="fixed top-0 left-0 bottom-0 z-50 w-80 md:w-96 bg-background border-r shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <History className="w-4 h-4 text-primary" />
            <span>Chat Sessions</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleStartNew}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              title="Start New Session"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {user && sessions.length > 0 && (
          <div className="p-3 border-b bg-secondary/20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-input bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {!user ? (
            <div className="p-6 text-center space-y-4 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Sign in to save history</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Log in with your email address to save and resume your chats and software prototypes.
                </p>
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Sign In / Sign Up
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Loading your sessions...</span>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs font-medium">
                {searchTerm ? 'No matching sessions found.' : 'No saved sessions yet.'}
              </p>
              <p className="text-[11px]">
                {searchTerm ? 'Try a different search word' : 'Start speaking or typing to create your first session.'}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const dateStr = new Date(session.updated_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-primary/10 border-primary/40 text-foreground font-medium shadow-xs'
                      : 'border-border/60 hover:border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-xs truncate font-medium text-foreground block">
                        {session.title || 'Untitled Session'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      disabled={deletingId === session.id}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Session"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        {user && (
          <div className="p-3 border-t bg-secondary/10 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="truncate">{user.email}</span>
            <span>{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}</span>
          </div>
        )}
      </aside>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
