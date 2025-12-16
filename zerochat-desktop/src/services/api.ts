/**
 * API service layer - connects to server REST APIs
 * Uses bridge for authenticated requests
 */

import { invoke } from './bridge';

const SERVER_BASE = "http://127.0.0.1:8080";

// Get base URL (from bridge or default)
async function getBaseUrl(): Promise<string> {
  try {
    await invoke<string>("set_base", { base: SERVER_BASE });
    return SERVER_BASE;
  } catch {
    return SERVER_BASE;
  }
}

// Get auth headers
async function getAuthHeaders(): Promise<{ 'x-device-id': string; 'x-device-auth': string }> {
  const creds = await invoke<{ device_id: string; device_auth: string }>("load_creds");
  if (!creds || !creds.device_id || !creds.device_auth) {
    throw new Error('Not authenticated');
  }
  return {
    'x-device-id': creds.device_id,
    'x-device-auth': creds.device_auth,
  };
}

// Make authenticated API request
async function apiRequest<T>(
  method: string,
  path: string,
  body?: any
): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  try {
    const authHeaders = await getAuthHeaders();
    Object.assign(headers, authHeaders);
  } catch {
    // If not authenticated, some endpoints might still work
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

// Friends API
export const friendsApi = {
  async list(): Promise<Array<{ username: string; status: string }>> {
    const { platform } = await import('./bridge');
    
    if (platform.isWeb) {
      // Web mode: call /api/friends/list directly
      const baseUrl = await getBaseUrl();
      const response = await apiRequest<{ friends: Array<{ username: string; status: string; user_id?: string; created_at?: string }> }>(
        'GET',
        '/api/friends/list'
      );
      
      // Server returns { friends: [...] }, extract the array
      if (response && typeof response === 'object' && 'friends' in response) {
        return (response.friends || []) as Array<{ username: string; status: string }>;
      }
      
      // Fallback: if response is already an array (shouldn't happen, but handle it)
      if (Array.isArray(response)) {
        return response as Array<{ username: string; status: string }>;
      }
      
      // If response is invalid, return empty array
      console.warn('[friendsApi] Invalid response format, returning empty array:', response);
      return [];
    }
    
    // Tauri/Android: use bridge
    const result = await invoke<{ friends?: Array<{ username: string; status: string }> } | Array<{ username: string; status: string }>>("friends_list");
    
    // Handle both formats: { friends: [...] } or [...]
    if (Array.isArray(result)) {
      return result;
    }
    
    if (result && typeof result === 'object' && 'friends' in result) {
      return (result.friends || []) as Array<{ username: string; status: string }>;
    }
    
    // Invalid format, return empty array
    console.warn('[friendsApi] Bridge returned invalid format, returning empty array:', result);
    return [];
  },
  
  async request(toUsername: string): Promise<void> {
    await invoke<string>("friend_request", { to_username: toUsername });
  },
  
  async respond(fromUsername: string, accept: boolean): Promise<void> {
    await invoke<string>("friend_respond", { from_username: fromUsername, accept });
  },
};

// Messages API
export interface MessageResponse {
  id: string;
  from_username?: string;
  to_username?: string;
  ciphertext_b64: string;
  created_at: string;
  expires_at?: string;
}

export interface SendMessageRequest {
  to_username: string;
  ciphertext_b64: string;
}

export interface SendMessageResponse {
  queued: boolean;
  count: number;
}

export const messagesApi = {
  // Pull messages (existing bridge method)
  async pull(): Promise<string[]> {
    return invoke<string[]>("pull_and_decrypt");
  },
  
  // Send message (existing bridge method)
  async send(username: string, plaintext: string): Promise<string> {
    return invoke<string>("send_to_username_hpke", { username, plaintext });
  },
  
  // Get messages with pagination (if server supports it)
  async getMessages(chatId: string, cursor?: string): Promise<{
    messages: MessageResponse[];
    nextCursor?: string;
  }> {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams({ chatId });
    if (cursor) params.append('cursor', cursor);
    
    return apiRequest<{ messages: MessageResponse[]; nextCursor?: string }>(
      'GET',
      `/api/messages?${params.toString()}`
    );
  },
};

// User/Profile API
export interface UserProfile {
  username: string;
  device_id: string;
}

export const userApi = {
  async getMe(): Promise<UserProfile> {
    return invoke<UserProfile>("get_me");
  },
  
  async createInvite(friendHint: string | null, ttlMinutes: number = 60): Promise<{ invite_link: string }> {
    return invoke<{ invite_link: string }>("create_invite", {
      friend_hint: friendHint,
      ttl_minutes: ttlMinutes,
    });
  },
};

// Auth API
export const authApi = {
  async signup(username: string, password: string, inviteToken?: string, inviteBaseUrl?: string): Promise<void> {
    console.log('[AUTH] ========== SIGNUP API CALL STARTED ==========');
    console.log('[AUTH] Username:', username);
    console.log('[AUTH] Has invite token:', !!inviteToken);
    console.log('[AUTH] Invite base URL:', inviteBaseUrl || 'not provided');
    
    const { platform } = await import('./bridge');
    
    if (platform.isWeb) {
      // Web mode: signup then provision
      // Step 1: Signup to get provision token
      const baseUrl = inviteBaseUrl || SERVER_BASE;
      console.log('[AUTH] Using base URL:', baseUrl);
      console.log('[AUTH] Calling /api/signup');
      
      const signupResponse = await fetch(`${baseUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!signupResponse.ok) {
        const errorText = await signupResponse.text();
        console.error('[AUTH] Signup failed:', signupResponse.status, errorText);
        throw new Error(`Signup failed: ${errorText}`);
      }
      
      const signupData = await signupResponse.json();
      console.log('[AUTH] Signup response:', signupData);
      const signupProvisionToken = signupData.provision_token;
      
      if (!signupProvisionToken) {
        console.error('[AUTH] No provision token in signup response');
        throw new Error('No provision token received from signup');
      }
      
      console.log('[AUTH] Signup successful, got provision token');
      
      // Step 2: If we have an invite token, use that instead (links to inviter)
      // Otherwise, use the signup provision token
      const tokenToUse = inviteToken || signupProvisionToken;
      console.log('[AUTH] Using token for provision:', inviteToken ? 'invite token (links to inviter)' : 'signup token (new user)');
      
      // Step 3: Provision with token to get device credentials
      console.log('[AUTH] Redeeming provision token');
      const provisionResponse = await fetch(`${baseUrl}/api/provision/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: tokenToUse,
          platform: 'web',
        }),
      });
      
      if (!provisionResponse.ok) {
        const errorText = await provisionResponse.text();
        console.error('[AUTH] Provision failed:', provisionResponse.status, errorText);
        throw new Error(`Provision failed: ${errorText}`);
      }
      
      const provisionData = await provisionResponse.json();
      console.log('[AUTH] Provision response:', { 
        ...provisionData, 
        device_auth: provisionData.device_auth ? '***' : 'missing',
      });
      
      if (!provisionData.device_id || !provisionData.device_auth) {
        console.error('[AUTH] Invalid provision response:', provisionData);
        throw new Error('Invalid provision response: missing device credentials');
      }

      // Store credentials in localStorage for web mode
      const creds = {
        device_id: provisionData.device_id,
        device_auth: provisionData.device_auth,
        base_url: baseUrl,
      };
      console.log('[AUTH] Storing credentials (device_id:', creds.device_id, ')');
      localStorage.setItem('zerochat_web_creds', JSON.stringify(creds));
      console.log('[AUTH] ========== SIGNUP API CALL COMPLETED ==========');
    } else {
      // Tauri/Android: use bridge
      // For Android, we need to pass the invite token if available
      await invoke<string>("set_base", { base: inviteBaseUrl || SERVER_BASE });
      
      if (inviteToken) {
        // If we have an invite token, provision with it after signup
        console.log('[AUTH] Android: Signing up, then provisioning with invite token');
        await invoke<string>("signup", { username, password, base_url: inviteBaseUrl || SERVER_BASE });
        // Note: The Android bridge signup already handles provision, but we might need to
        // call provision_with_token separately if the bridge doesn't support invite tokens
        // For now, the bridge signup creates a new user - we might need to update it
      } else {
        await invoke<string>("signup", { username, password, base_url: SERVER_BASE });
      }
      await invoke<string>("upload_identity_and_keypackage");
    }
  },
  
  async login(username: string, password: string): Promise<void> {
    console.log('[AUTH] ========== LOGIN API CALL STARTED ==========');
    console.log('[AUTH] Username:', username);
    console.log('[AUTH] Password length:', password.length);
    
    const { platform } = await import('./bridge');
    console.log('[AUTH] Platform detected:', platform.isWeb ? 'web' : platform.isTauri ? 'tauri' : 'android');
    
    if (platform.isWeb) {
      console.log('[AUTH] Using web mode login flow');
      // Web mode: login then provision
      // Step 1: Login to get provision token
      const loginUrl = `${SERVER_BASE}/api/login`;
      console.log('[AUTH] Step 1: Calling login endpoint:', loginUrl);
      
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('[AUTH] Login response status:', loginResponse.status, loginResponse.statusText);
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('[AUTH] Login failed:', errorText);
        throw new Error(`HTTP ${loginResponse.status}: ${errorText}`);
      }
      
      const loginData = await loginResponse.json();
      console.log('[AUTH] Login response data:', { ...loginData, provision_token: loginData.provision_token ? '***' : 'missing' });
      const provisionToken = loginData.provision_token;
      
      if (!provisionToken) {
        console.error('[AUTH] No provision token in login response');
        throw new Error('No provision token received from login');
      }
      
      console.log('[AUTH] Step 2: Redeeming provision token...');
      // Step 2: Provision with token to get device credentials
      const provisionUrl = `${SERVER_BASE}/api/provision/redeem`;
      console.log('[AUTH] Calling provision endpoint:', provisionUrl);
      
      const provisionResponse = await fetch(provisionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: provisionToken,
          platform: 'web',
        }),
      });
      
      console.log('[AUTH] Provision response status:', provisionResponse.status, provisionResponse.statusText);
      
      if (!provisionResponse.ok) {
        const errorText = await provisionResponse.text();
        console.error('[AUTH] Provision failed:', errorText);
        throw new Error(`HTTP ${provisionResponse.status}: ${errorText}`);
      }
      
      const provisionData = await provisionResponse.json();
      console.log('[AUTH] Provision response data:', {
        ...provisionData,
        device_auth: provisionData.device_auth ? '***' : 'missing',
      });

      // Store credentials in localStorage for web mode
      const creds = {
        device_id: provisionData.device_id,
        device_auth: provisionData.device_auth,
        base_url: SERVER_BASE,
      };
      console.log('[AUTH] Storing credentials:', { 
        device_id: creds.device_id, 
        device_auth: '***', 
        base_url: creds.base_url 
      });
      
      try {
        localStorage.setItem('zerochat_web_creds', JSON.stringify(creds));
        console.log('[AUTH] ✅ Credentials stored successfully');
      } catch (e) {
        console.error('[AUTH] ❌ Failed to store credentials:', e);
        throw new Error(`Failed to store credentials: ${e}`);
      }
      
      console.log('[AUTH] ========== LOGIN API CALL COMPLETED ==========');
    } else {
      console.log('[AUTH] Using native mode (Tauri/Android) login flow');
      // Tauri/Android: use bridge
      try {
        console.log('[AUTH] Step 1: Setting base URL...');
        await invoke<string>("set_base", { base: SERVER_BASE });
        console.log('[AUTH] Step 2: Calling native login...');
        await invoke<string>("login", { username, password, base_url: SERVER_BASE });
        console.log('[AUTH] Step 3: Uploading identity and keypackage...');
        await invoke<string>("upload_identity_and_keypackage");
        console.log('[AUTH] ✅ Native login completed');
      } catch (e: any) {
        console.error('[AUTH] ❌ Native login failed:', e);
        throw e;
      }
    }
  },
  
  async provisionWithToken(token: string, baseUrl?: string): Promise<void> {
    const { platform } = await import('./bridge');
    
    if (platform.isWeb) {
      // Web mode: call /api/provision/redeem
      const response = await fetch(`${baseUrl || SERVER_BASE}/api/provision/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          platform: 'web',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      // Store credentials in localStorage for web mode
      const creds = {
        device_id: data.device_id,
        device_auth: data.device_auth || data.device_token,
        base_url: baseUrl || SERVER_BASE,
      };
      localStorage.setItem('zerochat_web_creds', JSON.stringify(creds));
    } else {
      // Tauri/Android: use bridge
      await invoke<string>("provision_with_token", { token, base_url: baseUrl || SERVER_BASE });
      await invoke<string>("upload_identity_and_keypackage");
    }
  },
  
  async loadCreds(): Promise<{ device_id: string; device_auth: string } | null> {
    const { platform } = await import('./bridge');
    
    if (platform.isWeb) {
      const stored = localStorage.getItem('zerochat_web_creds');
      return stored ? JSON.parse(stored) : null;
    }
    
    try {
      const result = await invoke<{ device_id: string; device_auth: string }>("load_creds");
      // Tauri returns credentials or throws - if it throws, return null
      return result;
    } catch (error: any) {
      // If load_creds fails (e.g., no credentials exist), that's fine - just return null
      console.log('[AUTH] No credentials found (expected if not logged in):', error?.message);
      return null;
    }
  },
  
  async setBase(base: string): Promise<void> {
    await invoke<string>("set_base", { base });
  },
};

