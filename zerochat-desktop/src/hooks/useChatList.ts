/**
 * Hook to manage chat list - syncs with friends API and updates store
 */

import { useEffect, useCallback } from 'react';
import { useChatListStore, Chat } from '../state/chatListStore';
import { friendsApi } from '../services/api';
import { formatChatListTime } from '../lib/time';
import { cacheChatList, getCachedChatList } from '../lib/cache';

export function useChatList() {
  const {
    chats,
    filteredChats,
    searchQuery,
    setChats,
    updateChat,
    setSearchQuery,
    markAsRead,
    updateLastMessage,
  } = useChatListStore();

  // Load chat list from friends API with cache hydration
  const loadChats = useCallback(async () => {
    // Hydrate from cache first
    try {
      const cached = await getCachedChatList();
      if (cached.length > 0) {
        setChats(cached);
      }
    } catch (error) {
      console.warn('Failed to load cached chats:', error);
    }
    
    // Then fetch from API and update
    try {
      const friends = await friendsApi.list();
      
      // Validate response - empty array is valid for new users
      if (!Array.isArray(friends)) {
        console.warn('[useChatList] friendsApi.list() returned invalid data (not an array):', friends);
        return;
      }
      
      console.log(`[useChatList] Loaded ${friends.length} friends from API`);
      
      // Filter to only accepted friendships
      const acceptedFriends = friends.filter(f => f && f.status === 'accepted');
      console.log(`[useChatList] ${acceptedFriends.length} accepted friendships`);
      
      // Transform friends to chats
      const newChats: Chat[] = acceptedFriends.map(friend => ({
        id: friend.username,
        name: friend.username,
        unreadCount: 0,
        pinned: false,
        muted: false,
      }));
      
      setChats(newChats);
      await cacheChatList(newChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
      // Keep cached data if API fails
    }
  }, [setChats]);

  // Initial load
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Refresh chat list
  const refresh = useCallback(() => {
    loadChats();
  }, [loadChats]);

  // Update last message for a chat
  const updateLastMessageForChat = useCallback((chatId: string, text: string, sender: string) => {
    updateLastMessage(chatId, {
      text,
      timestamp: Date.now(),
      sender,
    });
  }, [updateLastMessage]);

  return {
    chats: searchQuery ? filteredChats : chats,
    searchQuery,
    setSearchQuery,
    refresh,
    updateChat,
    markAsRead,
    updateLastMessage: updateLastMessageForChat,
  };
}

