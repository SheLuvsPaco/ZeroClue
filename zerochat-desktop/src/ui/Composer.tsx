/**
 * Message composer - input area with send button
 */

import React, { useState, useRef } from 'react';

interface ComposerProps {
  onSend: (text: string) => Promise<void>;
}

const MAX_CHARS = 4000;
const WARN_CHARS = 2000;

export default function Composer({ onSend }: ComposerProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await onSend(trimmed);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setText(value);
      // Auto-resize textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    }
  };

  const charCount = text.length;
  const showCharCount = charCount > WARN_CHARS;
  const isOverLimit = charCount >= MAX_CHARS;

  return (
    <div className="p-4">
      <div className="flex items-end gap-2">
        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className={`
              w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              resize-none overflow-y-auto
              text-[var(--text)] placeholder-[var(--text-muted)]
              max-h-[200px]
            `}
            style={{ minHeight: '44px' }}
          />

          {/* Character counter */}
          {showCharCount && (
            <div className={`
              absolute bottom-2 right-2 text-xs
              ${isOverLimit ? 'text-[var(--error)]' : 'text-[var(--text-muted)]'}
            `}>
              {charCount} / {MAX_CHARS}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isSending || isOverLimit || !text.trim()}
          className={`
            p-2 rounded-lg font-semibold transition-colors
            ${isSending || isOverLimit || !text.trim()
              ? 'bg-[var(--text-muted)] text-[var(--text)] opacity-50 cursor-not-allowed'
              : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
            }
          `}
        >
          {isSending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

