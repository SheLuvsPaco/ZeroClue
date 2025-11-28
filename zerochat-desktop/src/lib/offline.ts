/**
 * Offline handling - queue sends, mark with clock icon, retry on reconnect
 */

import { Message } from '../state/messagesStore';

export interface QueuedMessage {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'zerochat_message_queue';
const MAX_RETRIES = 3;

export function queueMessage(message: QueuedMessage): void {
  const queue = getQueue();
  queue.push(message);
  saveQueue(queue);
}

export function getQueue(): QueuedMessage[] {
  const stored = localStorage.getItem(QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveQueue(queue: QueuedMessage[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function removeFromQueue(messageId: string): void {
  const queue = getQueue();
  const filtered = queue.filter(m => m.id !== messageId);
  saveQueue(filtered);
}

export function incrementRetry(messageId: string): void {
  const queue = getQueue();
  const message = queue.find(m => m.id === messageId);
  if (message) {
    message.retries += 1;
    saveQueue(queue);
  }
}

export function getMessagesToRetry(): QueuedMessage[] {
  const queue = getQueue();
  return queue.filter(m => m.retries < MAX_RETRIES);
}

export function clearExpiredMessages(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
  const queue = getQueue();
  const now = Date.now();
  const filtered = queue.filter(m => (now - m.timestamp) < maxAge);
  saveQueue(filtered);
}

// Network status detection
export function isOnline(): boolean {
  return navigator.onLine;
}

export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

