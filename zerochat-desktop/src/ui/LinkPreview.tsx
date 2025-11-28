/**
 * Link preview component - shows title, description, and thumbnail
 */

import React from 'react';
import { openLink } from '../lib/files';

interface LinkPreviewProps {
  preview: {
    url: string;
    title: string;
    description?: string;
    image?: string;
    favicon?: string;
  };
}

export default function LinkPreview({ preview }: LinkPreviewProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openLink(preview.url);
  };

  return (
    <div
      onClick={handleClick}
      className="mt-2 mb-2 border border-[var(--border)] rounded-lg overflow-hidden cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
    >
      {preview.image && (
        <div className="w-full h-48 bg-[var(--bg-elev)] overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-3">
        <div className="flex items-start gap-2">
          {preview.favicon && (
            <img
              src={preview.favicon}
              alt=""
              className="w-4 h-4 mt-1 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{preview.title}</div>
            {preview.description && (
              <div className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                {preview.description}
              </div>
            )}
            <div className="text-xs text-[var(--text-muted)] truncate mt-1">
              {new URL(preview.url).hostname}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

