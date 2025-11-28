/**
 * Typing indicator component
 */

import React from 'react';

interface TypingProps {
  users: string[];
}

export default function Typing({ users }: TypingProps) {
  if (users.length === 0) return null;

  const text = users.length === 1
    ? `${users[0]} is typing...`
    : `${users.length} people are typing...`;

  return (
    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
}

