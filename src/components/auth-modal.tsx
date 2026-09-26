"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  X, 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'magic-link';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { 
    signInWithEmailPassword, 
    signUpWithEmailPassword, 
    signInWithMagicLink, 
    isConfigured 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'magic-link'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeChange = (newMode: 'signin' | 'signup' | 'magic-link') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'magic-link') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setErrorMessage(error);
        } else {
          setSuccessMessage('A magic login link has been sent to your email address!');
        }
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const { error, confirmationRequired } = await signUpWithEmailPassword(email, password);
        if (error) {
          setErrorMessage(error);
        } else if (confirmationRequired) {
          setSuccessMessage('Account created! Please check your email to verify your address.');
        } else {
          setSuccessMessage('Welcome! You are now signed in.');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1200);
        }
      } else {
        // Sign In
        const { error } = await signInWithEmailPassword(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          setSuccessMessage('Successfully signed in!');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-background border rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto mb-3 flex items-center justify-center">
            {mode === 'magic-link' ? <Sparkles className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'signup' && 'Create your account'}
            {mode === 'signin' && 'Welcome back'}
            {mode === 'magic-link' && 'Sign in with Magic Link'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'signup' && 'Sign up with email to save your chat sessions and prototypes.'}
            {mode === 'signin' && 'Sign in to access all your saved builds and conversation history.'}
            {mode === 'magic-link' && "We'll send a passwordless login link to your inbox."}
          </p>
        </div>

        {/* Configuration Notice if Supabase not configured */}
        {!isConfigured && (
          <div className="mb-6 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Supabase credentials required</span>
              <span>
                Please add <code className="bg-amber-500/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                <code className="bg-amber-500/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{' '}
                <code className="bg-amber-500/20 px-1 py-0.5 rounded">.env.local</code> file.
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
              />
            </div>
          </div>

          {mode !== 'magic-link' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('magic-link')}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup' && 'Sign Up'}
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'magic-link' && 'Send Magic Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode switch links */}
        <div className="mt-6 pt-4 border-t text-center space-y-2">
          {mode === 'signin' ? (
            <>
              <p className="text-xs text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="text-primary font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
              <button
                type="button"
                onClick={() => handleModeChange('magic-link')}
                className="text-xs text-muted-foreground hover:text-foreground underline block mx-auto"
              >
                Sign in with a passwordless magic link
              </button>
            </>
          ) : mode === 'signup' ? (
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('signin')}
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Back to email & password sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
