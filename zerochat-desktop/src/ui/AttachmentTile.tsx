/**
 * Attachment tile component - displays image/file previews
 */

import React from 'react';
import { formatFileSize, isImageFile, openLink } from '../lib/files';

interface AttachmentTileProps {
  attachment: {
    type: 'image' | 'file';
    url: string;
    name?: string;
    size?: number;
    thumbnail?: string;
  };
}

export default function AttachmentTile({ attachment }: AttachmentTileProps) {
  const handleClick = () => {
    openLink(attachment.url);
  };

  const isImage = attachment.type === 'image' || (attachment.name && isImageFile(attachment.name));

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:opacity-90 transition-opacity"
    >
      {isImage ? (
        <div className="relative">
          <img
            src={attachment.thumbnail || attachment.url}
            alt={attachment.name || 'Image'}
            className="max-w-full max-h-64 rounded-lg object-cover"
            onError={(e) => {
              // Fallback to file icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="p-4 bg-[var(--bg-elev)] rounded-lg border border-[var(--border)]">
                    <div class="text-sm text-[var(--text-muted)]">Failed to load image</div>
                  </div>
                `;
              }
            }}
          />
        </div>
      ) : (
        <div className="p-4 bg-[var(--bg-elev)] rounded-lg border border-[var(--border)] flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white text-xl">
            📎
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{attachment.name || 'File'}</div>
            {attachment.size && (
              <div className="text-xs text-[var(--text-muted)]">{formatFileSize(attachment.size)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

