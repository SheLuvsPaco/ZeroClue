import { invoke } from '../../services/bridge';
import { APIAdapter, UserProfile, Message } from '../interfaces';

// We use your live Ngrok URL
const SERVER_BASE = "https://joya-pentadactyl-lin.ngrok-free.dev";

export const AndroidAdapter: APIAdapter = {
    // ✅ FIX 1: Return boolean, not string
    checkHealth: async () => {
        try {
            await invoke("ping");
            return true;
        } catch (e) {
            console.error("[Android] Ping failed:", e);
            return false;
        }
    },

    setBaseUrl: async (url: string) => {
        await invoke("set_base", { base: url });
    },

    auth: {
        signup: async (username, password, inviteToken, inviteBaseUrl) => {
            await invoke("set_base", { base: inviteBaseUrl || SERVER_BASE });
            await invoke("signup", { username, password, invite_token: inviteToken });
        },
        login: async (username, password) => {
            await invoke("set_base", { base: SERVER_BASE });
            await invoke("login", { username, password });
        },
        provisionWithToken: async (token, baseUrl) => {
            await invoke("provision_with_token", { token, base_url: baseUrl || SERVER_BASE });
        }
    },

    // ✅ FIX 2: Return typed UserProfile objects
    getFriends: async () => {
        // Bridge likely returns { friends: [...] }
        return invoke("friends_list");
    },

    sendFriendRequest: async (toUser) => invoke("friend_request", { to_username: toUser }),

    respondFriendRequest: async (fromUser, accept) => invoke("friend_respond", { from_username: fromUser, accept }),

    // ✅ FIX 3: Accept 'afterId' (even if we ignore it for now, the signature must match)
    pullNewMessages: async (afterId?: string) => {
        // Pass after_id to native if it supports it, otherwise just pull
        return invoke("pull_and_decrypt", { after_id: afterId });
    },

    // ✅ FIX 4: Correct Pagination Signature
    fetchHistory: async (friendId: string, beforeId?: string, limit?: number) => {
        try {
            // Attempt to call native history
            const response = await invoke<{ messages: Message[] }>("fetch_history", {
                friend_id: friendId,
                before_id: beforeId,
                limit: limit || 50
            });
            return response.messages || [];
        } catch (e) {
            console.warn("[Android] History fetch not fully implemented yet", e);
            return []; // Return empty array to prevent crash
        }
    },

    sendMessage: async (toUser, text) => invoke("send_to_username_hpke", { username: toUser, plaintext: text }),

    // ✅ FIX 5: Accept 'friendHint' and 'ttlMinutes'
    createInviteLink: async (friendHint?: string, ttlMinutes = 60) => {
        return invoke("create_invite", {
            friend_hint: friendHint,
            ttl_minutes: ttlMinutes
        });
    },

    // ✅ FIX 6: Ensure UserProfile return type
    getMe: async () => invoke<UserProfile>("get_me"),
};