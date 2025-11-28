import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './ui/theme.css';

// Initialize bridge polyfill for Android (if needed)
if (typeof window !== 'undefined' && 'ZeroChatBridge' in window && !('__TAURI_INTERNALS__' in window)) {
  // Android WebView bridge polyfill
  (window as any).invoke = async function(cmd: string, args: any = {}) {
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

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

