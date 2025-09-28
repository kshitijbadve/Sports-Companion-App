import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameEvent } from '../types';

interface EventOverlayBannerProps {
  event: GameEvent | null;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

const EventOverlayBanner: React.FC<EventOverlayBannerProps> = ({ 
  event, 
  onDismiss, 
  autoHide = true, 
  duration = 5000 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (event) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      if (autoHide) {
        const timer = setTimeout(() => {
          hideBanner();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideBanner();
    }
  }, [event]);

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!event) return null;

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'goal':
        return 'football';
      case 'foul':
        return 'warning';
      case 'timeout':
        return 'time';
      case 'substitution':
        return 'swap-horizontal';
      case 'card':
        return 'card';
      case 'penalty':
        return 'flag';
      default:
        return 'information-circle';
    }
  };

  const getEventColor = (type: GameEvent['type']) => {
    switch (type) {
      case 'goal':
        return '#4CAF50';
      case 'foul':
        return '#FF9800';
      case 'timeout':
        return '#2196F3';
      case 'substitution':
        return '#9C27B0';
      case 'card':
        return '#FFC107';
      case 'penalty':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getBannerStyle = (importance: GameEvent['importance']) => {
    switch (importance) {
      case 'high':
        return styles.highImportanceBanner;
      case 'medium':
        return styles.mediumImportanceBanner;
      case 'low':
        return styles.lowImportanceBanner;
      default:
        return styles.lowImportanceBanner;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        getBannerStyle(event.importance),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons 
            name={getEventIcon(event.type)} 
            size={24} 
            color={getEventColor(event.type)} 
          />
          <Text style={styles.minute}>{event.minute}'</Text>
          <Text style={styles.team}>{event.team}</Text>
        </View>
        
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.player}>{event.player}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={hideBanner}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  minute: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 12,
  },
  team: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  player: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  highImportanceBanner: {
    backgroundColor: '#4CAF50',
  },
  mediumImportanceBanner: {
    backgroundColor: '#FF9800',
  },
  lowImportanceBanner: {
    backgroundColor: '#FF6B35',
  },
});

export default EventOverlayBanner;
