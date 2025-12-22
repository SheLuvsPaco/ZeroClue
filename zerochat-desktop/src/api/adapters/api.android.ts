import { invoke } from '../../services/bridge';
import { APIAdapter } from '../interfaces';

// We use your live Ngrok URL
const SERVER_BASE = "https://joya-pentadactyl-lin.ngrok-free.dev";

export const AndroidAdapter: APIAdapter = {
    checkHealth: async () => {
        try { return await invoke<string>("ping"); }
        catch (e) { console.error("Ping failed:", e); return "error"; }
    },

    setBaseUrl: async (url: string) => {
        await invoke("set_base", { base: url });
    },

    auth: {
        signup: async (username, password, inviteToken, inviteBaseUrl) => {
            // ✅ ATOMIC: Kotlin handles provision -> wait 500ms -> upload keys
            await invoke("set_base", { base: inviteBaseUrl || SERVER_BASE });
            await invoke("signup", { username, password, invite_token: inviteToken });
        },
        login: async (username, password) => {
            // ✅ ATOMIC: Kotlin handles login -> provision -> wait -> upload keys
            await invoke("set_base", { base: SERVER_BASE });
            await invoke("login", { username, password });
        },
        provisionWithToken: async (token, baseUrl) => {
            // ✅ ATOMIC: Kotlin handles provision -> wait -> upload keys
            await invoke("provision_with_token", { token, base_url: baseUrl || SERVER_BASE });
        }
    },

    // Standard commands (Kotlin handles headers internally)
    getFriends: async () => invoke("friends_list"),
    sendFriendRequest: async (toUser) => invoke("friend_request", { to_username: toUser }),
    respondFriendRequest: async (fromUser, accept) => invoke("friend_respond", { from_username: fromUser, accept }),
    // Find the Message Operations section and replace it with this:

    // Message Operations
    pullNewMessages: async () => invoke("pull_and_decrypt"),

    fetchHistory: async (chatId, cursor) => {
        // Placeholder for native history fetch
        return { messages: [] };
    },

    sendMessage: async (toUser, text) => invoke("send_to_username_hpke", { username: toUser, plaintext: text }),
    createInviteLink: async (ttlMinutes = 60) => invoke("create_invite", { ttl_minutes: ttlMinutes }),
    getMe: async () => invoke("get_me"),
};