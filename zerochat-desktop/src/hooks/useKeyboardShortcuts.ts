/**
 * Keyboard shortcuts hook
 * Cmd/Ctrl+K: Search, Cmd/Ctrl+F: In-chat search, Esc: Back
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSearch?: () => void;
  onInChatSearch?: () => void;
  onBack?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSearch,
  onInChatSearch,
  onBack,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl+K: Global search
      if (modifier && e.key === 'k' && onSearch) {
        e.preventDefault();
        onSearch();
        return;
      }

      // Cmd/Ctrl+F: In-chat search (only if not in input/textarea)
      if (modifier && e.key === 'f' && onInChatSearch) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onInChatSearch();
        }
        return;
      }

      // Esc: Back
      if (e.key === 'Escape' && onBack) {
        e.preventDefault();
        onBack();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onSearch, onInChatSearch, onBack]);
}

