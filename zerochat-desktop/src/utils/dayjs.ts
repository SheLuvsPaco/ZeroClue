import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default dayjs;

// Helper functions for common time formatting
export const formatMessageTime = (timestamp: number): string => {
  const date = dayjs(timestamp);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');
  
  if (diffDays === 0) {
    // Today: show time only
    return date.format('HH:mm');
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // This week: show day name
    return date.format('dddd');
  } else if (date.year() === now.year()) {
    // This year: show date without year
    return date.format('MMM D');
  } else {
    // Older: show full date
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

