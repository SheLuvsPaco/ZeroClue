/**
 * Bridge abstraction layer for Tauri (desktop) and Android WebView
 * Provides a unified API regardless of platform
 */

const SERVER_BASE = "http://127.0.0.1:8080";

// Detect platform
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const isAndroid = typeof window !== 'undefined' && 'ZeroChatBridge' in window;

// Web fallback: localStorage-based credential storage
const WEB_STORAGE_KEY = 'zerochat_web_creds';
const WEB_BASE_URL_KEY = 'zerochat_web_base_url';

function getWebStorage(): { device_id?: string; device_auth?: string; base_url?: string } {
  try {
    const stored = localStorage.getItem(WEB_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setWebStorage(creds: { device_id?: string; device_auth?: string; base_url?: string }) {
  try {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(creds));
  } catch (e) {
    console.warn('Failed to save credentials to localStorage:', e);
  }
}

// Unified invoke function
export async function invoke<T = any>(cmd: string, args: any = {}): Promise<T> {
  if (isTauri) {
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/tauri');
    return tauriInvoke<T>(cmd, args);
  } else if (isAndroid) {
    return new Promise((resolve, reject) => {
      try {
        const bridge = (window as any).ZeroChatBridge;
        if (!bridge) {
          reject(new Error('ZeroChatBridge not available'));
          return;
        }
        
        const argsJson = JSON.stringify(args);
        const result = bridge.invoke(cmd, argsJson);
        
        if (typeof result === 'string') {
          if (result.trim().startsWith('{"error":')) {
            try {
              const errorObj = JSON.parse(result);
              reject(new Error(errorObj.error));
              return;
            } catch (e) {
              reject(new Error(result));
              return;
            }
          }
          
          try {
            resolve(JSON.parse(result));
            return;
          } catch (e) {
            if (result.startsWith('"') && result.endsWith('"')) {
              resolve(result.slice(1, -1) as T);
            } else {
              resolve(result as T);
            }
            return;
          }
        }
        
        resolve(result);
      } catch (e: any) {
        reject(new Error(e.message || e.toString()));
      }
    });
  } else {
    // Web fallback - use localStorage and direct API calls
    const storage = getWebStorage();
    
    switch (cmd) {
      case 'set_base':
        storage.base_url = args.base || 'http://127.0.0.1:8080';
        setWebStorage(storage);
        return Promise.resolve('ok' as T);
        
      case 'load_creds':
        if (storage.device_id && storage.device_auth) {
          return Promise.resolve({
            device_id: storage.device_id,
            device_auth: storage.device_auth,
          } as T);
        }
        return Promise.resolve(null as T);
        
      case 'signup':
      case 'login': {
        // For web, we'll handle auth via direct API calls in the hooks
        // This is a placeholder - actual signup/login should use the API directly
        return Promise.reject(new Error('Use API directly in web mode'));
      }
      
      case 'get_me': {
        // Web mode: call /api/me directly
        const creds = storage;
        if (!creds.device_id || !creds.device_auth) {
          return Promise.reject(new Error('Not authenticated'));
        }
        
        const baseUrl = creds.base_url || SERVER_BASE;
        return fetch(`${baseUrl}/api/me`, {
          method: 'GET',
          headers: {
            'x-device-id': creds.device_id,
            'x-device-auth': creds.device_auth,
          },
        })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          return response.json() as Promise<T>;
        });
      }
      
      case 'friends_list': {
        // Web mode: call /api/friends/list directly
        // Note: This is handled by friendsApi.list() in api.ts now, but keeping for backward compatibility
        const creds = storage;
        if (!creds.device_id || !creds.device_auth) {
          return Promise.resolve({ friends: [] } as T);
        }
        
        const baseUrl = creds.base_url || SERVER_BASE;
        return fetch(`${baseUrl}/api/friends/list`, {
          method: 'GET',
          headers: {
            'x-device-id': creds.device_id,
            'x-device-auth': creds.device_auth,
          },
        })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          // Server returns { friends: [...] }, return as-is
          return response.json() as Promise<T>;
        });
      }
      
      case 'create_invite': {
        // Web mode: call /api/invite/create directly
        const creds = storage;
        if (!creds.device_id || !creds.device_auth) {
          return Promise.reject(new Error('Not authenticated'));
        }
        
        const baseUrl = creds.base_url || SERVER_BASE;
        const friendHint = args.friend_hint || null;
        const ttlMinutes = args.ttl_minutes || 60;
        
        return fetch(`${baseUrl}/api/invite/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-id': creds.device_id,
            'x-device-auth': creds.device_auth,
          },
          body: JSON.stringify({
            friend_hint: friendHint,
            ttl_minutes: ttlMinutes,
          }),
        })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          return response.json() as Promise<T>;
        });
      }
      
      default:
        // For other commands, return null or empty object
        console.warn(`Web mode: command '${cmd}' not fully supported, using fallback`);
        return Promise.resolve(null as T);
    }
  }
}

// Platform-specific utilities
export const platform = {
  isTauri,
  isAndroid,
  isWeb: !isTauri && !isAndroid,
};

