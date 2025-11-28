import { create } from 'zustand';

export interface Chat {
  id: string; // username or chat ID
  name: string;
  avatar?: string;
  lastMessage?: {
    text: string;
    timestamp: number;
    sender: string;
  };
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  isOnline?: boolean;
  lastSeen?: number;
}

interface ChatListState {
  chats: Chat[];
  searchQuery: string;
  filteredChats: Chat[];
  
  // Actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  removeChat: (id: string) => void;
  setSearchQuery: (query: string) => void;
  togglePin: (id: string) => void;
  toggleMute: (id: string) => void;
  markAsRead: (id: string) => void;
  updateLastMessage: (id: string, message: Chat['lastMessage']) => void;
  setOnlineStatus: (id: string, isOnline: boolean, lastSeen?: number) => void;
}

export const useChatListStore = create<ChatListState>((set, get) => ({
  chats: [],
  searchQuery: '',
  filteredChats: [],
  
  setChats: (chats) => {
    const sorted = [...chats].sort((a, b) => {
      // Pinned first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      // Then by last message timestamp
      const aTime = a.lastMessage?.timestamp || 0;
      const bTime = b.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });
    set({ chats: sorted });
    get().setSearchQuery(get().searchQuery); // Re-filter
  },
  
  addChat: (chat) => {
    const chats = [...get().chats, chat];
    get().setChats(chats);
  },
  
  updateChat: (id, updates) => {
    const chats = get().chats.map(chat =>
      chat.id === id ? { ...chat, ...updates } : chat
    );
    get().setChats(chats);
  },
  
  removeChat: (id) => {
    const chats = get().chats.filter(chat => chat.id !== id);
    get().setChats(chats);
  },
  
  setSearchQuery: (query) => {
    const { chats } = get();
    const lowerQuery = query.toLowerCase();
    
    const filtered = chats.filter(chat => {
      if (!query) return true;
      const nameMatch = chat.name.toLowerCase().includes(lowerQuery);
      const messageMatch = chat.lastMessage?.text.toLowerCase().includes(lowerQuery);
      return nameMatch || messageMatch;
    });
    
    set({ searchQuery: query, filteredChats: filtered });
  },
  
  togglePin: (id) => {
    const chat = get().chats.find(c => c.id === id);
    if (chat) {
      get().updateChat(id, { pinned: !chat.pinned });
    }
  },
  
  toggleMute: (id) => {
    const chat = get().chats.find(c => c.id === id);
    if (chat) {
      get().updateChat(id, { muted: !chat.muted });
    }
  },
  
  markAsRead: (id) => {
    get().updateChat(id, { unreadCount: 0 });
  },
  
  updateLastMessage: (id, message) => {
    get().updateChat(id, { lastMessage: message });
  },
  
  setOnlineStatus: (id, isOnline, lastSeen) => {
    get().updateChat(id, { isOnline, lastSeen });
  },
}));
