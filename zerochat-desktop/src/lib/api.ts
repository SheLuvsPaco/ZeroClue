/**
 * Thin API client around fetch with auth headers
 * Uses bridge for authentication
 */

import { invoke } from '../services/bridge';

const SERVER_BASE = "http://127.0.0.1:8080";

async function getBaseUrl(): Promise<string> {
  try {
    await invoke<string>("set_base", { base: SERVER_BASE });
    return SERVER_BASE;
  } catch {
    return SERVER_BASE;
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const creds = await invoke<{ device_id: string; device_auth: string }>("load_creds");
    if (!creds || !creds.device_id || !creds.device_auth) {
      return {};
    }
    return {
      'x-device-id': creds.device_id,
      'x-device-auth': creds.device_auth,
    };
  } catch {
    return {};
  }
}

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest<T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };
  
  if (requireAuth) {
    const authHeaders = await getAuthHeaders();
    Object.assign(headers, authHeaders);
  }
  
  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>('GET', path, options),
  
  post: <T>(path: string, body?: any, options?: ApiRequestOptions) =>
    apiRequest<T>('POST', path, { ...options, body: JSON.stringify(body) }),
  
  put: <T>(path: string, body?: any, options?: ApiRequestOptions) =>
    apiRequest<T>('PUT', path, { ...options, body: JSON.stringify(body) }),
  
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>('DELETE', path, options),
};

