/**
 * Hook for managing invite tokens from deep links
 * Handles window.__zerochatProvision calls from Android
 */

import { useState, useEffect, useCallback } from 'react';

const INVITE_TOKEN_KEY = 'zerochat_invite_token';
const INVITE_BASE_URL_KEY = 'zerochat_invite_base_url';

export function useInviteToken() {
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteBaseUrl, setInviteBaseUrl] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(INVITE_TOKEN_KEY);
      const storedBaseUrl = localStorage.getItem(INVITE_BASE_URL_KEY);
      if (storedToken) {
        setInviteToken(storedToken);
        console.log('[useInviteToken] Loaded invite token from localStorage');
      }
      if (storedBaseUrl) {
        setInviteBaseUrl(storedBaseUrl);
        console.log('[useInviteToken] Loaded invite base URL from localStorage');
      }
    } catch (e) {
      console.warn('[useInviteToken] Failed to load from localStorage:', e);
    }
  }, []);

  // Set up window.__zerochatProvision handler
  useEffect(() => {
    // Define the global handler that Android will call
    (window as any).__zerochatProvision = (token: string) => {
      console.log('[useInviteToken] Received invite token from Android:', token ? `${token.substring(0, 8)}...` : 'empty');
      
      if (!token || typeof token !== 'string') {
        console.warn('[useInviteToken] Invalid token received');
        return;
      }

      // Check for pending token in localStorage (in case handler wasn't ready)
      try {
        const pendingBase = localStorage.getItem('zerochat_pending_invite_base');
        if (pendingBase) {
          setInviteBaseUrl(pendingBase);
          localStorage.setItem(INVITE_BASE_URL_KEY, pendingBase);
          localStorage.removeItem('zerochat_pending_invite_base');
          console.log('[useInviteToken] Loaded pending base URL:', pendingBase);
        }
      } catch (e) {
        console.warn('[useInviteToken] Failed to check pending base URL:', e);
      }
      
      setInviteToken(token);
      try {
        localStorage.setItem(INVITE_TOKEN_KEY, token);
        console.log('[useInviteToken] Stored invite token');
      } catch (e) {
        console.warn('[useInviteToken] Failed to store token:', e);
      }
    };

    console.log('[useInviteToken] Set up window.__zerochatProvision handler');

    // Check for pending token that was stored before handler was ready
    try {
      const pendingToken = localStorage.getItem('zerochat_pending_invite_token');
      if (pendingToken) {
        console.log('[useInviteToken] Found pending token, processing...');
        (window as any).__zerochatProvision(pendingToken);
        localStorage.removeItem('zerochat_pending_invite_token');
      }
    } catch (e) {
      console.warn('[useInviteToken] Failed to check pending token:', e);
    }

    // Cleanup
    return () => {
      // Don't remove the handler - Android might call it at any time
    };
  }, []);

  // Clear the token after use
  const clearToken = useCallback(() => {
    console.log('[useInviteToken] Clearing invite token');
    setInviteToken(null);
    setInviteBaseUrl(null);
    try {
      localStorage.removeItem(INVITE_TOKEN_KEY);
      localStorage.removeItem(INVITE_BASE_URL_KEY);
    } catch (e) {
      console.warn('[useInviteToken] Failed to clear token:', e);
    }
  }, []);

  return {
    inviteToken,
    inviteBaseUrl,
    clearToken,
    hasInviteToken: inviteToken !== null,
  };
}

