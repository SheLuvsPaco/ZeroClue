import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

// State
let currentTab = "chats";
let pullInterval: number | null = null;
let myUsername = "";
let myDeviceId = "";

// Elements
const onboarding = document.getElementById("onboarding")!;
const app = document.getElementById("app")!;
const onboardUsername = document.getElementById("onboardUsername") as HTMLInputElement;
const onboardPassword = document.getElementById("onboardPassword") as HTMLInputElement;
const onboardSignup = document.getElementById("onboardSignup")!;
const onboardLogin = document.getElementById("onboardLogin")!;

// Tab elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Chats tab
const messagesList = document.getElementById("messagesList")!;
const chatFriend = document.getElementById("chatFriend") as HTMLSelectElement;
const chatMessage = document.getElementById("chatMessage") as HTMLInputElement;
const chatSend = document.getElementById("chatSend")!;

// Contacts tab
const addFriendInput = document.getElementById("addFriendInput") as HTMLInputElement;
const addFriendBtn = document.getElementById("addFriendBtn")!;
const pendingList = document.getElementById("pendingList")!;
const friendsListContent = document.getElementById("friendsListContent")!;

// Profile tab
const profileUsername = document.getElementById("profileUsername")!;
const profileDeviceId = document.getElementById("profileDeviceId")!;
const copyInviteLink = document.getElementById("copyInviteLink")!;
const inviteLinkDisplay = document.getElementById("inviteLinkDisplay")!;
const inviteLinkText = document.getElementById("inviteLinkText")!;

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab")!;
    switchTab(tab);
  });
});

function switchTab(tab: string) {
  currentTab = tab;
  tabButtons.forEach(b => {
    if (b.getAttribute("data-tab") === tab) {
      b.classList.add("border-blue-600", "text-blue-600");
      b.classList.remove("border-transparent", "text-gray-600");
    } else {
      b.classList.remove("border-blue-600", "text-blue-600");
      b.classList.add("border-transparent", "text-gray-600");
    }
  });
  tabContents.forEach(c => {
    if (c.id === `${tab}-tab`) {
      c.classList.remove("hidden");
    } else {
      c.classList.add("hidden");
    }
  });
  if (tab === "contacts") refreshContacts();
  if (tab === "profile") refreshProfile();
}

// Hardcoded server base URL
const SERVER_BASE = "http://127.0.0.1:8080";

// Onboarding
async function checkOnboarding() {
  try {
    // Set base URL first
    await invoke<string>("set_base", { base: SERVER_BASE });
    
    // Try to load credentials
    const creds = await invoke<{device_id: string, device_auth: string}>("load_creds").catch(() => null);
    
    if (!creds) {
      onboarding.classList.remove("hidden");
      app.classList.add("hidden");
      return;
    }
    
    // Load profile
    const me = await invoke<{username: string, device_id: string}>("get_me");
    myUsername = me.username;
    myDeviceId = me.device_id;
    
    onboarding.classList.add("hidden");
    app.classList.remove("hidden");
    
    // Start pull loop
    startPullLoop();
    refreshContacts();
    refreshProfile();
  } catch (e) {
    console.error("Onboarding check failed:", e);
    onboarding.classList.remove("hidden");
    app.classList.add("hidden");
  }
}

async function completeAuth() {
  // Upload identity and keypackage
  await invoke<string>("upload_identity_and_keypackage");
  
  // Load profile
  const me = await invoke<{username: string, device_id: string}>("get_me");
  myUsername = me.username;
  myDeviceId = me.device_id;
  
  onboarding.classList.add("hidden");
  app.classList.remove("hidden");
  
  startPullLoop();
  refreshContacts();
  refreshProfile();
}

const errorMessage = document.getElementById("errorMessage")!;

function showError(msg: string) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
}

function hideError() {
  errorMessage.classList.add("hidden");
}

