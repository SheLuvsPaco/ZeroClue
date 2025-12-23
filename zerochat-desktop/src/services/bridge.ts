/**
 * Bridge abstraction layer for Tauri (desktop) and Android WebView
 * Provides a unified API regardless of platform
 */

const SERVER_BASE = "http://127.0.0.1:8080";

// Web fallback: localStorage-based credential storage
const WEB_STORAGE_KEY = 'zerochat_web_creds';

// ✅ HELPER: Dynamic Platform Detection
// We check this on every call to handle "Late Injection" by the Android WebView
const getPlatform = () => {
  if (typeof window === 'undefined') return 'web';
  // Check for Tauri
  if ('__TAURI_INTERNALS__' in window || '__TAURI__' in window) return 'tauri';
  // Check for Android Bridge
  if ('ZeroChatBridge' in window) return 'android';

  return 'web';
};

// Unified invoke function
export async function invoke<T = any>(cmd: string, args: any = {}): Promise<T> {
  const currentPlatform = getPlatform();

  // 🟢 1. TAURI PATH
  if (currentPlatform === 'tauri') {
    try {
      const { invoke: tauriInvoke } = await import('@tauri-apps/api/tauri');
      return await tauriInvoke<T>(cmd, args);
    } catch (e) {
      console.error('[Bridge-Tauri] Import failed:', e);
      throw e;
    }
  }

  // 🟢 2. ANDROID PATH (The Critical Path)
  else if (currentPlatform === 'android') {
    return new Promise((resolve, reject) => {
      try {
        const bridge = (window as any).ZeroChatBridge;

        console.log(`[Bridge-Android] Invoking: ${cmd}`, args); // 🔍 Visible in Logcat

        if (!bridge || typeof bridge.invoke !== 'function') {
          console.error('[Bridge-Android] Bridge found but invoke method missing!');
          reject(new Error('ZeroChatBridge.invoke is missing'));
          return;
        }

        const argsJson = JSON.stringify(args);

        // Synchronous call to Java/Rust
        // NOTE: If this hangs the UI, we may need to switch to async callbacks later
        const result = bridge.invoke(cmd, argsJson);

        console.log(`[Bridge-Android] Result for ${cmd}:`, typeof result === 'string' ? result.substring(0, 50) + '...' : result);

        // Handle String Responses (JSON)
        if (typeof result === 'string') {
          // Check for explicit error object
          if (result.trim().startsWith('{"error":')) {
            const errObj = JSON.parse(result);
            reject(new Error(errObj.error || "Unknown Native Error"));
            return;
          }

          // Try parsing standard JSON result
          try {
            const parsed = JSON.parse(result);
            resolve(parsed);
          } catch (e) {
            // If strictly a string result, return clean string
            if (result.startsWith('"') && result.endsWith('"')) {
              resolve(result.slice(1, -1) as unknown as T);
            } else {
              resolve(result as unknown as T);
            }
          }
        } else {
          // Handle direct object returns (rare in WebView, but possible)
          resolve(result);
        }

      } catch (e: any) {
        console.error(`[Bridge-Android] Critical Failure on ${cmd}:`, e);
        reject(new Error(e.message || "Android Bridge Exception"));
      }
    });
  }

  // 🔴 3. WEB FALLBACK (Development Mode)
  else {
    return handleWebFallback(cmd, args);
  }
}

// ✅ UTILITY: Web Fallback Logic (Moved out to clean up main function)
async function handleWebFallback<T>(cmd: string, args: any): Promise<T> {
  const storage = getWebStorage();
  console.warn(`[Bridge-Web] Fallback for: ${cmd}`);

  switch (cmd) {
    case 'set_base':
      const newBase = args.base || 'http://127.0.0.1:8080';
      setWebStorage({ ...storage, base_url: newBase });
      return 'ok' as unknown as T;

    case 'load_creds':
      if (storage.device_id && storage.device_auth) {
        return {
          device_id: storage.device_id,
          device_auth: storage.device_auth,
        } as unknown as T;
      }
      return null as unknown as T;

    // Web mode shouldn't handle complex logic here anymore
    // It should rely on the API adapters directly.
    default:
      return null as unknown as T;
  }
}

// Storage Helpers
function getWebStorage() {
  try {
    const stored = localStorage.getItem(WEB_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function setWebStorage(creds: any) {
  try {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(creds));
  } catch (e) { }
}

// ✅ EXPORT PLATFORM UTILS (Using Getters for Freshness)
export const platform = {
  get isTauri() { return getPlatform() === 'tauri'; },
  get isAndroid() { return getPlatform() === 'android'; },
  get isWeb() { return getPlatform() === 'web'; },
};