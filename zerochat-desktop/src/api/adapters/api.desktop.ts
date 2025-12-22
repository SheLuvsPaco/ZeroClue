import { invoke } from '../../services/bridge';
import { APIAdapter } from '../interfaces';
import { SERVER_CONFIG } from '../../config';

const SERVER_BASE = SERVER_CONFIG.BASE_URL;

export const DesktopAdapter: APIAdapter = {
    checkHealth: async () => invoke("ping").catch(() => "error"),

    setBaseUrl: async (url) => {
        await invoke("set_base", { base: url });
    },

    auth: {
        signup: async (username, password, inviteToken, inviteBaseUrl) => {
            // 1. Create Account
            await invoke("set_base", { base: inviteBaseUrl || SERVER_BASE });
            await invoke("signup", { username, password, invite_token: inviteToken });

            // 2. EXPLICITLY Upload Keys (The Fix for Desktop)
            console.log('[Desktop] Uploading keys...');
            await new Promise(r => setTimeout(r, 500)); // Safety delay for DB consistency
            await invoke("upload_identity_and_keypackage");
        },

        login: async (username, password) => {
            // 1. Log In
            await invoke("set_base", { base: SERVER_BASE });
            await invoke("login", { username, password });

            // 2. EXPLICITLY Upload Keys
            console.log('[Desktop] Uploading keys...');
            await new Promise(r => setTimeout(r, 500));
            await invoke("upload_identity_and_keypackage");
        },

        provisionWithToken: async (token, baseUrl) => {
            // 1. Provision
            await invoke("provision_with_token", { token, base_url: baseUrl || SERVER_BASE });

            // 2. EXPLICITLY Upload Keys (Fixes Invite Links on Desktop)
            console.log('[Desktop] Uploading keys...');
            await new Promise(r => setTimeout(r, 500));
            await invoke("upload_identity_and_keypackage");
        }
    },

    // Standard commands
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