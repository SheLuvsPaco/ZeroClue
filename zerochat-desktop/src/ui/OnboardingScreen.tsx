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

  // Helper to clear stale data
  const clearStaleData = () => {
    try {
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) { }
  };

  // ✅ CLEAN SIGNUP (Async & Responsive)
  const handleSignup = async () => {
    setError('');
    clearStaleData();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log('[UI] Starting Async Signup...');

      // 1. Send request (This returns a Promise immediately)
      await signup(username, password, inviteToken || undefined, inviteBaseUrl || undefined);

      console.log('[UI] Signup Success!');

      // 2. Cleanup Invite Token if used
      if (hasInviteToken) {
        clearToken();
        // Clean URL without reloading
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          url.searchParams.delete('base');
          window.history.replaceState({}, '', url.pathname);
        }
      }

      // 3. Enter App
      window.location.reload();

    } catch (e: any) {
      console.error('[UI] Signup Failed:', e);
      setError(e.message || "Signup failed");
      setIsLoading(false);
    }
  };

  // ✅ CLEAN LOGIN
  const handleLogin = async () => {
    setError('');
    clearStaleData();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true);

    try {
      console.log('[UI] Starting Async Login...');
      await login(username, password);
      console.log('[UI] Login Success!');
      window.location.reload();
    } catch (e: any) {
      console.error('[UI] Login Failed:', e);
      setError(e.message || "Login failed");
      setIsLoading(false);
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
            <label className="block text-sm font-medium mb-2 text-[var(--text)]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // ✅ RESTORED: Enter key support
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) handleSignup();
              }}
              disabled={isLoading}
              placeholder="Min 8 characters"
              className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Invite Token Banner */}
          {hasInviteToken && !isLoading && (
            <div className="bg-blue-900/30 text-blue-400 p-3 rounded-lg text-sm text-center border border-blue-800">
              📨 You have an invite link! Sign up to join.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-sm text-center border border-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="flex-1 bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-[var(--success)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}