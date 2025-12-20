import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './ui/theme.css';

// Initialize bridge polyfill for Android (if needed)
if (typeof window !== 'undefined' && 'ZeroChatBridge' in window && !('__TAURI_INTERNALS__' in window)) {
  // Android WebView bridge polyfill
  (window as any).invoke = async function (cmd: string, args: any = {}) {
    const bridge = (window as any).ZeroChatBridge;
    if (!bridge) {
      throw new Error('ZeroChatBridge not available');
    }

    const argsJson = JSON.stringify(args);
    const result = bridge.invoke(cmd, argsJson);

    if (typeof result === 'string') {
      if (result.trim().startsWith('{"error":')) {
        const errorObj = JSON.parse(result);
        throw new Error(errorObj.error);
      }
      try {
        return JSON.parse(result);
      } catch (e) {
        if (result.startsWith('"') && result.endsWith('"')) {
          return result.slice(1, -1);
        }
        return result;
      }
    }
    return result;
  };

  console.log('Android bridge polyfill initialized');
}

// Wait for DOM to be fully loaded before rendering React
// This fixes React error #299 on Android WebView
function initializeApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found! Retrying in 100ms...');
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

// Ensure DOM is ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already loaded
  initializeApp();
}
