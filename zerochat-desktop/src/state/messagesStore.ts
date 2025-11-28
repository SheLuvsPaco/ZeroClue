import { create } from 'zustand';

export interface Message {
  id: string;
  chatId: string;
  sender: string;
  text: string;
  timestamp: number;
  isRead: boolean;
  isDelivered: boolean;
  isOffline?: boolean; // True if message is queued for sending
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name?: string;
    size?: number;
    thumbnail?: string;
  }[];
  linkPreview?: {
    url: string;
    title: string;
    description?: string;
    image?: string;
    favicon?: string;
  };
}

export interface DayGroup {
  date: string; // YYYY-MM-DD
  messages: Message[];
}

interface MessagesState {
  messages: Map<string, Message[]>; // chatId -> messages
  dayGroups: Map<string, DayGroup[]>; // chatId -> day groups
  typingUsers: Map<string, Set<string>>; // chatId -> set of usernames typing
  paginationCursors: Map<string, string | null>; // chatId -> cursor for loading older messages
  isLoading: Map<string, boolean>; // chatId -> loading state
  
  // Actions
  addMessage: (chatId: string, message: Message) => void;
  addMessages: (chatId: string, messages: Message[]) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
  setTyping: (chatId: string, username: string, isTyping: boolean) => void;
  setPaginationCursor: (chatId: string, cursor: string | null) => void;
  setIsLoading: (chatId: string, loading: boolean) => void;
  getMessages: (chatId: string) => Message[];
  getDayGroups: (chatId: string) => DayGroup[];
  clearChat: (chatId: string) => void;
}

const groupMessagesByDay = (messages: Message[]): DayGroup[] => {
  const groups = new Map<string, Message[]>();
  
  messages.forEach(msg => {
    const date = new Date(msg.timestamp);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(msg);
  });
  
  return Array.from(groups.entries())
    .map(([date, msgs]) => ({
      date,
      messages: msgs.sort((a, b) => a.timestamp - b.timestamp)
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: new Map(),
  dayGroups: new Map(),
  typingUsers: new Map(),
  paginationCursors: new Map(),
  isLoading: new Map(),
  
  addMessage: (chatId, message) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const updated = [...chatMessages, message].sort((a, b) => a.timestamp - b.timestamp);
    
    messages.set(chatId, updated);
    get().dayGroups.set(chatId, groupMessagesByDay(updated));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  addMessages: (chatId, newMessages) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const combined = [...chatMessages, ...newMessages];
    const unique = Array.from(
      new Map(combined.map(m => [m.id, m])).values()
    ).sort((a, b) => a.timestamp - b.timestamp);
    
    messages.set(chatId, unique);
    get().dayGroups.set(chatId, groupMessagesByDay(unique));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  updateMessage: (chatId, messageId, updates) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const updated = chatMessages.map(m =>
      m.id === messageId ? { ...m, ...updates } : m
    );
    
    messages.set(chatId, updated);
    get().dayGroups.set(chatId, groupMessagesByDay(updated));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  deleteMessage: (chatId, messageId) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const updated = chatMessages.filter(m => m.id !== messageId);
    
    messages.set(chatId, updated);
    get().dayGroups.set(chatId, groupMessagesByDay(updated));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  addReaction: (chatId, messageId, emoji, userId) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const updated = chatMessages.map(m => {
      if (m.id === messageId) {
        const reactions = m.reactions || [];
        const reactionIndex = reactions.findIndex(r => r.emoji === emoji);
        
        if (reactionIndex >= 0) {
          // Add user to existing reaction if not already there
          const reaction = reactions[reactionIndex];
          if (!reaction.users.includes(userId)) {
            reaction.users.push(userId);
          }
        } else {
          // Create new reaction
          reactions.push({ emoji, users: [userId] });
        }
        
        return { ...m, reactions: [...reactions] };
      }
      return m;
    });
    
    messages.set(chatId, updated);
    get().dayGroups.set(chatId, groupMessagesByDay(updated));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  removeReaction: (chatId, messageId, emoji, userId) => {
    const messages = get().messages;
    const chatMessages = messages.get(chatId) || [];
    const updated = chatMessages.map(m => {
      if (m.id === messageId && m.reactions) {
        const reactions = m.reactions.map(r => {
          if (r.emoji === emoji) {
            return { ...r, users: r.users.filter(u => u !== userId) };
          }
          return r;
        }).filter(r => r.users.length > 0);
        
        return { ...m, reactions: reactions.length > 0 ? reactions : undefined };
      }
      return m;
    });
    
    messages.set(chatId, updated);
    get().dayGroups.set(chatId, groupMessagesByDay(updated));
    
    set({ messages: new Map(messages), dayGroups: new Map(get().dayGroups) });
  },
  
  setTyping: (chatId, username, isTyping) => {
    const typingUsers = get().typingUsers;
    const users = typingUsers.get(chatId) || new Set();
    
    if (isTyping) {
      users.add(username);
    } else {
      users.delete(username);
    }
    
    if (users.size > 0) {
      typingUsers.set(chatId, users);
    } else {
      typingUsers.delete(chatId);
    }
    
    set({ typingUsers: new Map(typingUsers) });
  },
  
  setPaginationCursor: (chatId, cursor) => {
    const cursors = get().paginationCursors;
    if (cursor) {
      cursors.set(chatId, cursor);
    } else {
      cursors.delete(chatId);
    }
    set({ paginationCursors: new Map(cursors) });
  },
  
  setIsLoading: (chatId, loading) => {
    const isLoading = get().isLoading;
    if (loading) {
      isLoading.set(chatId, true);
    } else {
      isLoading.delete(chatId);
    }
    set({ isLoading: new Map(isLoading) });
  },
  
  getMessages: (chatId) => {
    return get().messages.get(chatId) || [];
  },
  
  getDayGroups: (chatId) => {
    return get().dayGroups.get(chatId) || [];
  },
  
  clearChat: (chatId) => {
    const messages = get().messages;
    messages.delete(chatId);
    get().dayGroups.delete(chatId);
    get().typingUsers.delete(chatId);
    get().paginationCursors.delete(chatId);
    get().isLoading.delete(chatId);
    
    set({
      messages: new Map(messages),
      dayGroups: new Map(get().dayGroups),
      typingUsers: new Map(get().typingUsers),
      paginationCursors: new Map(get().paginationCursors),
      isLoading: new Map(get().isLoading),
    });
  },
}));
