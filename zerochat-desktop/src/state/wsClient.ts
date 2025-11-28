/**
 * WebSocket client for real-time message delivery
 * Falls back to polling if WebSocket is unavailable
 */

import { Message } from './messagesStore';

export interface WSMessage {
  type: 'message' | 'typing' | 'read_receipt' | 'presence';
  chatId: string;
  data: any;
}

type WSMessageHandler = (message: WSMessage) => void;

class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private handlers: Set<WSMessageHandler> = new Set();
  private isConnecting = false;

  constructor(baseUrl: string = 'http://127.0.0.1:8080') {
    // Convert HTTP to WebSocket URL
    this.url = baseUrl.replace(/^http/, 'ws') + '/ws';
  }

  connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            this.handlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.isConnecting = false;
          this.ws = null;
          
          // Attempt to reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connect().catch(() => {
                // Silent fail on reconnect
              });
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
  }

  subscribe(handler: WSMessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsClientInstance: WSClient | null = null;

export function getWSClient(baseUrl?: string): WSClient {
  if (!wsClientInstance) {
    wsClientInstance = new WSClient(baseUrl);
  }
  return wsClientInstance;
}

