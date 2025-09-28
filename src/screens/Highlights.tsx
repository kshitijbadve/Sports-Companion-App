import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Share,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useMatch } from '../context/MatchContext';

interface Highlight {
  id: string;
  team: string;
  teamLogo: any;
  title: string;
  score?: string;
  description: string;
  timeAgo: string;
  isTrending?: boolean;
}

const Highlights: React.FC = () => {
  const { currentMatch } = useMatch();
  const navigation = useNavigation();
  
  const getHighlights = (): Highlight[] => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        {
          id: '0',
          team: 'Real Madrid',
          teamLogo: require('../../assets/madrid.png'),
          title: 'Goal',
          score: '2-1',
          description: 'Real Madrid takes the lead! Brilliant finish to make it 2-1',
          timeAgo: '2 mins ago',
          isTrending: true
        },
        {
          id: '1',
          team: 'Real Madrid',
          teamLogo: require('../../assets/madrid.png'),
          title: 'Goal',
          score: '1-1',
          description: 'Mbappe equalizes with a clinical finish from inside the box! Great build-up play from Vinicius Jr.',
          timeAgo: '5 mins ago',
          isTrending: true
        },
        {
          id: '2',
          team: 'Barcelona',
          teamLogo: require('../../assets/barca.webp'),
          title: 'Brilliant save',
          description: 'Ter Stegen makes an incredible reflex save to deny Rodrygo from close range!',
          timeAgo: '8 mins ago'
        },
        {
          id: '3',
          team: 'Barcelona',
          teamLogo: require('../../assets/barca.webp'),
          title: 'Goal',
          score: '0-1',
          description: 'Lewandowski opens the scoring with a clinical finish from inside the box!',
          timeAgo: '11 mins ago'
        },
        {
          id: '4',
          team: 'Barcelona',
          teamLogo: require('../../assets/barca.webp'),
          title: 'Defensive clearance',
          description: 'Araujo makes a crucial last-ditch tackle to prevent a certain goal!',
          timeAgo: '13 mins ago'
        }
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        {
          id: '0',
          team: 'Atlanta Hawks',
          teamLogo: require('../../assets/hawks.png'),
          title: 'Three-pointer',
          score: '28-24',
          description: 'Trae Young hits a deep three-pointer to extend the lead!',
          timeAgo: '2 mins ago',
          isTrending: true
        },
        {
          id: '1',
          team: 'Boston Celtics',
          teamLogo: require('../../assets/celtics.png'),
          title: 'Slam dunk',
          score: '25-24',
          description: 'Jayson Tatum throws down a powerful slam dunk over the defender!',
          timeAgo: '5 mins ago',
          isTrending: true
        },
        {
          id: '2',
          team: 'Atlanta Hawks',
          teamLogo: require('../../assets/hawks.png'),
          title: 'Block',
          description: 'Dejounte Murray makes an incredible block to deny the Celtics shot!',
          timeAgo: '8 mins ago'
        },
        {
          id: '3',
          team: 'Boston Celtics',
          teamLogo: require('../../assets/celtics.png'),
          title: 'Three-pointer',
          score: '24-28',
          description: 'Jaylen Brown hits a clutch three-pointer from the corner!',
          timeAgo: '11 mins ago'
        },
        {
          id: '4',
          team: 'Atlanta Hawks',
          teamLogo: require('../../assets/hawks.png'),
          title: 'Steal',
          description: 'Trae Young makes a great defensive steal and starts the fast break!',
          timeAgo: '13 mins ago'
        }
      ];
    } else {
      return [
        {
          id: '1',
          team: 'Dallas Cowboys',
          teamLogo: require('../../assets/cowboys-logo.png'),
          title: 'Touchdown',
          score: '7-7',
          description: 'Dak Prescott connects with CeeDee Lamb on a 15-yard slant route for the score! Perfect timing and execution in the red zone.',
          timeAgo: '5 mins ago',
          isTrending: true
        },
        {
          id: '2',
          team: 'Green Bay Packers',
          teamLogo: require('../../assets/packers-logo.png'),
          title: 'Quarterback scramble',
          description: 'Jordan Love escapes pressure and picks up 12 yards on a crucial 3rd down scramble! Great awareness and mobility.',
          timeAgo: '8 mins ago'
        },
        {
          id: '3',
          team: 'Green Bay Packers',
          teamLogo: require('../../assets/packers-logo.png'),
          title: 'Touchdown',
          score: '7-0',
          description: 'Aaron Jones breaks through the line for a 25-yard touchdown run! Excellent blocking and vision from the veteran running back.',
          timeAgo: '11 mins ago'
        },
        {
          id: '4',
          team: 'Dallas Cowboys',
          teamLogo: require('../../assets/cowboys-logo.png'),
          title: 'Defensive stop',
          description: 'Micah Parsons makes a huge 4th down stop! Forces an incomplete pass with pressure on Jordan Love to get the ball back.',
          timeAgo: '13 mins ago'
        }
      ];
    }
  };

  const [highlights] = useState<Highlight[]>(getHighlights());

  const renderHighlightCard = (highlight: Highlight) => (
    <View key={highlight.id} style={styles.highlightCard}>
      <View style={styles.cardHeader}>
        <View style={styles.teamInfo}>
          <Image source={highlight.teamLogo} style={styles.teamLogo} />
          <Text style={styles.teamName}>{highlight.team}</Text>
        </View>
        <View style={styles.headerRight}>
          {highlight.isTrending && (
            <View style={styles.trendingContainer}>
              <Ionicons name="trending-up" size={16} color="#6DFF01" />
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          )}
          <Text style={styles.timeAgo}>{highlight.timeAgo}</Text>
        </View>
      </View>
      
      <View style={styles.highlightContentBox}>
        <Text style={styles.highlightTitle}>
          {highlight.title}
          {highlight.score && (
            <Text>
              {highlight.score === '28-24' ? (
                <>
                  <Text style={styles.scoreTextGreen}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreText}>{highlight.score.split('-')[1]}</Text>
                </>
              ) : highlight.score === '25-24' ? (
                <>
                  <Text style={styles.scoreText}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreTextGreen}>{highlight.score.split('-')[1]}</Text>
                </>
              ) : highlight.score === '2-1' ? (
                <>
                  <Text style={styles.scoreTextGreen}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreText}>{highlight.score.split('-')[1]}</Text>
                </>
              ) : highlight.score === '1-1' ? (
                <>
                  <Text style={styles.scoreTextGreen}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreText}>{highlight.score.split('-')[1]}</Text>
                </>
              ) : highlight.score === '0-1' ? (
                <>
                  <Text style={styles.scoreText}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreTextGreen}>{highlight.score.split('-')[1]}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.scoreText}> {highlight.score.split('-')[0]}-</Text>
                  <Text style={styles.scoreTextGreen}>{highlight.score.split('-')[1]}</Text>
                </>
              )}
            </Text>
          )}
        </Text>
        <Text style={styles.highlightDescription}>{highlight.description}</Text>
      </View>
      
      <View style={styles.highlightActions}>
        <TouchableOpacity 
          style={styles.watchButton}
          onPress={() => {
            if (highlight.id === '0' && currentMatch?.id === 'hawks-celtics') {
              WebBrowser.openBrowserAsync('https://www.youtube.com/embed/iriy-eutsas');
            } else if (highlight.id === '1' && currentMatch?.id === 'madrid-barcelona') {
              WebBrowser.openBrowserAsync('https://www.youtube.com/embed/wpJowmjnCXA');
            } else if (highlight.id === '1') {
              WebBrowser.openBrowserAsync('https://www.youtube.com/watch?v=t35GaYzPwUo');
            }
          }}
        >
          <Ionicons name="play" size={16} color="#FFFFFF" />
          <Text style={styles.watchButtonText}>Watch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {
            const shareMessage = `Check out this ${highlight.team} highlight: ${highlight.title}${highlight.score ? ` (${highlight.score})` : ''}`;
            
            // Create SMS URL with the message
            const smsUrl = `sms:?body=${encodeURIComponent(shareMessage)}`;
            
            // Show popup with text message option
            Alert.alert(
              'Share Highlight',
              'Choose how to share this highlight:',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Text Message', onPress: () => {
                  Linking.openURL(smsUrl).catch((error) => {
                    Alert.alert('Error', 'Unable to open text messages. Please try again.');
                  });
                }},
                { text: 'Copy Text', onPress: () => {
                  Alert.alert('Text Copied', shareMessage);
                }}
              ]
            );
          }}
        >
          <Ionicons name="share-outline" size={16} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <View style={styles.header}>
        <View style={styles.highlightsTitleContainer}>
          <View style={styles.greenDot} />
          <Text style={styles.highlightsTitle}>Highlights</Text>
        </View>
      </View>
      
      {highlights.map(renderHighlightCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050614',
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
  scrollContent: {
    paddingBottom: 70,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  highlightsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6DFF01',
    marginRight: 8,
  },
  highlightsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  highlightCard: {
    backgroundColor: '#121320',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 28,
    height: 28,
    marginRight: 10,
    resizeMode: 'contain',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  trendingText: {
    color: '#6DFF01',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginLeft: 4,
  },
  timeAgo: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Avenir',
  },
  highlightContentBox: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginBottom: 8,
  },
  scoreText: {
    color: '#FFFFFF',
  },
  scoreTextGreen: {
    color: '#6DFF01',
  },
  highlightDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Avenir',
    marginBottom: 4,
  },
  highlightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8000FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginLeft: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f202d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginLeft: 4,
  },
});

export default Highlights;
