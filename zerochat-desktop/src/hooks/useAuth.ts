/**
 * Hook for authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { authApi, userApi, UserProfile } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  // Check authentication status
  const checkAuth = useCallback(async () => {
    console.log('[checkAuth] ========== CHECK AUTH STARTED ==========');
    const startTime = Date.now();
    
    try {
      console.log('[checkAuth] Step 1: Loading credentials...');
      let creds;
      try {
        creds = await authApi.loadCreds();
        console.log('[checkAuth] Step 1 result:', {
          hasCreds: !!creds,
          hasDeviceId: !!creds?.device_id,
          hasDeviceAuth: !!creds?.device_auth,
          deviceId: creds?.device_id ? `${creds.device_id.substring(0, 8)}...` : 'none',
        });
      } catch (loadError: any) {
        // If loadCreds fails (e.g., no credentials exist), that's fine - just not authenticated
        console.log('[checkAuth] Step 1 failed (expected if not logged in):', loadError?.message);
        console.log('[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        console.log('[checkAuth] ========== CHECK AUTH COMPLETED (no creds) ==========');
        return;
      }
      
      if (!creds || !creds.device_id || !creds.device_auth) {
        console.log('[checkAuth] Step 2: No valid credentials found');
        console.log('[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        console.log('[checkAuth] ========== CHECK AUTH COMPLETED (invalid creds) ==========');
        return;
      }
      
      console.log('[checkAuth] Step 2: Valid credentials found, fetching user info...');
      console.log('[checkAuth] Calling userApi.getMe()...');
      try {
        const user = await userApi.getMe();
        console.log('[checkAuth] Step 2 result: Raw user response:', user);
        console.log('[checkAuth] Step 2 result: User info fetched:', {
          username: user?.username,
          device_id: user?.device_id,
          device_id_type: typeof user?.device_id,
          hasUser: !!user,
          userKeys: user ? Object.keys(user) : [],
        });
        
        console.log('[checkAuth] About to set state: isAuthenticated=true, isLoading=false, user=', {
          username: user?.username,
          device_id: user?.device_id,
        });
        
        // Set state with explicit values
        setAuthState((prevState) => {
          console.log('[checkAuth] setAuthState callback called, prevState:', {
            isAuthenticated: prevState.isAuthenticated,
            isLoading: prevState.isLoading,
            hasUser: !!prevState.user,
          });
          
          const newState = {
            isAuthenticated: true,
            isLoading: false,
            user: user,
          };
          
          console.log('[checkAuth] setAuthState returning new state:', {
            isAuthenticated: newState.isAuthenticated,
            isLoading: newState.isLoading,
            username: newState.user?.username,
          });
          
          return newState;
        });
        
        // Log immediately after setState (though state won't be updated yet due to async nature)
        console.log('[checkAuth] setAuthState called (state update is async)');
        
        const duration = Date.now() - startTime;
        console.log(`[checkAuth] ✅ State update initiated in ${duration}ms`);
        console.log('[checkAuth] Note: State will be updated on next render');
        console.log('[checkAuth] ========== CHECK AUTH COMPLETED (success) ==========');
      } catch (getMeError: any) {
        console.error('[checkAuth] Step 2 failed: get_me error:', getMeError);
        const errorMsg = getMeError?.message || getMeError?.toString() || '';
        console.log('[checkAuth] Error message:', errorMsg);
        
        // If it's an auth error (401, 403), clear credentials
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('UNAUTHORIZED') || errorMsg.includes('invalid token') || errorMsg.includes('not provisioned')) {
          console.log('[checkAuth] Invalid credentials detected, clearing...');
          try {
            await authApi.clearCreds();
            console.log('[checkAuth] Credentials cleared');
          } catch (e) {
            console.warn('[checkAuth] Failed to clear credentials:', e);
          }
        }
        
        console.log('[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        console.log('[checkAuth] ========== CHECK AUTH COMPLETED (get_me failed) ==========');
      }
    } catch (error: any) {
      console.error('[checkAuth] Unexpected error:', error);
      console.log('[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      console.log('[checkAuth] ========== CHECK AUTH COMPLETED (error) ==========');
    }
  }, []);

  // Log state changes - this will fire whenever state actually updates
  useEffect(() => {
    console.log('[useAuth] 🔄 ========== STATE ACTUALLY CHANGED ==========');
    console.log('[useAuth] 🔄 New state values:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      username: user?.username,
      device_id: user?.device_id,
    });
    console.log('[useAuth] 🔄 This means React detected the state change and re-rendered');
    console.log('[useAuth] 🔄 ============================================');
  }, [isAuthenticated, user, isLoading]);

  // Initial check
  useEffect(() => {
    console.log('[useAuth] Initial mount - calling checkAuth()');
    checkAuth();
  }, [checkAuth]);

  // Sign up
  const signup = useCallback(async (username: string, password: string, inviteToken?: string, inviteBaseUrl?: string) => {
    console.log('[useAuth] Signup called for:', username);
    console.log('[useAuth] Has invite token:', !!inviteToken);
    try {
      await authApi.signup(username, password, inviteToken, inviteBaseUrl);
      console.log('[useAuth] Signup API call succeeded, checking auth...');
      // Wait a bit for credentials to be stored
      await new Promise(resolve => setTimeout(resolve, 100));
      await checkAuth();
      console.log('[useAuth] Auth check completed');
    } catch (error) {
      console.error('[useAuth] Signup failed:', error);
      throw error;
    }
  }, [checkAuth]);

  // Log in
  const login = useCallback(async (username: string, password: string) => {
    console.log('[useAuth] ========== LOGIN HOOK CALLED ==========');
    console.log('[useAuth] Username:', username);
    console.log('[useAuth] Current state before login:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      hasUser: !!authState.user,
    });
    const startTime = Date.now();
    
    try {
      console.log('[useAuth] Step 1: Calling authApi.login()...');
      await authApi.login(username, password);
      const loginDuration = Date.now() - startTime;
      console.log(`[useAuth] ✅ Step 1 completed: authApi.login() finished in ${loginDuration}ms`);
      
      console.log('[useAuth] Step 2: Waiting 100ms for credentials to be stored...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('[useAuth] Step 3: Calling checkAuth() to verify credentials...');
      await checkAuth();
      const totalDuration = Date.now() - startTime;
      console.log(`[useAuth] ✅ Step 3 completed: checkAuth() finished in ${totalDuration}ms`);
      
      // Log state AFTER checkAuth completes
      // Note: setState is async, so we need to wait for React to process the update
      // The useEffect above will log when state actually changes
      console.log('[useAuth] Waiting for React to process state update...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Read current state (might still be stale due to closure)
      console.log('[useAuth] State from closure (may be stale):', {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        hasUser: !!authState.user,
        username: authState.user?.username,
      });
      console.log('[useAuth] Note: Check the [useAuth] 🔄 State changed log above to see actual state');
      
      console.log(`[useAuth] ✅ Login hook completed successfully in ${totalDuration}ms`);
      console.log('[useAuth] ========== LOGIN HOOK ENDED ==========');
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[useAuth] ❌ Login hook failed after ${duration}ms:`, error);
      console.error('[useAuth] Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      console.log('[useAuth] ========== LOGIN HOOK ENDED (ERROR) ==========');
      throw error;
    }
  }, [checkAuth, authState]);

  // Provision with token (from invite link)
  const provision = useCallback(async (token: string, baseUrl?: string) => {
    try {
      await authApi.provisionWithToken(token, baseUrl);
      await checkAuth();
    } catch (error) {
      throw error;
    }
  }, [checkAuth]);

  // Log out
  const logout = useCallback(async () => {
    // Clear credentials from localStorage (web mode)
    try {
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
    
    // Clear credentials via bridge (Tauri/Android)
    try {
      const { platform } = await import('../services/bridge');
      if (!platform.isWeb) {
        const { invoke } = await import('../services/bridge');
        await invoke('clear_creds', {});
      }
    } catch (e) {
      // Bridge method might not exist, that's okay
    }
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  }, []);

  // Return state and methods
  // Using spread to ensure all state properties are included
  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    signup,
    login,
    provision,
    logout,
    refresh: checkAuth,
  };
}

