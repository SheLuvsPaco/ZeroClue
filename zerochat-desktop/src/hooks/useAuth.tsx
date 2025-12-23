/**
 * Hook for authentication state and operations
 * Architecture: React Context + Explicit State Management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Direct functions from the traffic controller
import { logIn, signUp, getMe, provisionWithToken, UserProfile } from '../api';

// 1. Define the Context Shape
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, inviteToken?: string, inviteBaseUrl?: string) => Promise<void>;
  provision: (token: string, baseUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | null>(null);

// 3. The Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Global Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ HELPER: Normalize User Data (Handles Rust snake_case vs JS camelCase)
  const normalizeUser = (rawUser: any): UserProfile | null => {
    if (!rawUser) return null;

    // Check all possible casing variations
    const validUsername = rawUser.username || rawUser.user_name;
    const validDeviceId = rawUser.device_id || rawUser.deviceId;

    if (!validUsername) return null;

    return {
      ...rawUser,
      username: validUsername,
      device_id: validDeviceId
    };
  };

  // ✅ STRICT CHECK AUTH
  const checkAuth = useCallback(async () => {
    // console.log('[useAuth] Checking session validity...');
    try {
      // 1. Get raw profile
      const rawUser = await getMe();

      // 2. Normalize and Validate
      const profile = normalizeUser(rawUser);

      if (profile) {
        // Success: Update State
        setUser(profile);
        setIsAuthenticated(true);
        // console.log('[useAuth] Session Valid for:', profile.username);
      } else {
        console.warn('[useAuth] User object missing valid username', rawUser);
        throw new Error('User object missing valid username');
      }
    } catch (e: any) {
      // console.warn('[useAuth] Session Check Failed:', e.message || e);
      // If error, strictly wipe state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ EXPLICIT LOGIN (Fixes the UI update issue)
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log('[useAuth] Login started for:', username);

    try {
      console.log('[useAuth] Step 1: Calling logIn API...');
      await logIn(username, password);

      console.log('[useAuth] Step 2: Immediate verification via getMe...');
      const rawUser = await getMe();
      const profile = normalizeUser(rawUser);

      if (!profile) {
        throw new Error("Login succeeded but profile is empty or invalid");
      }

      // ✅ STEP 3: FORCE STATE UPDATE
      console.log('[useAuth] Step 3: Explicit State Update. Switching UI.');
      setUser(profile);
      setIsAuthenticated(true);

    } catch (error) {
      console.error('[useAuth] Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error; // Propagate error so LoginScreen can show "Wrong Password"
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ EXPLICIT SIGNUP
  const signup = async (username: string, password: string, inviteToken?: string, inviteBaseUrl?: string) => {
    setIsLoading(true);
    console.log('[useAuth] Signup started for:', username);

    try {
      console.log('[useAuth] Calling signUp API...');
      await signUp(username, password, inviteToken, inviteBaseUrl);

      // Immediate verification
      const rawUser = await getMe();
      const profile = normalizeUser(rawUser);

      if (profile) {
        console.log('[useAuth] Signup Success. Switching UI.');
        setUser(profile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[useAuth] Signup failed:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ PROVISIONING
  const provision = async (token: string, baseUrl?: string) => {
    try {
      await provisionWithToken(token, baseUrl);
      // Re-check auth immediately
      await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  // ✅ CLEAN LOGOUT (No Reloads)
  const logout = async () => {
    console.log('[useAuth] Logging out...');

    // 1. Wipe State immediately (UI updates instantly)
    setIsAuthenticated(false);
    setUser(null);

    // 2. Clear Web Credentials
    try {
      localStorage.removeItem('zerochat_web_creds');
    } catch (e) { }

    // 3. Clear Desktop/Android Credentials (if bridge exists)
    try {
      // Dynamic import to avoid issues if module is missing
      // @ts-ignore
      const { platform } = await import('../services/bridge').catch(() => ({ platform: { isWeb: true } }));

      if (platform && !platform.isWeb) {
        // @ts-ignore
        const { invoke } = await import('../services/bridge');
        await invoke('clear_creds', {});
      }
    } catch (e) {
      // Ignore bridge errors on web
      console.log('[useAuth] Bridge cleanup skipped (Web Mode)');
    }

    console.log('[useAuth] Logout complete.');
  };

  // Initial Mount Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ RETURN THE PROVIDER (Fixed Syntax)
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      signup,
      provision,
      logout,
      refresh: checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. The Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};