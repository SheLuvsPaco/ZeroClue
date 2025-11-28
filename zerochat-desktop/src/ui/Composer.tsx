/**
 * Message composer - input area with send button and attachments
 */

import React, { useState, useRef, useEffect } from 'react';
import { pickFile } from '../lib/files';

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

  const handleAttach = async () => {
    try {
      const file = await pickFile({ multiple: false });
      // TODO: Handle file attachment
      console.log('File selected:', file);
    } catch (error) {
      console.error('Failed to pick file:', error);
    }
  };

  const charCount = text.length;
  const showCharCount = charCount > WARN_CHARS;
  const isOverLimit = charCount >= MAX_CHARS;

  return (
    <div className="p-4">
      <div className="flex items-end gap-2">
        {/* Attach button */}
        <button
          onClick={handleAttach}
          className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
          title="Attach file"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

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
        {text.trim() ? (
          <button
            onClick={handleSend}
            disabled={isSending || isOverLimit}
            className={`
              p-2 rounded-lg font-semibold transition-colors
              ${isSending || isOverLimit
                ? 'bg-[var(--text-muted)] text-[var(--text)] opacity-50 cursor-not-allowed'
                : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
              }
            `}
          >
            {isSending ? '...' : 'Send'}
          </button>
        ) : (
          <button
            onClick={handleAttach}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
            title="Attach file"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