onboardSignup.addEventListener("click", async () => {
  hideError();

  try {
    const username = onboardUsername.value.trim();
    const password = onboardPassword.value.trim();

    if (!username || !password) {
      showError("Please enter username and password");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    // Disable buttons during signup
    (onboardSignup as HTMLButtonElement).disabled = true;
    (onboardLogin as HTMLButtonElement).disabled = true;

    // Set base URL (hardcoded)
    await invoke<string>("set_base", { base: SERVER_BASE });

    // Check for pending invite token (using consistent key name)
    const inviteToken = localStorage.getItem("zerochat_pending_invite_token");

    // Signup - create new account (with optional invite token)
    await invoke<string>("signup", {
      username,
      password,
      base_url: SERVER_BASE,
      invite_token: inviteToken || null
    });

    // Clear the pending invite token after successful signup
    if (inviteToken) {
      localStorage.removeItem("zerochat_pending_invite_token");
      localStorage.removeItem("zerochat_pending_inviter");
    }

    // Complete auth and enter app
    await completeAuth();
  } catch (e: any) {
    const errorMsg = e?.message || e?.toString() || String(e) || "Unknown error";
    console.error("Signup error:", errorMsg);

    if (errorMsg.includes("Network error") || errorMsg.includes("error sending request")) {
      showError("Cannot connect to server. Make sure the server is running on http://127.0.0.1:8080");
    } else if (errorMsg.includes("409") || errorMsg.includes("Conflict") || errorMsg.includes("already exists")) {
      showError("Username already exists. Use 'Log In' if you have an account.");
    } else if (errorMsg.includes("400") || errorMsg.includes("bad username")) {
      showError("Invalid username. Username must be 3-24 characters, lowercase letters, numbers, and underscores only.");
    } else if (errorMsg.includes("password must be at least 8")) {
      showError("Password must be at least 8 characters long.");
    } else {
      showError("Signup failed: " + errorMsg);
    }
  } finally {
    // Re-enable buttons
    (onboardSignup as HTMLButtonElement).disabled = false;
    (onboardLogin as HTMLButtonElement).disabled = false;
  }
});

onboardLogin.addEventListener("click", async () => {
  hideError();
  
  try {
    const username = onboardUsername.value.trim();
    const password = onboardPassword.value.trim();
    
    if (!username || !password) {
      showError("Please enter username and password");
      return;
    }
    
    // Disable buttons during login
    (onboardSignup as HTMLButtonElement).disabled = true;
    (onboardLogin as HTMLButtonElement).disabled = true;
    
    // Set base URL (hardcoded)
    await invoke<string>("set_base", { base: SERVER_BASE });
    
    // Login - authenticate existing account
    await invoke<string>("login", { username, password, base_url: SERVER_BASE });
    
    // Complete auth and enter app
    await completeAuth();
  } catch (e: any) {
    const errorMsg = e?.message || e?.toString() || String(e) || "Unknown error";
    console.error("Login error:", errorMsg);
    
    if (errorMsg.includes("Network error") || errorMsg.includes("error sending request")) {
      showError("Cannot connect to server. Make sure the server is running on http://127.0.0.1:8080");
    } else if (errorMsg.includes("401") || errorMsg.includes("Invalid username or password") || errorMsg.includes("Unauthorized")) {
      showError("Invalid username or password. Please check your credentials and try again.");
    } else {
      showError("Login failed: " + errorMsg);
    }
  } finally {
    // Re-enable buttons
    (onboardSignup as HTMLButtonElement).disabled = false;
    (onboardLogin as HTMLButtonElement).disabled = false;
  }
});

// Pull loop
function startPullLoop() {
  if (pullInterval) clearInterval(pullInterval);
  pullInterval = window.setInterval(async () => {
    try {
      const messages = await invoke<string[]>("pull_and_decrypt");
      if (messages.length > 0) {
        messages.forEach(msg => {
          addMessage(msg, "friend");
        });
      }
    } catch (e) {
      // Silently fail
    }
  }, 1000);
}

function addMessage(text: string, sender: "me" | "friend", acked: boolean = false) {
  const div = document.createElement("div");
  div.className = `p-3 rounded ${sender === "me" ? "bg-blue-100 ml-auto" : "bg-gray-100"} max-w-xs flex items-center gap-2`;
  const textDiv = document.createElement("div");
  textDiv.textContent = text;
  div.appendChild(textDiv);
  if (sender === "me" && acked) {
    const check = document.createElement("span");
    check.textContent = "✓";
    check.className = "text-green-600";
    div.appendChild(check);
  }
  messagesList.appendChild(div);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Send message
chatSend.addEventListener("click", async () => {
  const friend = chatFriend.value;
  const text = chatMessage.value.trim();
  
  if (!friend || !text) return;
  
  try {
    await invoke<string>("send_to_username_hpke", { username: friend, plaintext: text });
    addMessage(text, "me", false);
    chatMessage.value = "";
    // Message will be acked when recipient pulls and decrypts
    // For now, mark as acked after a short delay (in real app, wait for ack from server)
    setTimeout(() => {
      const lastMsg = messagesList.lastElementChild;
      if (lastMsg && lastMsg.textContent?.includes(text)) {
        const check = document.createElement("span");
        check.textContent = "✓";
        check.className = "text-green-600 ml-2";
        lastMsg.appendChild(check);
      }
    }, 500);
  } catch (e: any) {
    alert("Send failed: " + (e?.message || e));
  }
});

chatMessage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    chatSend.click();
  }
});

