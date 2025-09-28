export interface GameEvent {
  id: string;
  type: 'goal' | 'foul' | 'timeout' | 'substitution' | 'card' | 'penalty';
  team: string;
  player: string;
  minute: number;
  title?: string;
  description: string;
  timestamp: number;
  importance: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: 'user' | 'system';
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  isActive: boolean;
  endTime: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
  isRead: boolean;
}

export interface ContentItem {
  id: string;
  type: 'highlight' | 'poll' | 'trending';
  title: string;
  description: string;
  image?: string;
  timestamp: number;
}
