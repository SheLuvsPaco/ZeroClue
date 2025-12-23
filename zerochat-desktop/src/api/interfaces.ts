// ✅ 1. Define Core Data Shapes
export interface UserProfile {
    user_id: string;      // Critical for React keys
    username: string;
    device_id: string;
    device_auth?: string; // Optional (only present in local storage, not usually API)
    is_friend?: boolean;  // useful for UI
}

export interface Message {
    id: string;
    content: string;
    sender_id: string;
    timestamp: number;
    conversation_id?: string;
}

// ✅ 2. Define Authentication Methods
export interface AuthAPI {
    /**
     * Signs up a new user.
     */
    signup(username: string, password: string, inviteToken?: string | null, inviteBaseUrl?: string | null): Promise<void>;

    /**
     * Logs in an existing user.
     */
    login(username: string, password: string): Promise<void>;

    /**
     * Provisions a device using a token.
     */
    provisionWithToken(token: string, baseUrl?: string): Promise<void>;
}

// ✅ 3. Define the Main Adapter Interface
export interface APIAdapter {
    // Nested Auth namespace
    auth: AuthAPI;

    // General Utilities
    checkHealth(): Promise<boolean>; // Changed to boolean for easier checks
    setBaseUrl(url: string): Promise<void>;

    // User Operations
    getMe(): Promise<UserProfile | null>;

    // Friend Operations
    getFriends(): Promise<{ friends: UserProfile[] }>;
    sendFriendRequest(toUser: string): Promise<void>;
    respondFriendRequest(fromUser: string, accept: boolean): Promise<void>;

    // Message Operations
    sendMessage(toUser: string, text: string): Promise<any>;

    // ✅ Updated to support Efficient Syncing
    pullNewMessages(afterId?: string): Promise<Message[]>;

    // ✅ Updated to support Pagination
    fetchHistory(friendId: string, beforeId?: string, limit?: number): Promise<Message[]>;

    // Invite Operations
    // ✅ Updated to support "Friend Hints"
    createInviteLink(friendHint?: string, ttlMinutes?: number): Promise<{ invite_token: string; invite_url: string }>;
}