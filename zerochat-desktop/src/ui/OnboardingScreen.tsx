/**
 * Onboarding screen for signup/login
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useInviteToken } from '../hooks/useInviteToken';

export default function OnboardingScreen() {
  const { signup, login } = useAuth();
  const { inviteToken, inviteBaseUrl, clearToken, hasInviteToken } = useInviteToken();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Show a message if invite token is available
  useEffect(() => {
    if (hasInviteToken) {
      console.log('[UI] Invite token detected - user should sign up to use it');
    }
  }, [hasInviteToken]);

  const handleSignup = async () => {
    setError('');
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // CRITICAL: Clear URL parameters to prevent invite flow interference
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('token')) {
        url.searchParams.delete('token');
        url.searchParams.delete('base');
        url.searchParams.delete('inviter');
        window.history.replaceState({}, '', url.pathname);
        console.log('[UI] Cleared invite token from URL');
      }
    }

    // Clear any existing credentials first
    try {
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) {
      // Ignore
    }

    setIsLoading(true);
    try {
      console.log('[UI] Starting signup for:', username);
      console.log('[UI] Has invite token:', hasInviteToken);

      // Signup with invite token if available
      await signup(username, password, inviteToken || undefined, inviteBaseUrl || undefined);

      console.log('[UI] Signup completed successfully');

      // Clear invite token after successful use
      if (hasInviteToken) {
        clearToken();
        console.log('[UI] Cleared invite token after successful signup');
      }

      // Force page reload to ensure UI updates
      console.log('[UI] Reloading page to show logged-in state...');
      window.location.reload();
    } catch (e: any) {
      console.error('[UI] Signup error:', e);
      const errorMsg = e?.message || e?.toString() || "Unknown error";
      setError(errorMsg);
      // Clear any partial credentials on error
      try {
        localStorage.removeItem('zerochat_web_creds');
      } catch (err) {
        // Ignore
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    console.log('[UI] ========== LOGIN FLOW STARTED ==========');
    console.log('[UI] Username:', username ? `${username.substring(0, 3)}***` : 'empty');
    console.log('[UI] Password length:', password.length);
    
    setError('');
    if (!username || !password) {
      console.warn('[UI] Validation failed: missing username or password');
      setError("Please enter username and password");
      return;
    }

    // CRITICAL: Clear URL parameters to prevent invite flow interference
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('token')) {
        url.searchParams.delete('token');
        url.searchParams.delete('base');
        url.searchParams.delete('inviter');
        window.history.replaceState({}, '', url.pathname);
        console.log('[UI] Cleared invite token from URL');
      }
    }

    // Clear any existing credentials first
    try {
      localStorage.removeItem('zerochat_web_creds');
      console.log('[UI] Cleared existing credentials from localStorage');
    } catch (e) {
      console.warn('[UI] Failed to clear localStorage:', e);
    }

    setIsLoading(true);
    const startTime = Date.now();
    try {
      console.log('[UI] Calling login() function...');
      await login(username, password);
      const duration = Date.now() - startTime;
      console.log(`[UI] ✅ Login completed successfully in ${duration}ms`);

      // Force page reload to ensure UI updates
      console.log('[UI] Reloading page to show logged-in state...');
      window.location.reload();
    } catch (e: any) {
      const duration = Date.now() - startTime;
      console.error(`[UI] ❌ Login failed after ${duration}ms:`, e);
      console.error('[UI] Error details:', {
        message: e?.message,
        stack: e?.stack,
        name: e?.name,
        toString: e?.toString(),
      });
      const errorMsg = e?.message || e?.toString() || "Unknown error";
      setError(errorMsg);
      // Clear any partial credentials on error
      try {
        localStorage.removeItem('zerochat_web_creds');
        console.log('[UI] Cleared partial credentials after error');
      } catch (err) {
        console.warn('[UI] Failed to clear credentials after error:', err);
      }
    } finally {
      setIsLoading(false);
      console.log('[UI] ========== LOGIN FLOW ENDED ==========');
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--bg)] z-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--text)]">
          Welcome to ZeroChat
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text)]">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text)]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSignup();
                }
              }}
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)]"
            />
          </div>
          {hasInviteToken && (
            <div className="text-[var(--accent)] text-sm text-center mb-2">
              📨 You have an invite link! Sign up to join.
            </div>
          )}
          {error && (
            <div className="text-[var(--error)] text-sm text-center">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="flex-1 bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              Sign Up
            </button>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-[var(--success)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

