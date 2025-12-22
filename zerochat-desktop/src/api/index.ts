import { platform } from '../services/bridge';
import { AndroidAdapter } from './adapters/api.android';
import { DesktopAdapter } from './adapters/api.desktop';
import { WebAdapter } from './adapters/api.web';
import { APIAdapter } from './interfaces';

// Factory to select the right adapter based on the platform
const getAdapter = (): APIAdapter => {
    if (platform.isAndroid) {
        console.log('[API] Using Android Adapter (Atomic)');
        return AndroidAdapter;
    }
    if (platform.isTauri) {
        console.log('[API] Using Desktop Adapter (Explicit)');
        return DesktopAdapter;
    }
    console.log('[API] Using Web Adapter (Fetch)');
    return WebAdapter;
};

// Initialize the API
const api = getAdapter();

// Export individual functions so your React components don't need to change much
export const checkHealth = api.checkHealth;
export const setBaseUrl = api.setBaseUrl;
export const signUp = api.auth.signup;
export const logIn = api.auth.login;
export const provisionWithToken = api.auth.provisionWithToken;
export const getFriends = api.getFriends;
export const sendFriendRequest = api.sendFriendRequest;
export const respondFriendRequest = api.respondFriendRequest;
export const sendMessage = api.sendMessage;
export const createInviteLink = api.createInviteLink;
export const getMe = api.getMe;
export type { UserProfile } from './interfaces';
// ✅ Message Exports
export const pullNewMessages = api.pullNewMessages;
export const fetchHistory = api.fetchHistory;

// Export the full object as default
export default api;