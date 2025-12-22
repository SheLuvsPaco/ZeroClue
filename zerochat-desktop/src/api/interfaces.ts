// Define what a User looks like across all platforms
export interface UserProfile {
    username: string;
    device_id: string;
}

// Define the Authentication methods specifically
export interface AuthAPI {
    /**
     * Signs up a new user.
     * @param inviteBaseUrl - Optional base URL from an invite link
     */
    signup(username: string, password: string, inviteToken?: string | null, inviteBaseUrl?: string | null): Promise<void>;

    /**
     * Logs in an existing user.
     */
    login(username: string, password: string): Promise<void>;

    /**
     * Provisions a device using a token (e.g. from an Invite Link).
     */
    provisionWithToken(token: string, baseUrl?: string): Promise<void>;
}

// Define the Main Adapter Interface
// Every platform file (android.ts, desktop.ts, web.ts) MUST export an object matching this type.
export interface APIAdapter {
    // Nested Auth namespace
    auth: AuthAPI;

    // General Utilities
    checkHealth(): Promise<string>;
    setBaseUrl(url: string): Promise<void>;

    // Friend Operations
    getFriends(): Promise<Array<{ username: string; status: string }>>;
    sendFriendRequest(toUser: string): Promise<void>;
    respondFriendRequest(fromUser: string, accept: boolean): Promise<void>;

    // Message Operations
    // ... (Keep existing Friend Operations above) ...

    // Message Operations
    pullNewMessages(): Promise<string[]>;
    fetchHistory(chatId: string, cursor?: string): Promise<{ messages: any[]; nextCursor?: string }>;
    sendMessage(toUser: string, text: string): Promise<string>;

    // ... (Keep Invite & User Operations below) ...
    sendMessage(toUser: string, text: string): Promise<string>;

    // Invite & User Operations
    createInviteLink(ttlMinutes?: number): Promise<{ invite_link: string }>;
    getMe(): Promise<UserProfile>;
}