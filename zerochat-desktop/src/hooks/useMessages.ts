/**
 * Hook to manage messages for a specific chat
 * Handles sending, receiving, pagination, typing indicators, and offline syncing.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useMessagesStore, Message as StoreMessage } from '../state/messagesStore';
// We alias the API function to avoid naming conflicts with the hook function
import { sendMessage as apiSendMessage, pullNewMessages, fetchHistory } from '../api';
import { cacheMessages, getCachedMessages } from '../lib/cache';
import { queueMessage, removeFromQueue, getMessagesToRetry, isOnline, onOnlineStatusChange } from '../lib/offline';

// Helper to check network status safely
const checkOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

interface UseMessagesOptions {
  chatId: string;
  myUsername: string;
  enablePolling?: boolean;
  pollingInterval?: number;
}

export function useMessages({ chatId, myUsername, enablePolling = true, pollingInterval = 3000 }: UseMessagesOptions) {
  const store = useMessagesStore();
  const {
    getMessages,
    getDayGroups,
    addMessage,
    addMessages,
    updateMessage,
    setTyping,
    typingUsers,
    paginationCursors,
    isLoading,
    setIsLoading,
    setPaginationCursor,
  } = store;

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ---------------------------------------------------------------------------
  // 1. INCOMING MESSAGE HANDLER
  // ---------------------------------------------------------------------------
  // We added 'serverId' as an optional 4th argument so we can use the real ID from the backend
  const processIncomingMessage = useCallback((plaintext: string, sender: string, timestamp: number, serverId?: string) => {
    const messageId = serverId || `msg-${Date.now()}-${Math.random()}`;

    const message: StoreMessage = {
      id: messageId,
      chatId,
      sender,
      text: plaintext,
      timestamp: timestamp || Date.now(),
      isRead: sender === myUsername,
      isDelivered: true, // If we received it, it's delivered
    };

    addMessage(chatId, message);

    // If I sent it or it's for this chat, mark as read/delivered in UI
    if (chatId === sender || chatId === myUsername) {
      setTimeout(() => {
        updateMessage(chatId, message.id, { isDelivered: true });
      }, 100);
    }
  }, [chatId, myUsername, addMessage, updateMessage]);

  // ---------------------------------------------------------------------------
  // 2. POLLING STRATEGY (Hybrid: API + WebSocket)
  // ---------------------------------------------------------------------------
  const pollMessages = useCallback(async () => {
    try {
      // ✅ FIXED: The API now returns 'Message[]', so we map it correctly
      const messages = await pullNewMessages();

      messages.forEach(msg => {
        // We unpack the API object into our internal processor
        // msg.content -> text
        // msg.sender_id -> sender
        processIncomingMessage(msg.content, msg.sender_id, msg.timestamp, msg.id);
      });
    } catch (error) {
      console.error('[useMessages] Poll failed:', error);
    }
  }, [chatId, processIncomingMessage]);

  const setupWebSocket = useCallback(() => {
    // Only use WS for local dev or if explicitly supported
    const wsUrl = `ws://127.0.0.1:8080/ws`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => console.log('[WS] Connected');

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.chatId === chatId) {
            processIncomingMessage(data.text, data.sender, data.timestamp);
          }
        } catch (error) {
          console.error('[WS] Parse error:', error);
        }
      };

      ws.onerror = () => {
        // Fallback to polling on error
        if (enablePolling && !pollingRef.current) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };

      ws.onclose = () => {
        if (enablePolling && !pollingRef.current) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      if (enablePolling && !pollingRef.current) {
        pollingRef.current = setInterval(pollMessages, pollingInterval);
      }
    }
  }, [chatId, processIncomingMessage, enablePolling, pollingInterval, pollMessages]);

  // Lifecycle: Start/Stop Polling & WS
  useEffect(() => {
    setupWebSocket();

    if (enablePolling && !wsRef.current && !pollingRef.current) {
      pollingRef.current = setInterval(pollMessages, pollingInterval);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [chatId, setupWebSocket, enablePolling, pollingInterval, pollMessages]);

  // ---------------------------------------------------------------------------
  // 3. SENDING MESSAGES (Offline First)
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const tempId = `msg-${Date.now()}-${Math.random()}`;
    const timestamp = Date.now();

    // 1. Optimistic Update (Show immediately)
    const message: StoreMessage = {
      id: tempId,
      chatId,
      sender: myUsername,
      text: text.trim(),
      timestamp,
      isRead: false,
      isDelivered: false,
      isOffline: !checkOnline(),
    };

    addMessage(chatId, message);

    // 2. Network Request
    if (checkOnline()) {
      try {
        await apiSendMessage(chatId, text);
        updateMessage(chatId, tempId, { isDelivered: true, isOffline: false });
      } catch (error) {
        console.error('Send failed, queuing:', error);
        queueMessage({ id: tempId, chatId, text: text.trim(), timestamp, retries: 0 });
        updateMessage(chatId, tempId, { isOffline: true });
      }
    } else {
      // 3. Offline Queue
      queueMessage({ id: tempId, chatId, text: text.trim(), timestamp, retries: 0 });
      updateMessage(chatId, tempId, { isOffline: true });
    }
  }, [chatId, myUsername, addMessage, updateMessage]);

  // Retry Offline Messages when Online
  useEffect(() => {
    const unsubscribe = onOnlineStatusChange(async (online) => {
      if (online) {
        const queued = getMessagesToRetry();
        for (const q of queued) {
          if (q.chatId === chatId) {
            try {
              await apiSendMessage(q.chatId, q.text);
              removeFromQueue(q.id);
              updateMessage(chatId, q.id, { isDelivered: true, isOffline: false });
            } catch (e) { console.error('Retry failed', e); }
          }
        }
      }
    });
    return unsubscribe;
  }, [chatId, updateMessage]);

  // ---------------------------------------------------------------------------
  // 4. DATA HYDRATION & PAGINATION
  // ---------------------------------------------------------------------------

  // Hydrate from local cache on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const cached = await getCachedMessages(chatId);
        if (cached.length > 0) addMessages(chatId, cached);
      } catch (e) { console.warn('Cache hydrate failed', e); }
    };
    hydrate();
  }, [chatId, addMessages]);

  // Save new messages to cache
  useEffect(() => {
    const msgs = getMessages(chatId);
    if (msgs.length > 0) cacheMessages(chatId, msgs).catch(() => { });
  }, [chatId, getMessages]);

  // Load Older Messages (Pagination)
  const loadOlder = useCallback(async () => {
    // ✅ FIXED: Type Sanitization
    // The store might return 'null', but the API expects 'string | undefined'.
    const rawCursor = paginationCursors.get(chatId);
    const cursor = rawCursor || undefined; // Converts null/"" to undefined

    // Prevent duplicate loads
    if (isLoading.get(chatId)) return;

    setIsLoading(chatId, true);
    try {
      // ✅ FIXED: Use new API contract
      const apiMessages = await fetchHistory(chatId, cursor);

      if (apiMessages && apiMessages.length > 0) {
        // Map API format to Store format
        const messages: StoreMessage[] = apiMessages.map(msg => ({
          id: msg.id,
          chatId,
          sender: msg.sender_id,
          text: msg.content,
          timestamp: msg.timestamp,
          isRead: true,
          isDelivered: true,
        }));

        addMessages(chatId, messages);

        // Update cursor to the ID of the oldest message received
        // (Assuming server returns newest -> oldest, taking the last one is correct)
        const lastMsg = apiMessages[apiMessages.length - 1];
        setPaginationCursor(chatId, lastMsg.id);
      } else {
        // No more messages
        setPaginationCursor(chatId, null);
      }
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      setIsLoading(chatId, false);
    }
  }, [chatId, paginationCursors, isLoading, setIsLoading, setPaginationCursor, addMessages]);

  const setTypingIndicator = useCallback((isTyping: boolean) => {
    setTyping(chatId, myUsername, isTyping);
  }, [chatId, myUsername, setTyping]);

  return {
    messages: getMessages(chatId),
    dayGroups: getDayGroups(chatId),
    typingUsers: Array.from(typingUsers.get(chatId) || new Set()),
    isLoading: isLoading.get(chatId) || false,
    sendMessage,
    loadOlder,
    setTypingIndicator,
    hasMore: paginationCursors.has(chatId) && paginationCursors.get(chatId) !== null,
  };
}