/**
 * Individual chat row in the chat list
 */

import React from 'react';
import { Chat } from '../state/chatListStore';
import { formatChatListTime } from '../lib/time';

interface ChatRowProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export default function ChatRow({ chat, isSelected, onClick }: ChatRowProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const lastMessageText = chat.lastMessage?.text || 'No messages yet';
  const lastMessageTime = chat.lastMessage?.timestamp 
    ? formatChatListTime(chat.lastMessage.timestamp)
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-[var(--accent)] text-white' 
          : 'hover:bg-[var(--bg-hover)]'
        }
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
          ${isSelected ? 'bg-white/20' : 'bg-[var(--accent)]'}
        `}>
          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full" />
          ) : (
            <span className={isSelected ? 'text-white' : 'text-white'}>
              {getInitials(chat.name)}
            </span>
          )}
        </div>
        
        {/* Online indicator */}
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--success)] border-2 border-[var(--bg-elev)] rounded-full" />
        )}
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`
            font-semibold truncate
            ${isSelected ? 'text-white' : 'text-[var(--text)]'}
          `}>
            {chat.name}
          </h3>
          {chat.lastMessage && (
            <span className={`
              text-xs flex-shrink-0 ml-2
              ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}
            `}>
              {lastMessageTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <p className={`
            text-sm truncate flex-1
            ${isSelected ? 'text-white/90' : 'text-[var(--text-muted)]'}
          `}>
            {chat.lastMessage?.sender === chat.id ? '' : `${chat.lastMessage?.sender}: `}
            {lastMessageText}
          </p>
          
          {/* Unread badge */}
          {chat.unreadCount > 0 && (
            <span className={`
              flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold
              ${isSelected ? 'bg-white/20 text-white' : 'bg-[var(--accent)] text-white'}
            `}>
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          )}
          
          {/* Muted indicator */}
          {chat.muted && (
            <span className={`
              flex-shrink-0 text-lg
              ${isSelected ? 'text-white/60' : 'text-[var(--text-muted)]'}
            `}>
              🔇
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

