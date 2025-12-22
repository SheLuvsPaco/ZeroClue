/**
 * Hook to manage messages for a specific chat
 * Handles sending, receiving, pagination, and typing indicators
 */

import { useEffect, useCallback, useRef } from 'react';
import { useMessagesStore, Message } from '../state/messagesStore';
// ✅ FIXED: Import new API functions (aliased sendMessage to avoid name conflict)
import { sendMessage as apiSendMessage, pullNewMessages, fetchHistory } from '../api';
import { cacheMessages, getCachedMessages } from '../lib/cache';
import { queueMessage, removeFromQueue, getMessagesToRetry, isOnline, onOnlineStatusChange } from '../lib/offline';

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

  // Decrypt and add message from API response
  const processIncomingMessage = useCallback((plaintext: string, sender: string, timestamp: number) => {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId,
      sender,
      text: plaintext,
      timestamp: timestamp || Date.now(),
      isRead: sender === myUsername, // Our own messages are "read"
      isDelivered: false,
    };

    addMessage(chatId, message);

    // Mark as read if it's for this chat
    if (chatId === sender || chatId === myUsername) {
      // Update read status when we receive it
      setTimeout(() => {
        updateMessage(chatId, message.id, { isDelivered: true });
      }, 100);
    }
  }, [chatId, myUsername, addMessage, updateMessage]);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    try {
      // ✅ FIXED: Use new API function
      const messages = await pullNewMessages();

      // Process each message
      messages.forEach(msg => {
        // For now, assume messages are for the current chat
        processIncomingMessage(msg, chatId, Date.now());
      });
    } catch (error) {
      console.error('Failed to poll messages:', error);
    }
  }, [chatId, processIncomingMessage]);

  // Set up WebSocket connection (if available)
  const setupWebSocket = useCallback(() => {
    const wsUrl = `ws://127.0.0.1:8080/ws`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.chatId === chatId) {
            processIncomingMessage(data.text, data.sender, data.timestamp);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (enablePolling) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket closed, falling back to polling');
        if (enablePolling) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket not available, using polling:', error);
      if (enablePolling) {
        pollingRef.current = setInterval(pollMessages, pollingInterval);
      }
    }
  }, [chatId, processIncomingMessage, enablePolling, pollingInterval, pollMessages]);

  // Set up polling/WebSocket
  useEffect(() => {
    setupWebSocket();

    if (enablePolling && !wsRef.current) {
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

  // Send message with offline handling
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const messageId = `msg-${Date.now()}-${Math.random()}`;
    const timestamp = Date.now();

    // Add message optimistically
    const message: Message = {
      id: messageId,
      chatId,
      sender: myUsername,
      text: text.trim(),
      timestamp,
      isRead: false,
      isDelivered: false,
      isOffline: !isOnline(), // Mark as offline if not connected
    };

    addMessage(chatId, message);

    // Try to send
    if (isOnline()) {
      try {
        // ✅ FIXED: Use aliased API function
        await apiSendMessage(chatId, text);
        updateMessage(chatId, messageId, { isDelivered: true, isOffline: false });
      } catch (error) {
        console.error('Failed to send message:', error);
        // Queue for retry
        queueMessage({
          id: messageId,
          chatId,
          text: text.trim(),
          timestamp,
          retries: 0,
        });
        updateMessage(chatId, messageId, { isOffline: true });
      }
    } else {
      // Queue for later
      queueMessage({
        id: messageId,
        chatId,
        text: text.trim(),
        timestamp,
        retries: 0,
      });
      updateMessage(chatId, messageId, { isOffline: true });
    }
  }, [chatId, myUsername, addMessage, updateMessage]);

  // Retry queued messages on reconnect
  useEffect(() => {
    const unsubscribe = onOnlineStatusChange(async (online) => {
      if (online) {
        const queued = getMessagesToRetry();
        for (const queuedMsg of queued) {
          if (queuedMsg.chatId === chatId) {
            try {
              // ✅ FIXED: Use aliased API function
              await apiSendMessage(queuedMsg.chatId, queuedMsg.text);
              removeFromQueue(queuedMsg.id);
              updateMessage(chatId, queuedMsg.id, { isDelivered: true, isOffline: false });
            } catch (error) {
              console.error('Failed to retry message:', error);
            }
          }
        }
      }
    });

    return unsubscribe;
  }, [chatId, updateMessage]);

  // Hydrate from cache on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const cached = await getCachedMessages(chatId);
        if (cached.length > 0) {
          addMessages(chatId, cached);
        }
      } catch (error) {
        console.warn('Failed to hydrate messages from cache:', error);
      }
    };

    hydrate();
  }, [chatId, addMessages]);

  // Cache messages when they change
  useEffect(() => {
    const messages = getMessages(chatId);
    if (messages.length > 0) {
      cacheMessages(chatId, messages).catch(err => {
        console.warn('Failed to cache messages:', err);
      });
    }
    // ✅ FIXED: Removed 'dayGroups' from dependency array to fix undefined error
  }, [chatId, getMessages]);

  // Load older messages (pagination)
  const loadOlder = useCallback(async () => {
    // ✅ FIXED: Removed .getState(), used destructured variables
    const cursor = paginationCursors.get(chatId);
    const loading = isLoading.get(chatId);

    if (loading || !cursor) return;

    setIsLoading(chatId, true);
    try {
      // ✅ FIXED: Use new fetchHistory API
      const result = await fetchHistory(chatId, cursor);

      // Transform API messages to our format
      const messages: Message[] = result.messages.map((msg, idx) => ({
        id: msg.id || `msg-${msg.created_at}-${idx}`,
        chatId,
        sender: msg.from_username || 'unknown',
        text: msg.ciphertext_b64, // Would need decryption in real implementation
        timestamp: new Date(msg.created_at).getTime(),
        isRead: true,
        isDelivered: true,
      }));

      addMessages(chatId, messages);

      if (result.nextCursor) {
        setPaginationCursor(chatId, result.nextCursor);
      } else {
        setPaginationCursor(chatId, null);
      }
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      setIsLoading(chatId, false);
    }
  }, [chatId, paginationCursors, isLoading, setIsLoading, setPaginationCursor, addMessages]);

  // Set typing indicator
  const setTypingIndicator = useCallback((isTyping: boolean) => {
    setTyping(chatId, myUsername, isTyping);
  }, [chatId, myUsername, setTyping]);

  // ✅ FIXED: Use destructured variables directly for return
  const currentTypingUsers = typingUsers.get(chatId) || new Set();
  const currentIsLoading = isLoading.get(chatId) || false;

  return {
    messages: getMessages(chatId),
    dayGroups: getDayGroups(chatId),
    typingUsers: Array.from(currentTypingUsers),
    isLoading: currentIsLoading,
    sendMessage,
    loadOlder,
    setTypingIndicator,
    hasMore: paginationCursors.has(chatId),
  };
}