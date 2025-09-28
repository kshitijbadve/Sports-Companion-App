import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WebSocketSimulator from '../services/WebSocketSimulator';
import { GameEvent } from '../types';
import { useMatch } from '../context/MatchContext';

const Moments: React.FC = () => {
  const { currentMatch } = useMatch();
  const navigation = useNavigation();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, { likes: number; reactions: number; predictions: number }>>({});
  const [selectedReactions, setSelectedReactions] = useState<Record<string, { likes: boolean; reactions: boolean; predictions: boolean }>>({});

  useEffect(() => {
    if (!currentMatch) return;

    // Generate events based on current match
    const getInitialEvents = (): GameEvent[] => {
      if (currentMatch.id === 'madrid-barcelona') {
        return [
          {
            id: '1',
            type: 'goal',
            team: 'Real Madrid',
            player: 'Kylian Mbappe',
            minute: 12,
            title: 'Brilliant goal from Mbappe',
            description: 'Mbappe receives a through ball from Vinicius Jr. and slots it past Ter Stegen with a clinical finish into the bottom corner!',
            timestamp: Date.now() - 3000,
            importance: 'high'
          },
          {
            id: '2',
            type: 'goal',
            team: 'Barcelona',
            player: 'Robert Lewandowski',
            minute: 15,
            title: 'Clinical finish from Lewandowski',
            description: 'Lewandowski capitalizes on a defensive error and fires a powerful shot into the top corner from 18 yards out!',
            timestamp: Date.now() - 120000,
            importance: 'high'
          },
          {
            id: '3',
            type: 'foul',
            team: 'Real Madrid',
            player: 'Vinicius Jr',
            minute: 28,
            title: 'Excellent dribble and cross',
            description: 'Vinicius Jr. beats two defenders with a brilliant step-over and delivers a perfect cross into the box!',
            timestamp: Date.now() - 180000,
            importance: 'medium'
          }
        ];
      } else if (currentMatch.id === 'hawks-celtics') {
        return [
          {
            id: '1',
            type: 'goal',
            team: 'Atlanta Hawks',
            player: 'Trae Young',
            minute: 12,
            title: 'Amazing three-pointer from downtown',
            description: 'Trae Young pulls up from 30 feet and drains a deep three-pointer with a defender in his face!',
            timestamp: Date.now() - 3000,
            importance: 'high'
          },
          {
            id: '2',
            type: 'goal',
            team: 'Boston Celtics',
            player: 'Jayson Tatum',
            minute: 15,
            title: 'Slam dunk over the defender',
            description: 'Tatum drives baseline and throws down a powerful one-handed slam over the Hawks defender!',
            timestamp: Date.now() - 120000,
            importance: 'high'
          },
          {
            id: '3',
            type: 'foul',
            team: 'Atlanta Hawks',
            player: 'Dejounte Murray',
            minute: 28,
            title: 'Great defensive steal',
            description: 'Murray reads the pass perfectly and intercepts the ball, starting a fast break the other way!',
            timestamp: Date.now() - 180000,
            importance: 'medium'
          }
        ];
      } else {
        // Default to Cowboys vs Packers
        return [
          {
            id: '1',
            type: 'goal',
            team: 'Dallas Cowboys',
            player: 'Dak Prescott',
            minute: 12,
            title: 'Great defensive play',
            description: 'Prescott threads the needle with a 20-yard touchdown pass to CeeDee Lamb in the back of the end zone!',
            timestamp: Date.now() - 3000,
            importance: 'high'
          },
          {
            id: '2',
            type: 'goal',
            team: 'Green Bay Packers',
            player: 'Aaron Rodgers',
            minute: 15,
            title: 'Amazing catch in traffic',
            description: 'Rodgers finds Davante Adams for a spectacular 35-yard catch between two defenders!',
            timestamp: Date.now() - 120000,
            importance: 'high'
          },
          {
            id: '3',
            type: 'foul',
            team: 'Dallas Cowboys',
            player: 'Micah Parsons',
            minute: 28,
            title: 'Devastating sack',
            description: 'Parsons blasts through the line and sacks Jordan Love for a 12-yard loss on 3rd down!',
            timestamp: Date.now() - 180000,
            importance: 'medium'
          }
        ];
      }
    };
    
    setEvents(getInitialEvents());

    // Set up WebSocket listener for live events
    const handleNewEvent = (event: GameEvent) => {
      // Only add events that match the current match
      if (currentMatch && event.team && (
        event.team.includes(currentMatch.team1.name) || 
        event.team.includes(currentMatch.team2.name) ||
        event.team.includes(currentMatch.team1.shortName) ||
        event.team.includes(currentMatch.team2.shortName)
      )) {
        setEvents(prev => [event, ...prev]);
      }
    };

    WebSocketSimulator.addEventListener(handleNewEvent);
    WebSocketSimulator.connect();

    return () => {
      WebSocketSimulator.removeEventListener(handleNewEvent);
      WebSocketSimulator.disconnect();
    };
  }, [currentMatch]);

  const renderSelectedMatch = () => {
    if (!currentMatch) return null;

    return (
      <View style={styles.selectedMatchCard}>
        <Text style={styles.selectedMatchLabel}>Selected Match</Text>
        <View style={styles.matchContainer}>
          <View style={styles.teamSection}>
            <Image 
              source={currentMatch.team1.logo} 
              style={styles.teamLogo} 
            />
            <Text style={styles.teamName}>{currentMatch.team1.shortName}</Text>
            {currentMatch.sport === 'NFL' && (
              <Ionicons name="ellipse" size={12} color="#8B4513" style={styles.footballIcon} />
            )}
          </View>
          
          <View style={styles.scoreSection}>
            <Text style={styles.score}>{currentMatch.currentScore.team1}</Text>
            <View style={styles.centerInfo}>
              <View style={styles.centerDot} />
              <View style={styles.gameInfoContainer}>
                <View style={styles.timeContainer}>
                  <Text style={styles.quarter}>{currentMatch.gameTime.period}</Text>
                  <Text style={styles.time}>{currentMatch.gameTime.time}</Text>
                </View>
                {currentMatch.sport === 'NFL' && (
                  <Text style={styles.down}>4th & 9</Text>
                )}
              </View>
            </View>
            <Text style={styles.score}>{currentMatch.currentScore.team2}</Text>
          </View>
          
          <View style={[
            styles.teamSection, 
            currentMatch.sport === 'NFL' ? styles.cowboysSection : null
          ]}>
            <Image 
              source={currentMatch.team2.logo} 
              style={styles.teamLogo} 
            />
            <Text style={styles.teamName}>{currentMatch.team2.shortName}</Text>
            {currentMatch.sport === 'NFL' && (
              <View style={styles.footballIcon} />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEventCard = (event: GameEvent) => {
    const getTeamLogo = (team: string) => {
      if (team.includes('Packers')) {
        return require('../../assets/packers-logo.png');
      } else if (team.includes('Cowboys')) {
        return require('../../assets/cowboys-logo.png');
      } else if (team.includes('Hawks')) {
        return require('../../assets/hawks.png');
      } else if (team.includes('Celtics')) {
        return require('../../assets/celtics.png');
      } else if (team.includes('Real Madrid') || team.includes('Madrid')) {
        return require('../../assets/madrid.png');
      } else if (team.includes('Barcelona') || team.includes('Barca')) {
        return require('../../assets/barca.webp');
      }
      return require('../../assets/packers-logo.png'); // fallback
    };

    const getTimeAgo = (timestamp: number) => {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      if (minutes === 0) return 'now';
      if (minutes === 1) return '1 min ago';
      return `${minutes} mins ago`;
    };

  const getRandomCounts = () => ({
    likes: Math.floor(Math.random() * 1000) + 100,
    reactions: Math.floor(Math.random() * 500) + 50,
    predictions: Math.floor(Math.random() * 800) + 200,
  });

  const getCountsForEvent = (eventId: string) => {
    if (reactionCounts[eventId]) {
      return reactionCounts[eventId];
    }
    return getRandomCounts();
  };

  const handleReaction = (eventId: string, reactionType: 'likes' | 'reactions' | 'predictions') => {
    const currentCounts = getCountsForEvent(eventId);
    const currentSelections = selectedReactions[eventId] || { likes: false, reactions: false, predictions: false };
    const isCurrentlySelected = currentSelections[reactionType];
    
    setReactionCounts(prev => ({
      ...prev,
      [eventId]: {
        ...currentCounts,
        [reactionType]: isCurrentlySelected ? currentCounts[reactionType] - 1 : currentCounts[reactionType] + 1
      }
    }));
    
    setSelectedReactions(prev => ({
      ...prev,
      [eventId]: {
        ...currentSelections,
        [reactionType]: !isCurrentlySelected
      }
    }));
  };

    const counts = getCountsForEvent(event.id);
    const selections = selectedReactions[event.id] || { likes: false, reactions: false, predictions: false };

    return (
      <View key={event.id} style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.teamInfo}>
            <Image source={getTeamLogo(event.team)} style={styles.eventTeamLogo} />
            <Text style={styles.eventTeamName}>{event.team}</Text>
          </View>
          <Text style={styles.eventTime}>{getTimeAgo(event.timestamp)}</Text>
        </View>
        
        <View style={styles.eventContentBox}>
          <Text style={styles.eventTitle}>{event.title || 'Amazing catch in traffic'}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
        
        <View style={styles.eventActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              selections.likes && styles.actionButtonSelected
            ]}
            onPress={() => handleReaction(event.id, 'likes')}
          >
            <Text style={styles.emojiIcon}>🔥</Text>
            <Text style={styles.actionText}>{counts.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              selections.reactions && styles.actionButtonSelected
            ]}
            onPress={() => handleReaction(event.id, 'reactions')}
          >
            <Text style={styles.emojiIcon}>😬</Text>
            <Text style={styles.actionText}>{counts.reactions}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              selections.predictions && styles.actionButtonSelected
            ]}
            onPress={() => handleReaction(event.id, 'predictions')}
          >
            <Text style={styles.emojiIcon}>🎯</Text>
            <Text style={styles.actionText}>{counts.predictions}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!currentMatch) {
    return (
      <View style={styles.container}>
        <View style={styles.noMatchContainer}>
          <Ionicons name="basketball-outline" size={64} color="#6B7280" />
          <Text style={styles.noMatchTitle}>No Match Selected</Text>
          <Text style={styles.noMatchDescription}>Choose a match from the <Text style={styles.italicText}>Matches</Text> tab to access all features</Text>
          <TouchableOpacity 
            style={styles.selectMatchButton}
            onPress={() => navigation.navigate('Matches' as never)}
          >
            <Text style={styles.selectMatchButtonText}>Select a Match</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {renderSelectedMatch()}
      {events.map(renderEventCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050614',
  },
  scrollContent: {
    paddingBottom: 70,
  },
  noMatchContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  noMatchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    marginTop: 16,
    marginBottom: 8,
  },
  noMatchDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Avenir',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  selectMatchButton: {
    backgroundColor: '#1f202d',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 25,
  },
  selectMatchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  italicText: {
    fontStyle: 'italic',
  },
  selectedMatchCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8000FF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  selectedMatchLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 12,
    opacity: 0.7,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  teamSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 80,
  },
  cowboysSection: {
    marginTop: -4,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 2,
    paddingTop: 8,
  },
  centerInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  gameInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  score: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    textAlign: 'center',
    maxWidth: 80,
    flexWrap: 'wrap',
  },
  footballIcon: {
    marginTop: 4,
    textAlign: 'center',
  },
  quarter: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginBottom: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: '#6DFF01',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginLeft: 4,
  },
  down: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  eventCard: {
    backgroundColor: '#121320',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTeamLogo: {
    width: 28,
    height: 28,
    marginRight: 10,
    resizeMode: 'contain',
  },
  eventTeamName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  eventTime: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Avenir',
  },
  eventContentBox: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginBottom: 8,
  },
  eventDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Avenir',
    marginBottom: 4,
  },
  eventSubDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1f202d',
    borderRadius: 20,
    marginRight: 12,
  },
  actionButtonSelected: {
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#8000FF',
  },
  emojiIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginLeft: 2,
  },
});

export default Moments;