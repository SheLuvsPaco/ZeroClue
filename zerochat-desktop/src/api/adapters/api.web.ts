import { APIAdapter, UserProfile, Message } from '../interfaces';
import { SERVER_CONFIG } from '../../config';

const SERVER_BASE = SERVER_CONFIG.BASE_URL || "http://localhost:8080";
const WEB_STORAGE_KEY = 'zerochat_web_creds';

// Helper: Get Headers
const getHeaders = () => {
    const stored = localStorage.getItem(WEB_STORAGE_KEY);
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };
    if (stored) {
        try {
            const creds = JSON.parse(stored);
            if (creds.device_id && creds.device_auth) {
                headers['x-device-id'] = creds.device_id;
                headers['x-device-auth'] = creds.device_auth;
            }
        } catch { }
    }
    return headers;
};

// Helper: Get Base URL
const getBaseUrl = () => {
    try {
        const stored = localStorage.getItem(WEB_STORAGE_KEY);
        return stored ? JSON.parse(stored).base_url : SERVER_BASE;
    } catch {
        return SERVER_BASE;
    }
};

// ✅ MAKE SURE THIS SAYS 'WebAdapter', NOT 'DesktopAdapter'
export const WebAdapter: APIAdapter = {
    checkHealth: async () => {
        try { await fetch(`${getBaseUrl()}/api/ping`); return true; } catch { return false; }
    },

    setBaseUrl: async (url: string) => {
        const stored = localStorage.getItem(WEB_STORAGE_KEY);
        const creds = stored ? JSON.parse(stored) : {};
        creds.base_url = url;
        localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(creds));
    },

    auth: {
        signup: async (username, password, inviteToken, inviteBaseUrl) => {
            const baseUrl = inviteBaseUrl || SERVER_BASE;
            const res = await fetch(`${baseUrl}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ username, password, invite_token: inviteToken })
            });
            if (!res.ok) throw new Error(await res.text());
        },

        login: async (username, password) => {
            const res = await fetch(`${SERVER_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) throw new Error(await res.text());
        },

        provisionWithToken: async (token, baseUrl) => {
            const url = baseUrl || SERVER_BASE;
            const res = await fetch(`${url}/api/provision/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ token, platform: 'web' })
            });
            if (!res.ok) throw new Error(await res.text());

            const d = await res.json();
            localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify({
                device_id: d.device_id, device_auth: d.device_auth, base_url: url
            }));
        }
    },

    getMe: async () => {
        const stored = localStorage.getItem(WEB_STORAGE_KEY);
        if (!stored) return null;
        try {
            const res = await fetch(`${getBaseUrl()}/api/me`, { headers: getHeaders() });
            if (!res.ok) return null;
            return await res.json() as UserProfile;
        } catch { return null; }
    },

    getFriends: async () => {
        const res = await fetch(`${getBaseUrl()}/api/friends/list`, { headers: getHeaders() });
        if (!res.ok) return { friends: [] };
        return await res.json();
    },

    sendFriendRequest: async (toUser) => {
        await fetch(`${getBaseUrl()}/api/friends/request`, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify({ to_username: toUser })
        });
    },

    respondFriendRequest: async (fromUser, accept) => {
        await fetch(`${getBaseUrl()}/api/friends/respond`, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify({ from_username: fromUser, accept })
        });
    },

    pullNewMessages: async (afterId?: string) => [],

    fetchHistory: async (friendId: string, beforeId?: string, limit = 50) => {
        const baseUrl = getBaseUrl();
        const url = new URL(`${baseUrl}/api/messages/history`);
        url.searchParams.append('friend_id', friendId);
        url.searchParams.append('limit', limit.toString());
        if (beforeId) url.searchParams.append('before_id', beforeId);

        try {
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) return [];
            const data = await res.json();
            return data.messages || [];
        } catch { return []; }
    },

    sendMessage: async (toUser, text) => {
        // Web placeholder
        return { id: "temp", content: text, sender_id: "me", timestamp: Date.now() };
    },

    createInviteLink: async (friendHint?: string, ttlMinutes = 60) => {
        const res = await fetch(`${getBaseUrl()}/api/invite/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ friend_hint: friendHint, ttl_minutes: ttlMinutes })
        });
        return await res.json();
    }
};