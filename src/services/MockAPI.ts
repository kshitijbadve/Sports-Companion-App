import { User, ChatMessage, Poll, Notification, ContentItem } from '../types';

class MockAPI {
  private currentUser: User = {
    id: '1',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/50/FF6B35/FFFFFF?text=JD',
    isOnline: true,
  };

  private notifications: Notification[] = [
    {
      id: '1',
      title: 'Goal Alert!',
      message: 'Team A just scored in the 15th minute!',
      type: 'success',
      timestamp: Date.now() - 300000,
      isRead: false,
    },
    {
      id: '2',
      title: 'Poll Update',
      message: 'New poll available: Who will win?',
      type: 'info',
      timestamp: Date.now() - 600000,
      isRead: true,
    },
  ];

  private contentFeed: ContentItem[] = [
    {
      id: '1',
      type: 'highlight',
      title: 'Amazing Goal!',
      description: 'Watch this incredible strike from outside the box',
      image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=GOAL',
      timestamp: Date.now() - 300000,
    },
    {
      id: '2',
      type: 'poll',
      title: 'Who will win?',
      description: 'Vote for your favorite team',
      timestamp: Date.now() - 600000,
    },
    {
      id: '3',
      type: 'trending',
      title: 'Trending Play',
      description: 'This play is going viral!',
      timestamp: Date.now() - 900000,
    },
  ];

  private chatMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      message: 'What a goal! 🔥',
      timestamp: Date.now() - 300000,
      type: 'user',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Wilson',
      message: 'That was incredible!',
      timestamp: Date.now() - 280000,
      type: 'user',
    },
    {
      id: '3',
      userId: 'system',
      userName: 'System',
      message: 'Welcome to the watch party! 🎉',
      timestamp: Date.now() - 600000,
      type: 'system',
    },
  ];

  private polls: Poll[] = [
    {
      id: '1',
      question: 'Who will win this match?',
      options: ['Team A', 'Team B', 'Draw'],
      votes: { 'Team A': 45, 'Team B': 32, 'Draw': 23 },
      isActive: true,
      endTime: Date.now() + 3600000, // 1 hour from now
    },
  ];

  // User API
  getCurrentUser(): User {
    return this.currentUser;
  }

  updateUser(updates: Partial<User>): User {
    this.currentUser = { ...this.currentUser, ...updates };
    return this.currentUser;
  }

  // Notifications API
  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => b.timestamp - a.timestamp);
  }

  markNotificationAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  // Content Feed API
  getContentFeed(): ContentItem[] {
    return [...this.contentFeed].sort((a, b) => b.timestamp - a.timestamp);
  }

  addContentItem(item: Omit<ContentItem, 'id' | 'timestamp'>): ContentItem {
    const newItem: ContentItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    this.contentFeed.unshift(newItem);
    return newItem;
  }

  // Chat API
  getChatMessages(): ChatMessage[] {
    return [...this.chatMessages].sort((a, b) => a.timestamp - b.timestamp);
  }

  sendMessage(message: string, userId: string = '1', userName: string = 'John Doe'): ChatMessage {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      message,
      timestamp: Date.now(),
      type: 'user',
    };
    this.chatMessages.push(newMessage);
    return newMessage;
  }

  // Polls API
  getPolls(): Poll[] {
    return [...this.polls].filter(poll => poll.isActive);
  }

  voteOnPoll(pollId: string, option: string): void {
    const poll = this.polls.find(p => p.id === pollId);
    if (poll && poll.isActive) {
      poll.votes[option] = (poll.votes[option] || 0) + 1;
    }
  }

  createPoll(question: string, options: string[]): Poll {
    const newPoll: Poll = {
      id: Math.random().toString(36).substr(2, 9),
      question,
      options,
      votes: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}),
      isActive: true,
      endTime: Date.now() + 3600000, // 1 hour from now
    };
    this.polls.push(newPoll);
    return newPoll;
  }
}

export default new MockAPI();
