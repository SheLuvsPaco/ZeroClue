/**
 * Main chat view - displays messages and composer
 */

import React, { useEffect, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';
import Message from './Message';
import Composer from './Composer';
import Typing from './Typing';
import { formatDayHeader } from '../lib/time';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ChatViewProps {
  chatId: string;
  myUsername: string;
  onBack?: () => void;
}

export default function ChatView({ chatId, myUsername, onBack }: ChatViewProps) {
  const {
    dayGroups,
    typingUsers,
    sendMessage,
    loadOlder,
    hasMore,
    isLoading,
  } = useMessages({ chatId, myUsername });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dayGroups]);

  // Virtualization setup - flatten messages with day headers
  // We explicitly type the virtual items array for safety
  const virtualItems: Array<{ type: 'day' | 'message'; date?: string; message?: any }> = [];

  dayGroups.forEach(group => {
    virtualItems.push({ type: 'day', date: group.date });
    group.messages.forEach(msg => {
      virtualItems.push({ type: 'message', message: msg });
    });
  });

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualItems[index];
      return item.type === 'day' ? 40 : 60; // Day header is smaller
    },
    overscan: 25, // Keep ~50 DOM nodes (25 above + 25 below viewport)
  });

  const handleSend = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elev)] flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          >
            ←
          </button>
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-[var(--text)]">{chatId}</h2>
          {/* ✅ FIXED: Explicitly cast typingUsers to string[] to satisfy the strict Typing component */}
          {typingUsers.length > 0 && (
            <Typing users={typingUsers as string[]} />
          )}
        </div>
      </div>

      {/* Messages area - virtualized */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
            padding: '1rem',
          }}
        >
          {/* Load older button */}
          {hasMore && (
            <div className="text-center mb-4">
              <button
                onClick={loadOlder}
                disabled={isLoading}
                className="px-4 py-2 bg-[var(--bg-elev)] text-[var(--text-muted)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load older messages'}
              </button>
            </div>
          )}

          {/* Virtualized messages */}
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = virtualItems[virtualItem.index];

            if (item.type === 'day' && item.date) {
              return (
                <div
                  key={`day-${item.date}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="flex items-center justify-center"
                >
                  <span className="px-3 py-1 bg-[var(--bg-elev)] text-[var(--text-muted)] text-xs rounded-full">
                    {formatDayHeader(item.date)}
                  </span>
                </div>
              );
            }

            if (item.type === 'message' && item.message) {
              return (
                <div
                  key={item.message.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <Message
                    message={item.message}
                    isMe={item.message.sender === myUsername}
                  />
                </div>
              );
            }

            return null;
          })}

          {/* Scroll anchor for auto-scroll */}
          <div
            ref={messagesEndRef}
            style={{
              position: 'absolute',
              bottom: 0,
              height: '1px',
            }}
          />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-[var(--border)] bg-[var(--bg-elev)]">
        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}