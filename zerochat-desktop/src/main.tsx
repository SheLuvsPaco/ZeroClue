import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './ui/theme.css';

// =========================================================================
// ✅ V13.2 TITANIUM BRIDGE (Syntax Fixed)
// =========================================================================

// 1. THE TICKET REGISTRY
const pendingRequests = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();

// 2. THE LISTENER
(window as any).onNativeResponse = (requestId: string, resultJson: string) => {
  const resolver = pendingRequests.get(requestId);

  if (!resolver) {
    // ✅ FIXED: Proper function call syntax
    console.warn(`[Bridge] Received orphan response: ${requestId}`);
    return;
  }

  pendingRequests.delete(requestId);

  try {
    const result = JSON.parse(resultJson);

    if (result && typeof result === 'object' && result.error) {
      // ✅ FIXED: Proper syntax with two arguments
      console.error(`[Bridge] Native Error (${requestId}):`, result.error);
      resolver.reject(new Error(result.error));
    } else {
      resolver.resolve(result);
    }
  } catch (e) {
    // ✅ FIXED
    console.log(`[Bridge] Raw Result (${requestId}):`, resultJson);
    resolver.resolve(resultJson);
  }
};

// 3. THE SENDER
(window as any).invoke = (cmd: string, args: any = {}) => {
  return new Promise((resolve, reject) => {

    // Check if bridge exists
    if (typeof window === 'undefined' || !('ZeroChatBridge' in window)) {
      // ✅ FIXED
      console.warn(`[Bridge] Mocking call (No Bridge): ${cmd}`);
      setTimeout(() => resolve({ success: true, mock: true }), 500);
      return;
    }

    const bridge = (window as any).ZeroChatBridge;
    const requestId = 'req_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

    pendingRequests.set(requestId, { resolve, reject });

    try {
      // STRATEGY: Try Async (postMessage) first
      if (typeof bridge.postMessage === 'function') {
        bridge.postMessage(cmd, JSON.stringify(args), requestId);
      }
      // FALLBACK: Try Sync (invoke) for older APKs
      else if (typeof bridge.invoke === 'function') {
        // ✅ FIXED
        console.warn(`[Bridge] Degraded: sync invoke for ${cmd}`);
        const result = bridge.invoke(cmd, JSON.stringify(args));

        // Manually trigger response listener since sync returns immediately
        (window as any).onNativeResponse(requestId, result);
      }
      else {
        throw new Error("Bridge exists but has no methods!");
      }
    } catch (e) {
      pendingRequests.delete(requestId);
      // ✅ FIXED
      console.error(`[Bridge] Critical Failure:`, e);
      reject(e);
    }
  });
};

// =========================================================================
// APP INITIALIZATION (Safe Start)
// =========================================================================

function initializeApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("Root element missing! Retrying in 100ms...");
    setTimeout(initializeApp, 100);
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}