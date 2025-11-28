/**
 * File handling utilities
 * Uses platform-specific bridges for file operations
 */

import { invoke, platform } from '../services/bridge';

export interface FilePickResult {
  path?: string;
  name: string;
  size: number;
  type: string;
  data?: ArrayBuffer | string; // Base64 or ArrayBuffer
}

/**
 * Pick a file using platform-specific file picker
 */
export async function pickFile(options?: {
  accept?: string;
  multiple?: boolean;
}): Promise<FilePickResult | FilePickResult[]> {
  if (platform.isTauri) {
    // Tauri file picker
    const { open } = await import('@tauri-apps/api/dialog');
    const { readBinaryFile } = await import('@tauri-apps/api/fs');
    
    const selected = await open({
      multiple: options?.multiple || false,
      filters: options?.accept ? [{ name: 'Files', extensions: options.accept.split(',').map(e => e.trim()) }] : undefined,
    });
    
    if (!selected) {
      throw new Error('No file selected');
    }
    
    if (Array.isArray(selected)) {
      const results = await Promise.all(
        selected.map(async (path) => {
          const data = await readBinaryFile(path);
          return {
            path,
            name: path.split('/').pop() || 'unknown',
            size: data.length,
            type: 'application/octet-stream',
            data,
          };
        })
      );
      return results;
    } else {
      const data = await readBinaryFile(selected as string);
      return {
        path: selected as string,
        name: (selected as string).split('/').pop() || 'unknown',
        size: data.length,
        type: 'application/octet-stream',
        data,
      };
    }
  } else if (platform.isAndroid) {
    // Android file picker via bridge
    const result = await invoke<FilePickResult | FilePickResult[]>('pickFile', options || {});
    return result;
  } else {
    // Web file picker
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options?.multiple || false;
      if (options?.accept) {
        input.accept = options.accept;
      }
      
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          reject(new Error('No file selected'));
          return;
        }
        
        const results = await Promise.all(
          Array.from(files).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              data: arrayBuffer,
            };
          })
        );
        
        resolve(options?.multiple ? results : results[0]);
      };
      
      input.oncancel = () => {
        reject(new Error('File picker cancelled'));
      };
      
      input.click();
    });
  }
}

/**
 * Read file as base64
 */
export async function fileToBase64(file: FilePickResult): Promise<string> {
  if (typeof file.data === 'string') {
    return file.data;
  }
  
  if (file.data instanceof ArrayBuffer) {
    const bytes = new Uint8Array(file.data);
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binary);
  }
  
  throw new Error('File data not available');
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

/**
 * Open a link (uses platform-specific method)
 */
export async function openLink(url: string): Promise<void> {
  if (platform.isTauri) {
    const { open } = await import('@tauri-apps/api/shell');
    await open(url);
  } else if (platform.isAndroid) {
    await invoke('openLink', { url });
  } else {
    window.open(url, '_blank');
  }
}

