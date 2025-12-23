/**
 * Settings menu - profile, invite link, logout
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createInviteLink } from '../api';

interface SettingsMenuProps {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: SettingsMenuProps) {
  // ✅ 1. Hooks must be at the top level
  const { user, logout, isAuthenticated } = useAuth();

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // ✅ 2. Logging Logic (Preserved)
  useEffect(() => {
    console.log('[SettingsMenu] ========== SETTINGS MENU OPENED ==========');
    console.log('[SettingsMenu] Full user object:', JSON.stringify(user, null, 2));
    console.log('[SettingsMenu] User object keys:', user ? Object.keys(user) : 'null');
    console.log('[SettingsMenu] Auth state:', {
      isAuthenticated,
      hasUser: !!user,
      username: user?.username,
      device_id: user?.device_id,
      userType: typeof user,
      userString: String(user),
    });
  }, [isAuthenticated, user]);

  // ✅ 3. Device ID Logic (Preserved)
  useEffect(() => {
    if (user?.device_id) {
      console.log('[SettingsMenu] Setting device_id from user:', user.device_id);
      setDeviceId(user.device_id);
    }
  }, [user]);

  const handleCreateInvite = async () => {
    console.log('[SettingsMenu] Create invite link clicked');
    console.log('[SettingsMenu] Auth state:', {
      isAuthenticated,
      hasUser: !!user,
      username: user?.username,
    });

    if (!isAuthenticated) {
      console.error('[SettingsMenu] Not authenticated, cannot create invite');
      setError('Not authenticated. Please log in again.');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      console.log('[SettingsMenu] Calling userApi.createInvite()...');

      // ✅ FIXED: The new signature is (friendHint?: string, ttlMinutes?: number).
      // We pass 'undefined' for the hint to get to the TTL argument.
      const result = await createInviteLink(undefined, 60);

      // ✅ FIXED: The interface now returns 'invite_url' (or 'invite_token').
      // We use 'invite_url' for the UI.
      console.log('[SettingsMenu] Invite link created:', result.invite_url ? 'success' : 'failed');
      setInviteLink(result.invite_url);

    } catch (e: any) {
      console.error('[SettingsMenu] Failed to create invite:', e);
      setError(e?.message || 'Failed to create invite link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      // You could show a toast here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[var(--bg-elev)] rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--text)]">Settings</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="border-b border-[var(--border)] pb-4">
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Profile</h3>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-semibold text-lg">
                  {(user.username || 'U')[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--text)] truncate">
                    {user.username || 'Unknown User'}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] truncate">
                    Device ID: {(() => {
                      // Try deviceId state first (from credentials), then user.device_id
                      const did = deviceId || (user as any)?.device_id || '';
                      if (!did) {
                        return 'loading...';
                      }
                      const didStr = typeof did === 'string' ? did : String(did);
                      return didStr.length > 8 ? `${didStr.substring(0, 8)}...` : didStr;
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[var(--text-muted)] text-sm">Not authenticated</div>
            )}
          </div>

          {/* Invite Link Section */}
          <div className="border-b border-[var(--border)] pb-4">
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Invite Friends</h3>
            {!isAuthenticated ? (
              <div className="text-sm text-[var(--text-muted)]">Not authenticated</div>
            ) : !inviteLink ? (
              <button
                onClick={handleCreateInvite}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Create Invite Link'}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-[var(--input-bg)] rounded-lg">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-transparent text-[var(--text)] text-sm"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-3 py-1 bg-[var(--accent)] text-white text-sm rounded hover:bg-[var(--accent-hover)]"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => setInviteLink(null)}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Generate new link
                </button>
              </div>
            )}
            {error && (
              <div className="mt-2 text-sm text-[var(--error)]">{error}</div>
            )}
          </div>

          {/* Logout */}
          <div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full px-4 py-2 bg-[var(--error)] text-white rounded-lg hover:opacity-90"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}