/**
 * Time formatting utilities using dayjs
 */

import dayjs from '../utils/dayjs';

export const formatMessageTime = (timestamp: number): string => {
  const date = dayjs(timestamp);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');
  
  if (diffDays === 0) {
    return date.format('HH:mm');
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.format('dddd');
  } else if (date.year() === now.year()) {
    return date.format('MMM D');
  } else {
    return date.format('MMM D, YYYY');
  }
};

export const formatChatListTime = (timestamp: number): string => {
  const date = dayjs(timestamp);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');
  
  if (diffDays === 0) {
    return date.format('HH:mm');
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.format('ddd');
  } else if (date.year() === now.year()) {
    return date.format('MMM D');
  } else {
    return date.format('MM/DD/YY');
  }
};

export const formatDayHeader = (dateString: string): string => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.format('dddd');
  } else if (date.year() === now.year()) {
    return date.format('MMMM D');
  } else {
    return date.format('MMMM D, YYYY');
  }
};

export const formatRelativeTime = (timestamp: number): string => {
  return dayjs(timestamp).fromNow();
};

export const isToday = (timestamp: number): boolean => {
  return dayjs(timestamp).isSame(dayjs(), 'day');
};

export const isYesterday = (timestamp: number): boolean => {
  return dayjs(timestamp).isSame(dayjs().subtract(1, 'day'), 'day');
};