// Contacts
async function refreshContacts() {
  try {
    const friends = await invoke<Array<{username: string, status: string}>>("friends_list");
    
    // Update pending requests
    const pending = friends.filter(f => f.status === "pending");
    pendingList.innerHTML = "";
    if (pending.length === 0) {
      pendingList.innerHTML = '<div class="text-gray-500 text-sm">No pending requests</div>';
    } else {
      pending.forEach(f => {
        const div = document.createElement("div");
        div.className = "flex items-center justify-between p-2 bg-yellow-50 rounded";
        div.innerHTML = `
          <span>${f.username}</span>
          <div class="flex gap-2">
            <button class="accept-btn px-3 py-1 bg-green-600 text-white rounded text-sm" data-username="${f.username}">Accept</button>
            <button class="reject-btn px-3 py-1 bg-red-600 text-white rounded text-sm" data-username="${f.username}">Reject</button>
          </div>
        `;
        pendingList.appendChild(div);
      });
      
      document.querySelectorAll(".accept-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const username = btn.getAttribute("data-username")!;
          await invoke<string>("friend_respond", { from_username: username, accept: true });
          refreshContacts();
        });
      });
      
      document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const username = btn.getAttribute("data-username")!;
          await invoke<string>("friend_respond", { from_username: username, accept: false });
          refreshContacts();
        });
      });
    }
    
    // Update friends list
    const accepted = friends.filter(f => f.status === "accepted");
    friendsListContent.innerHTML = "";
    if (accepted.length === 0) {
      friendsListContent.innerHTML = '<div class="text-gray-500 text-sm">No friends yet</div>';
    } else {
      accepted.forEach(f => {
        const div = document.createElement("div");
        div.className = "flex items-center justify-between p-2 bg-white border rounded";
        div.innerHTML = `
          <span>${f.username}</span>
          <button class="message-btn px-3 py-1 bg-blue-600 text-white rounded text-sm" data-username="${f.username}">Message</button>
        `;
        friendsListContent.appendChild(div);
      });
      
      document.querySelectorAll(".message-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const username = btn.getAttribute("data-username")!;
          switchTab("chats");
          chatFriend.value = username;
          chatMessage.focus();
        });
      });
    }
    
    // Update friend select in chats
    chatFriend.innerHTML = '<option value="">Select friend...</option>';
    accepted.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.username;
      opt.textContent = f.username;
      chatFriend.appendChild(opt);
    });
  } catch (e) {
    console.error("Failed to refresh contacts:", e);
  }
}

addFriendBtn.addEventListener("click", async () => {
  const username = addFriendInput.value.trim();
  if (!username) return;
  
  try {
    await invoke<string>("friend_request", { to_username: username });
    addFriendInput.value = "";
    refreshContacts();
  } catch (e: any) {
    alert("Failed to add friend: " + (e?.message || e));
  }
});

// Profile
async function refreshProfile() {
  try {
    const me = await invoke<{username: string, device_id: string}>("get_me");
    profileUsername.textContent = me.username;
    profileDeviceId.textContent = me.device_id;
    myUsername = me.username;
    myDeviceId = me.device_id;
  } catch (e) {
    console.error("Failed to load profile:", e);
  }
}

copyInviteLink.addEventListener("click", async () => {
  try {
    const resp = await invoke<{invite_link: string}>("create_invite", {
      friend_hint: null,
      ttl_minutes: 60
    });
    
    // Handle response - it might be wrapped in a Value object
    const inviteLink = (resp as any).invite_link || resp;
    
    if (!inviteLink || typeof inviteLink !== 'string') {
      throw new Error("Invalid response from server: " + JSON.stringify(resp));
    }
    
    await navigator.clipboard.writeText(inviteLink);
    if (inviteLinkText) {
      inviteLinkText.textContent = inviteLink;
    }
    if (inviteLinkDisplay) {
      inviteLinkDisplay.classList.remove("hidden");
    }
    alert("Invite link copied! Share it with friends to invite them to ZeroChat.");
  } catch (e: any) {
    console.error("Invite creation error:", e);
    alert("Failed to create invite: " + (e?.message || e));
  }
});

// Deep link handling - new plugin-based approach
listen("deeplink:provision", async (event: any) => {
  const { token, base, inviter } = event.payload as { token: string; base: string; inviter?: string };
  if (token && base) {
    await handleProvision(token, base, inviter);
  }
});

// Legacy deep link handling (keep for backward compatibility)
listen("deeplink", (event: any) => {
  const url = event.payload as string;
  handleDeeplink(url);
});

function handleDeeplink(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "zerochat:") return;
    
    if (u.hostname === "provision") {
      const token = u.searchParams.get("token");
      const base = u.searchParams.get("base");
      const inviter = u.searchParams.get("inviter");
      
      if (token) {
        handleProvision(token, base || undefined, inviter || undefined);
      }
    } else if (u.hostname === "addfriend") {
      const username = u.searchParams.get("u");
      const base = u.searchParams.get("base");
      
      if (username) {
        if (base) {
          invoke<string>("set_base", { base });
        }
        invoke<string>("friend_request", { to_username: username });
        switchTab("contacts");
      }
    }
  } catch (e) {
    console.error("Failed to handle deeplink:", e);
  }
}

async function handleProvision(token: string, base?: string, inviter?: string) {
  try {
    if (base) {
      await invoke<string>("set_base", { base });
    }

    // Store invite token in localStorage for use during signup (using consistent key name)
    localStorage.setItem("zerochat_pending_invite_token", token);
    if (inviter) {
      localStorage.setItem("zerochat_pending_inviter", inviter);
    }

    // Show onboarding screen for user to signup/login
    checkOnboarding();

    // If inviter is present, show a message
    if (inviter) {
      alert(`You've been invited to ZeroChat by ${inviter}! Please sign up to accept the invitation.`);
    }
  } catch (e: any) {
    alert("Failed to process invite: " + (e?.message || e));
  }
}

// Initialize
checkOnboarding();
