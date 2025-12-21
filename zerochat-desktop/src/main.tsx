import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './ui/theme.css';

// --- STEP 1: KILL THE GHOST (Clear Service Workers) ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      console.log('Unregistering ghost service worker:', registration);
      registration.unregister();
    }
  });
}

// Helper to write logs to the screen (so we can see what's happening on the phone)
function visualLog(msg: string) {
  console.log(msg);
  // Create a temporary log overlay if it doesn't exist
  let logDiv = document.getElementById('startup-log');
  if (!logDiv) {
    logDiv = document.createElement('div');
    logDiv.id = 'startup-log';
    logDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.8);color:#0f0;font-family:monospace;font-size:10px;padding:10px;z-index:9999;pointer-events:none;max-height:200px;overflow:hidden;';
    document.body.appendChild(logDiv);
  }
  const line = document.createElement('div');
  line.textContent = `> ${msg}`;
  logDiv.appendChild(line);
}

// --- STEP 2: SETUP BRIDGE POLYFILL ---
function setupBridge() {
  if (typeof window !== 'undefined' && 'ZeroChatBridge' in window) {
    visualLog('Bridge detected immediately.');

    // Android WebView bridge polyfill
    (window as any).invoke = async function (cmd: string, args: any = {}) {
      const bridge = (window as any).ZeroChatBridge;
      if (!bridge) throw new Error('ZeroChatBridge lost!');

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
          if (result.startsWith('"') && result.endsWith('"')) return result.slice(1, -1);
          return result;
        }
      }
      return result;
    };
    return true;
  }
  return false;
}

// --- STEP 3: WAIT FOR BRIDGE & RENDER ---
async function initializeApp() {
  visualLog('Initializing V9...');

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    visualLog('Root missing. Retrying...');
    setTimeout(initializeApp, 100);
    return;
  }

  // RACE: Wait for bridge up to 2 seconds
  let attempts = 0;
  const maxAttempts = 20; // 2 seconds (20 * 100ms)

  const waitForBridge = () => {
    // If we found the bridge, stop waiting and render
    if (setupBridge()) {
      visualLog('✅ Bridge successfully linked. Rendering App.');
      renderReact(rootElement);
      return;
    }

    // If we are likely NOT on Android (e.g. standard browser), just render
    if (!navigator.userAgent.includes('Android')) {
      visualLog('Not Android. Rendering immediately.');
      renderReact(rootElement);
      return;
    }

    attempts++;
    if (attempts < maxAttempts) {
      visualLog(`Waiting for Bridge... (${attempts}/${maxAttempts})`);
      setTimeout(waitForBridge, 100); // Check again in 100ms
    } else {
      visualLog('⚠️ Bridge Timed Out. Rendering anyway (Force Load).');
      // Define a dummy invoke so the app doesn't crash immediately
      (window as any).invoke = async () => { throw new Error('Bridge unreachable'); };
      renderReact(rootElement);
    }
  };

  // Start the race
  waitForBridge();
}

function renderReact(rootElement: HTMLElement) {
  // Clear the log after a few seconds so it doesn't block UI
  setTimeout(() => {
    const logDiv = document.getElementById('startup-log');
    if (logDiv) logDiv.style.display = 'none';
  }, 3000);

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}