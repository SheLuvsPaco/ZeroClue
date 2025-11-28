/**
 * Main app shell - handles layout and routing
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatList from './ChatList';
import ChatView from './ChatView';
import OnboardingScreen from './OnboardingScreen';
import SettingsMenu from './SettingsMenu';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function AppShell() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Debug: Log auth state changes - this will fire when state actually updates
  useEffect(() => {
    console.log('[AppShell] ========== AUTH STATE RECEIVED ==========');
    console.log('[AppShell] Current values:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      username: user?.username,
      device_id: user?.device_id,
    });
    console.log('[AppShell] Will render:', {
      showLoading: isLoading,
      showOnboarding: !isLoading && !isAuthenticated,
      showMainApp: !isLoading && isAuthenticated,
    });
    console.log('[AppShell] =========================================');
  }, [isAuthenticated, isLoading, user]);
  
  // Check for invite token in URL ONLY if user explicitly wants to use invite link
  // Don't auto-provision - let user choose signup/login or invite
  // Invite links should be handled separately, not auto-triggered
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      // Focus search input in chat list
      searchInputRef.current?.focus();
    },
    onBack: () => {
      if (selectedChatId) {
        setSelectedChatId(null);
      }
    },
    enabled: isAuthenticated,
  });

  // Log render decision
  console.log('[AppShell] Render decision:', {
    isLoading,
    isAuthenticated,
    willShowLoading: isLoading,
    willShowOnboarding: !isLoading && !isAuthenticated,
    willShowMainApp: !isLoading && isAuthenticated,
  });

  if (isLoading) {
    console.log('[AppShell] Rendering: Loading screen');
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[AppShell] Rendering: OnboardingScreen');
    return <OnboardingScreen />;
  }

  console.log('[AppShell] Rendering: Main app (ChatList + ChatView)');

  return (
    <>
      <div className="h-screen flex bg-[var(--bg)] text-[var(--text)]">
        {/* Chat list sidebar */}
        <div className="w-80 border-r border-[var(--border)] flex flex-col">
          <ChatList
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            searchInputRef={searchInputRef}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Main chat view */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <ChatView
              chatId={selectedChatId}
              myUsername={user?.username || ''}
              onBack={() => setSelectedChatId(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-[var(--text-muted)]">
                <p className="text-lg mb-2">Select a chat to start messaging</p>
                <p className="text-sm">Choose a conversation from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <SettingsMenu onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}

