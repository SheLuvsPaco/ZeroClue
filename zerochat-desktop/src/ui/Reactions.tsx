/**
 * Reaction picker component - shows emoji options
 */

import React from 'react';
import { useMessagesStore } from '../state/messagesStore';
import { useAuth } from '../hooks/useAuth';

interface ReactionsProps {
  messageId: string;
  chatId: string;
  onClose: () => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function Reactions({ messageId, chatId, onClose }: ReactionsProps) {
  const { addReaction, removeReaction } = useMessagesStore();
  const { user } = useAuth();
  const myUsername = user?.username || 'current_user';

  const handleReaction = (emoji: string) => {
    // Check if user already reacted with this emoji
    const messages = useMessagesStore.getState().getMessages(chatId);
    const message = messages.find(m => m.id === messageId);
    
    if (message?.reactions) {
      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      if (existingReaction?.users.includes(myUsername)) {
        // Remove reaction
        removeReaction(chatId, messageId, emoji, myUsername);
      } else {
        // Add reaction
        addReaction(chatId, messageId, emoji, myUsername);
      }
    } else {
      // Add new reaction
      addReaction(chatId, messageId, emoji, myUsername);
    }
    
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg shadow-lg p-2 flex gap-1 z-10">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors text-lg"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

