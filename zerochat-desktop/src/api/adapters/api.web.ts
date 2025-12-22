import { APIAdapter } from '../interfaces';
import { SERVER_CONFIG } from '../../config';

const SERVER_BASE = SERVER_CONFIG.BASE_URL;

// Helper: Get Headers from LocalStorage
const getHeaders = () => {
    const stored = localStorage.getItem('zerochat_web_creds');
    if (!stored) throw new Error("Not authenticated");
    const creds = JSON.parse(stored);
    return {
        'Content-Type': 'application/json',
        'x-device-id': creds.device_id,
        'x-device-auth': creds.device_auth
    };
};

// Helper: Get Base URL (Stored or Default)
const getBaseUrl = () => {
    try {
        const stored = localStorage.getItem('zerochat_web_creds');
        return stored ? JSON.parse(stored).base_url : SERVER_BASE;
    } catch {
        return SERVER_BASE;
    }
};

export const WebAdapter: APIAdapter = {
    checkHealth: async () => "ok",

    setBaseUrl: async () => { /* Dynamic in web mode */ },

    auth: {
        signup: async (username, password, inviteToken, inviteBaseUrl) => {
            const baseUrl = inviteBaseUrl || SERVER_BASE;

            // 1. Signup
            const r1 = await fetch(`${baseUrl}/api/signup`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!r1.ok) throw new Error(await r1.text());
            const d1 = await r1.json();

            // 2. Provision
            const r2 = await fetch(`${baseUrl}/api/provision/redeem`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: inviteToken || d1.provision_token, platform: 'web' })
            });
            if (!r2.ok) throw new Error(await r2.text());
            const d2 = await r2.json();

            // 3. Save Creds
            localStorage.setItem('zerochat_web_creds', JSON.stringify({
                device_id: d2.device_id, device_auth: d2.device_auth, base_url: baseUrl
            }));
        },

        login: async (username, password) => {
            // 1. Login
            const r1 = await fetch(`${SERVER_BASE}/api/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!r1.ok) throw new Error(await r1.text());
            const d1 = await r1.json();

            // 2. Provision
            const r2 = await fetch(`${SERVER_BASE}/api/provision/redeem`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: d1.provision_token, platform: 'web' })
            });
            if (!r2.ok) throw new Error(await r2.text());
            const d2 = await r2.json();

            // 3. Save
            localStorage.setItem('zerochat_web_creds', JSON.stringify({
                device_id: d2.device_id, device_auth: d2.device_auth, base_url: SERVER_BASE
            }));
        },

        provisionWithToken: async (token, baseUrl) => {
            const url = baseUrl || SERVER_BASE;
            const r = await fetch(`${url}/api/provision/redeem`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, platform: 'web' })
            });
            if (!r.ok) throw new Error(await r.text());
            const d = await r.json();

            localStorage.setItem('zerochat_web_creds', JSON.stringify({
                device_id: d.device_id, device_auth: d.device_auth, base_url: url
            }));
        }
    },

    // Standard Fetch wrappers
    getFriends: async () => {
        const res = await fetch(`${getBaseUrl()}/api/friends/list`, { headers: getHeaders() });
        if (!res.ok) return [];
        const data = await res.json();
        return data.friends || []; // Robust handling if backend changes shape
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

    // Message Operations
    pullNewMessages: async () => [], // Web doesn't support HPKE pull yet

    fetchHistory: async (chatId, cursor) => {
        const baseUrl = getBaseUrl();
        const url = new URL(`${baseUrl}/api/messages`);
        url.searchParams.append('chatId', chatId);
        if (cursor) url.searchParams.append('cursor', cursor);

        try {
            const res = await fetch(url.toString(), { headers: getHeaders() });
            return await res.json();
        } catch {
            return { messages: [] };
        }
    },

    sendMessage: async () => "hpke_not_supported_web",
    createInviteLink: async (ttl) => {
        const res = await fetch(`${getBaseUrl()}/api/invite/create`, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify({ ttl_minutes: ttl })
        });
        return await res.json();
    },

    getMe: async () => {
        const res = await fetch(`${getBaseUrl()}/api/me`, { headers: getHeaders() });
        return await res.json();
    }
};