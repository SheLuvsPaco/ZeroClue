/**
 * Virtualized chat list for performance with 1k+ chats
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Chat } from '../state/chatListStore';
import ChatRow from './ChatRow';

interface ChatListVirtualizedProps {
  chats: Chat[];
  pinnedChats: Chat[];
  unpinnedChats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function ChatListVirtualized({
  chats,
  pinnedChats,
  unpinnedChats,
  selectedChatId,
  onSelectChat,
}: ChatListVirtualizedProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Create virtual items: pinned chats + divider + unpinned chats
  const virtualItems: Array<{ type: 'chat' | 'divider'; chat?: Chat }> = [];
  
  pinnedChats.forEach(chat => {
    virtualItems.push({ type: 'chat', chat });
  });
  
  if (pinnedChats.length > 0 && unpinnedChats.length > 0) {
    virtualItems.push({ type: 'divider' });
  }
  
  unpinnedChats.forEach(chat => {
    virtualItems.push({ type: 'chat', chat });
  });

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Chat row height
    overscan: 10, // Render 10 extra items off-screen
  });

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="p-8 text-center text-[var(--text-muted)]">
          <p>No chats yet</p>
          <p className="text-sm mt-2">Start a conversation to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = virtualItems[virtualItem.index];
          
          if (item.type === 'divider') {
            return (
              <div
                key={`divider-${virtualItem.index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="h-px bg-[var(--divider)] mx-4 my-2" />
              </div>
            );
          }
          
          if (!item.chat) return null;
          
          return (
            <div
              key={item.chat.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ChatRow
                chat={item.chat}
                isSelected={selectedChatId === item.chat.id}
                onClick={() => onSelectChat(item.chat!.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

