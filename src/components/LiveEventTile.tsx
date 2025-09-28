import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameEvent } from '../types';

interface LiveEventTileProps {
  event: GameEvent;
  onPress?: () => void;
}

const LiveEventTile: React.FC<LiveEventTileProps> = ({ event, onPress }) => {
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

  const getImportanceStyle = (importance: GameEvent['importance']) => {
    switch (importance) {
      case 'high':
        return styles.highImportance;
      case 'medium':
        return styles.mediumImportance;
      case 'low':
        return styles.lowImportance;
      default:
        return styles.lowImportance;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, getImportanceStyle(event.importance)]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getEventIcon(event.type)} 
            size={20} 
            color={getEventColor(event.type)} 
          />
        </View>
        <Text style={styles.minute}>{event.minute}'</Text>
        <Text style={styles.team}>{event.team}</Text>
      </View>
      
      <Text style={styles.description}>{event.description}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.player}>{event.player}</Text>
        <Text style={styles.time}>
          {new Date(event.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  minute: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  team: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  player: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  time: {
    color: '#888888',
    fontSize: 12,
  },
  highImportance: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#1a2a1a',
  },
  mediumImportance: {
    borderLeftColor: '#FF9800',
    backgroundColor: '#2a2a1a',
  },
  lowImportance: {
    borderLeftColor: '#757575',
    backgroundColor: '#2a2a2a',
  },
});

export default LiveEventTile;
