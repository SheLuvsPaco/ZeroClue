import React, { useEffect } from 'react';
import AppShell from './ui/AppShell';
import './ui/theme.css';
import { useInviteToken } from './hooks/useInviteToken';
// ✅ 1. IMPORT THE PROVIDER
import { AuthProvider } from './hooks/useAuth';

function App() {
  // Initialize invite token handler early
  const { inviteToken } = useInviteToken();

  // Log when invite token is available
  useEffect(() => {
    if (inviteToken) {
      console.log('[App] Invite token is available:', inviteToken.substring(0, 8) + '...');
    }
  }, [inviteToken]);

  return (
    // ✅ 2. WRAP THE APP (This turns the lights on)
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;