import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LiveEventTile from '../components/LiveEventTile';
import EventOverlayBanner from '../components/EventOverlayBanner';
import ChatModule from '../components/ChatModule';
import { GameEvent, Notification, ContentItem } from '../types';
import WebSocketSimulator from '../services/WebSocketSimulator';
import MockAPI from '../services/MockAPI';

const LiveDashboard: React.FC = () => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [overlayEvent, setOverlayEvent] = useState<GameEvent | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contentFeed, setContentFeed] = useState<ContentItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Initialize data
    loadData();
    
    // Set up WebSocket listener
    WebSocketSimulator.addEventListener(handleNewEvent);
    WebSocketSimulator.connect();

    return () => {
      WebSocketSimulator.removeEventListener(handleNewEvent);
      WebSocketSimulator.disconnect();
    };
  }, []);

  const loadData = () => {
    setNotifications(MockAPI.getNotifications());
    setContentFeed(MockAPI.getContentFeed());
  };

  const handleNewEvent = (event: GameEvent) => {
    setEvents(prev => [event, ...prev]);
    
    // Show overlay for important events
    if (event.importance === 'high') {
      setOverlayEvent(event);
    }
    
    // Add notification for important events
    if (event.importance === 'high') {
      MockAPI.addNotification({
        title: `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} Alert!`,
        message: event.description,
        type: 'success',
        isRead: false,
      });
      loadData();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const dismissOverlay = () => {
    setOverlayEvent(null);
  };

  const renderContentItem = (item: ContentItem) => (
    <TouchableOpacity key={item.id} style={styles.contentItem}>
      <View style={styles.contentHeader}>
        <Text style={styles.contentType}>{item.type.toUpperCase()}</Text>
        <Text style={styles.contentTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      <Text style={styles.contentTitle}>{item.title}</Text>
      <Text style={styles.contentDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <EventOverlayBanner 
        event={overlayEvent} 
        onDismiss={dismissOverlay}
        autoHide={true}
        duration={5000}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PrizePicks Live</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {/* Navigate to notifications */}}
          >
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {notifications.filter(n => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => setShowChat(!showChat)}
          >
            <Ionicons 
              name={showChat ? "chatbubbles" : "chatbubbles-outline"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Live Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Events</Text>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="football" size={48} color="#666666" />
              <Text style={styles.emptyText}>Waiting for live events...</Text>
            </View>
          ) : (
            events.map((event) => (
              <LiveEventTile 
                key={event.id} 
                event={event}
                onPress={() => {/* Handle event press */}}
              />
            ))
          )}
        </View>

        {/* Content Feed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          {contentFeed.map(renderContentItem)}
        </View>
      </ScrollView>

      {/* Chat Module */}
      {showChat && (
        <View style={styles.chatContainer}>
          <ChatModule 
            height={300}
            onMessageSent={(message) => {
              console.log('Message sent:', message);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatButton: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 12,
  },
  contentItem: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentType: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  contentTime: {
    color: '#888888',
    fontSize: 12,
  },
  contentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentDescription: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
});

export default LiveDashboard;
