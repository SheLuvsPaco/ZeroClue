/**
 * Hook for authentication state and operations
 * (Adapted for V13.15 Architecture with Race Condition Fixes)
 */

import { useState, useEffect, useCallback } from 'react';
// ✅ NEW IMPORTS: Direct functions from the traffic controller
import { logIn, signUp, getMe, provisionWithToken, UserProfile } from '../api';

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
      // NOTE: In the new architecture, "loadCreds" is internal to the adapters.
      // We skip straight to "Step 2" (Validation) which proves we have valid creds.
      console.log('[checkAuth] Step 1: Checking session validity via getMe()...');

      console.log('[checkAuth] Calling API getMe()...');
      try {
        const user = await getMe(); // ✅ REPLACED userApi.getMe()

        // ✅ CRITICAL FIX: Handle both snake_case (Rust) and camelCase (JS)
        // This ensures we find the username regardless of how the backend sends it
        const validUsername = user?.username || (user as any)?.user_name;
        const validDeviceId = user?.device_id || (user as any)?.deviceId;

        console.log('[checkAuth] Step 2 result: Raw user response:', user);
        console.log('[checkAuth] Step 2 result: User info fetched:', {
          original_username: user?.username,
          resolved_username: validUsername, // This is the one we care about
          device_id: validDeviceId,
          device_id_type: typeof validDeviceId,
          hasUser: !!user,
          userKeys: user ? Object.keys(user) : [],
        });

        // Use validUsername for the check, not just user.username
        if (user && validUsername) {
          console.log('[checkAuth] About to set state: isAuthenticated=true, isLoading=false, user=', {
            username: validUsername,
            device_id: validDeviceId,
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
              user: {
                ...user,
                username: validUsername, // ✅ Ensure the UI gets the correct field
                device_id: validDeviceId,
              },
            };

            console.log('[checkAuth] setAuthState returning new state:', {
              isAuthenticated: newState.isAuthenticated,
              isLoading: newState.isLoading,
              username: newState.user?.username,
            });

            return newState;
          });

          // Log immediately after setState
          console.log('[checkAuth] setAuthState called (state update is async)');

          const duration = Date.now() - startTime;
          console.log(`[checkAuth] ✅ State update initiated in ${duration}ms`);
          console.log('[checkAuth] Note: State will be updated on next render');
          console.log('[checkAuth] ========== CHECK AUTH COMPLETED (success) ==========');

        } else {
          // Case: We got a response, but it was empty or missing a name
          console.error('[checkAuth] User object returned but missing username:', user);
          throw new Error('No valid username found in response');
        }

      } catch (getMeError: any) {
        console.error('[checkAuth] Step 2 failed: get_me error:', getMeError);
        const errorMsg = getMeError?.message || getMeError?.toString() || '';
        console.log('[checkAuth] Error message:', errorMsg);

        // If it's an auth error (401, 403), we are just not logged in
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('UNAUTHORIZED') || errorMsg.includes('Not authenticated')) {
          console.log('[checkAuth] Session invalid or not found.');
        }

        console.log('[checkAuth] Setting state: isAuthenticated=false, isLoading=false, user=null');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        console.log('[checkAuth] ========== CHECK AUTH COMPLETED (not logged in) ==========');
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
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      hasUser: !!authState.user,
      username: authState.user?.username,
      device_id: authState.user?.device_id,
    });
    console.log('[useAuth] 🔄 This means React detected the state change and re-rendered');
    console.log('[useAuth] 🔄 ============================================');
  }, [authState.isAuthenticated, authState.user, authState.isLoading]);

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
      await signUp(username, password, inviteToken, inviteBaseUrl); // ✅ REPLACED authApi.signup
      console.log('[useAuth] Signup API call succeeded, checking auth...');

      // ✅ RACE CONDITION FIX: Wait 100ms for credentials to be stored
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
      console.log('[useAuth] Step 1: Calling logIn()...');
      await logIn(username, password); // ✅ REPLACED authApi.login
      const loginDuration = Date.now() - startTime;
      console.log(`[useAuth] ✅ Step 1 completed: logIn() finished in ${loginDuration}ms`);

      console.log('[useAuth] Step 2: Waiting 100ms for credentials to be stored (RACE CONDITION FIX)...');
      // ✅ RACE CONDITION FIX #1: Wait for Rust I/O
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('[useAuth] Step 3: Calling checkAuth() to verify credentials...');
      await checkAuth();

      // ✅ RACE CONDITION FIX #2: Wait for React State
      console.log('[useAuth] Waiting for React to process state update (RACE CONDITION FIX)...');
      await new Promise(resolve => setTimeout(resolve, 100));

      const totalDuration = Date.now() - startTime;
      console.log(`[useAuth] ✅ Step 3 completed: checkAuth() finished in ${totalDuration}ms`);

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
      await provisionWithToken(token, baseUrl); // ✅ REPLACED authApi.provisionWithToken

      // ✅ RACE CONDITION FIX: Wait 100ms here too
      await new Promise(resolve => setTimeout(resolve, 100));

      await checkAuth();
    } catch (error) {
      throw error;
    }
  }, [checkAuth]);

  // Log out
  const logout = useCallback(async () => {
    console.log('[useAuth] Logout called');

    // Clear credentials from localStorage (web mode)
    try {
      localStorage.removeItem('zerochat_web_creds');
      console.log('[useAuth] Cleared localStorage credentials');
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }

    // Clear credentials via bridge (Tauri/Android)
    try {
      // NOTE: We still use the bridge service directly for clearing creds
      // as it's a platform specific maintenance task
      const { platform } = await import('../services/bridge');
      if (!platform.isWeb) {
        const { invoke } = await import('../services/bridge');
        await invoke('clear_creds', {});
        console.log('[useAuth] Cleared Tauri credentials');
      }
    } catch (e) {
      // Bridge method might not exist, that's okay
    }

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    // Reload page to ensure UI updates
    console.log('[useAuth] Reloading page to show logged-out state...');
    window.location.reload();
  }, []);

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