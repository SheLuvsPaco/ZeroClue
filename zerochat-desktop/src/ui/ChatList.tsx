/**
 * Chat list component - displays all conversations
 */

import React, { useEffect, useRef } from 'react';
import { useChatList } from '../hooks/useChatList';
import ChatListVirtualized from './ChatListVirtualized';

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onOpenSettings?: () => void;
}

export default function ChatList({ selectedChatId, onSelectChat, searchInputRef: externalSearchRef, onOpenSettings }: ChatListProps) {
  const {
    chats,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useChatList();
  
  const internalSearchRef = useRef<HTMLInputElement>(null);
  const searchInputRef = externalSearchRef || internalSearchRef;
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search (250ms for network requests)
  const handleSearchChange = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 250);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Separate pinned and unpinned chats
  const pinnedChats = chats.filter(chat => chat.pinned);
  const unpinnedChats = chats.filter(chat => !chat.pinned);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-elev)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-[var(--text)]">Chats</h2>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search bar */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search chats..."
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)] placeholder-[var(--text-muted)]"
        />
      </div>

      {/* Chat list */}
      <ChatListVirtualized
        chats={chats}
        pinnedChats={pinnedChats}
        unpinnedChats={unpinnedChats}
        selectedChatId={selectedChatId}
        onSelectChat={onSelectChat}
      />
    </div>
  );
}

