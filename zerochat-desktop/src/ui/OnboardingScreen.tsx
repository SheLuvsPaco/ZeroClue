/**
 * Onboarding screen for signup/login (V10 FIX)
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

  // ✅ V10: FIRE & FORGET SIGNUP
  // This function does NOT await the bridge. It sends the command and then forces a reload.
  const handleSignup = () => {
    setError('');
    console.log('[UI] V10: STARTING FIRE & FORGET SEQUENCE...');

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // CRITICAL: Clear URL parameters to prevent invite flow interference
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.has('token')) {
          url.searchParams.delete('token');
          url.searchParams.delete('base');
          url.searchParams.delete('inviter');
          window.history.replaceState({}, '', url.pathname);
        }
      }
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) {
      // Ignore cleanup errors
    }

    setIsLoading(true);

    // 1. FIRE THE SIGNUP (Do not await!)
    // We assume the native side will handle it. We catch errors just for logging.
    signup(username, password, inviteToken || undefined, inviteBaseUrl || undefined)
      .then(() => console.log('[UI] Signup promise resolved (Bridge is fast today!)'))
      .catch(e => console.error('[UI] Background signup error (Ignored):', e));

    if (hasInviteToken) {
      clearToken();
    }

    // 2. THE COUNTDOWN TO RELOAD
    // We give the native app 3 seconds to write the file, then we reboot.
    let count = 3;
    const timer = setInterval(() => {
      console.log(`[UI] Force reload in ${count}...`);
      count--;
      if (count < 0) {
        clearInterval(timer);
        console.log('[UI] 🚀 TIME UP. RELOADING INTO APP.');
        window.location.reload();
      }
    }, 1000);
  };

  const handleLogin = async () => {
    console.log('[UI] ========== LOGIN FLOW STARTED ==========');

    setError('');
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    // Clear cleanup
    try {
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) { }

    setIsLoading(true);
    const startTime = Date.now();
    try {
      await login(username, password);
      console.log(`[UI] ✅ Login completed successfully`);
      window.location.reload();
    } catch (e: any) {
      const duration = Date.now() - startTime;
      console.error(`[UI] ❌ Login failed after ${duration}ms:`, e);
      const errorMsg = e?.message || e?.toString() || "Unknown error";
      setError(errorMsg);
      try { localStorage.removeItem('zerochat_web_creds'); } catch (err) { }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--bg)] z-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--text)]">
          Welcome to ZeroChat
          {/* VISUAL PROOF MARKER */}
          <div className="bg-red-600 text-white text-sm p-2 mt-2 rounded">
            V10: NUCLEAR FIRE & FORGET
          </div>
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
              {isLoading ? 'Processing...' : 'Sign Up'}
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