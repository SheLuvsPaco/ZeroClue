/**
 * Individual message bubble component
 */

import React, { useState } from 'react';
import { Message as MessageType } from '../state/messagesStore';
import { formatMessageTime } from '../lib/time';
import Reactions from './Reactions';
import AttachmentTile from './AttachmentTile';
import LinkPreview from './LinkPreview';

interface MessageProps {
  message: MessageType;
  isMe: boolean;
}

export default function Message({ message, isMe }: MessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowReactions(true);
    }, 500); // Long press threshold
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowReactions(true);
  };

  return (
    <div
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <div className={`
        max-w-[70%] rounded-2xl px-4 py-2 relative
        ${isMe 
          ? 'bg-[var(--bubble-me)] text-white rounded-br-sm' 
          : 'bg-[var(--bubble-other)] text-[var(--text)] rounded-bl-sm'
        }
      `}>
        {/* Reply quote */}
        {message.replyTo && (
          <div className={`
            mb-2 pl-3 border-l-2 ${isMe ? 'border-white/30' : 'border-[var(--accent)]'}
          `}>
            <div className="text-xs font-semibold opacity-80">
              {message.replyTo.sender}
            </div>
            <div className="text-xs opacity-70 truncate">
              {message.replyTo.text}
            </div>
          </div>
        )}

        {/* Link preview */}
        {message.linkPreview && (
          <LinkPreview preview={message.linkPreview} />
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((att, idx) => (
              <AttachmentTile key={idx} attachment={att} />
            ))}
          </div>
        )}

        {/* Message text */}
        <div className="whitespace-pre-wrap break-words">{message.text}</div>

        {/* Timestamp and read receipts */}
        <div className={`
          flex items-center gap-1 mt-1 text-xs
          ${isMe ? 'text-white/70' : 'text-[var(--text-muted)]'}
        `}>
          <span>{formatMessageTime(message.timestamp)}</span>
          {isMe && (
            <span className="ml-1">
              {message.isOffline ? (
                <span title="Sending...">🕐</span>
              ) : message.isRead ? (
                '✓✓'
              ) : message.isDelivered ? (
                '✓'
              ) : (
                '○'
              )}
            </span>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.reactions.map((reaction, idx) => (
              <div
                key={idx}
                className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${isMe ? 'bg-white/20' : 'bg-[var(--bg-elev)]'}
                `}
              >
                {reaction.emoji} {reaction.users.length > 1 && reaction.users.length}
              </div>
            ))}
          </div>
        )}

        {/* Reaction picker (shown on long press) */}
        {showReactions && (
          <Reactions
            messageId={message.id}
            chatId={message.chatId}
            onClose={() => setShowReactions(false)}
          />
        )}
      </div>
    </div>
  );
}

