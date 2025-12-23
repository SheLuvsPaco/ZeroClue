import { platform } from '../services/bridge';
import { AndroidAdapter } from './adapters/api.android';
import { WebAdapter } from './adapters/api.web';
import { APIAdapter } from './interfaces';

// ✅ HELPER: Lazy Adapter Selector
// We call this every time a function is used, ensuring we catch the Bridge even if it loads late.
const getAdapter = (): APIAdapter => {
    if (platform.isAndroid) {
        // console.log('[API] Using Android Adapter'); // Uncomment for debug noise
        return AndroidAdapter;
    }

    // ✅ DEV FIX: Force WebAdapter on Desktop (Ngrok Bypass)
    if (platform.isTauri) {
        return WebAdapter;
    }

    return WebAdapter;
};

// =============================================================================
// ✅ EXPORTS (Wrapped in functions to ensure latest adapter is used)
// =============================================================================

export const checkHealth = async () => getAdapter().checkHealth();
export const setBaseUrl = async (url: string) => getAdapter().setBaseUrl(url);

// Auth
export const signUp = async (u: string, p: string, t?: string, b?: string) => getAdapter().auth.signup(u, p, t, b);
export const logIn = async (u: string, p: string) => getAdapter().auth.login(u, p);
export const provisionWithToken = async (t: string, b?: string) => getAdapter().auth.provisionWithToken(t, b);

// Friends
export const getFriends = async () => getAdapter().getFriends();
export const sendFriendRequest = async (id: string) => getAdapter().sendFriendRequest(id);
export const respondFriendRequest = async (id: string, accept: boolean) => getAdapter().respondFriendRequest(id, accept);

// Messaging
export const sendMessage = async (to: string, content: string) => getAdapter().sendMessage(to, content);
export const pullNewMessages = async (afterId?: string) => getAdapter().pullNewMessages(afterId);
export const fetchHistory = async (friendId: string, beforeId?: string, limit?: number) => getAdapter().fetchHistory(friendId, beforeId, limit);

// Misc
export const createInviteLink = async (hint?: string, ttl?: number) => getAdapter().createInviteLink(hint, ttl);
export const getMe = async () => getAdapter().getMe();

// Types
export type { UserProfile } from './interfaces';

// Default Export (Proxy to ensure 'api.auth.login' usage also works lazily)
const apiProxy = new Proxy({} as APIAdapter, {
    get: (_target, prop) => {
        const adapter = getAdapter();
        return (adapter as any)[prop];
    }
});

export default apiProxy;