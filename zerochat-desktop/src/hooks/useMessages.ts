/**
 * Hook to manage messages for a specific chat
 * Handles sending, receiving, pagination, and typing indicators
 */

import { useEffect, useCallback, useRef } from 'react';
import { useMessagesStore, Message } from '../state/messagesStore';
import { messagesApi } from '../services/api';
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
      const messages = await messagesApi.pull();
      
      // Process each message
      messages.forEach(msg => {
        // For now, assume messages are for the current chat
        // In a real implementation, you'd need to determine which chat each message belongs to
        // This might require additional API info or message metadata
        processIncomingMessage(msg, chatId, Date.now());
      });
    } catch (error) {
      console.error('Failed to poll messages:', error);
    }
  }, [chatId, processIncomingMessage]);

  // Set up WebSocket connection (if available)
  const setupWebSocket = useCallback(() => {
    // Try to connect via WebSocket
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
        // Fall back to polling
        if (enablePolling) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed, falling back to polling');
        // Fall back to polling
        if (enablePolling) {
          pollingRef.current = setInterval(pollMessages, pollingInterval);
        }
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket not available, using polling:', error);
      // Fall back to polling
      if (enablePolling) {
        pollingRef.current = setInterval(pollMessages, pollingInterval);
      }
    }
  }, [chatId, processIncomingMessage, enablePolling, pollingInterval, pollMessages]);

  // Set up polling/WebSocket
  useEffect(() => {
    // Try WebSocket first, fall back to polling
    setupWebSocket();
    
    // If WebSocket setup fails, polling will start automatically
    // Otherwise, start polling as backup
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
        await messagesApi.send(chatId, text);
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
              await messagesApi.send(queuedMsg.chatId, queuedMsg.text);
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
  }, [chatId, getMessages, dayGroups]);

  // Load older messages (pagination)
  const loadOlder = useCallback(async () => {
    const cursors = store.getState().paginationCursors;
    const loading = store.getState().isLoading;
    const cursor = cursors.get(chatId);
    
    if (loading.get(chatId) || !cursor) return;
    
    setIsLoading(chatId, true);
    try {
      const result = await messagesApi.getMessages(chatId, cursor);
      
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
  }, [chatId, store, setIsLoading, setPaginationCursor, addMessages]);

  // Set typing indicator
  const setTypingIndicator = useCallback((isTyping: boolean) => {
    setTyping(chatId, myUsername, isTyping);
  }, [chatId, myUsername, setTyping]);

  const currentTypingUsers = store.getState().typingUsers.get(chatId) || new Set();
  const currentIsLoading = store.getState().isLoading.get(chatId) || false;
  const currentCursors = store.getState().paginationCursors;
  
  return {
    messages: getMessages(chatId),
    dayGroups: getDayGroups(chatId),
    typingUsers: Array.from(currentTypingUsers),
    isLoading: currentIsLoading,
    sendMessage,
    loadOlder,
    setTypingIndicator,
    hasMore: currentCursors.has(chatId),
  };
}

