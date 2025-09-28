import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMatch } from '../context/MatchContext';
import { useMenu } from '../context/MenuContext';

const Matches: React.FC = () => {
  const navigation = useNavigation();
  const { switchMatch } = useMatch();
  const { toggleMenu } = useMenu();

  const handleJoinMatch = (match: any) => {
    // Set the current match based on the sport
    if (match.sport === 'NFL') {
      switchMatch('cowboys-packers');
    } else if (match.sport === 'NBA') {
      switchMatch('hawks-celtics');
    } else if (match.sport === 'LA LIGA') {
      switchMatch('madrid-barcelona');
    }
    
    // Navigate to Live screen with Moments tab active
    navigation.navigate('Live' as never);
  };

  const getTeamLogo = (team: string) => {
    if (team === 'packers') {
      return require('../../assets/packers-logo.png');
    } else if (team === 'cowboys') {
      return require('../../assets/cowboys-logo.png');
    } else if (team === 'hawks') {
      return require('../../assets/hawks.png');
    } else if (team === 'celtics') {
      return require('../../assets/celtics.png');
    } else if (team === 'madrid') {
      return require('../../assets/madrid.png');
    } else if (team === 'barca') {
      return require('../../assets/barca.webp');
    }
    return require('../../assets/packers-logo.png'); // fallback
  };

  const activeLineup = [
    {
      id: '1',
      sport: 'NFL',
      matchup: 'Packers vs Cowboys',
      player: {
        name: 'MICAH Parsons',
        image: require('../../assets/parsons.png'),
        stat: '↑ 0.5 Sacks'
      },
      joinButton: {
        icon: 'teams',
        text: 'Join Match',
        teamLogos: ['packers', 'cowboys']
      }
    },
    {
      id: '2',
      sport: 'NBA',
      matchup: 'Hawks vs Celtics',
      player: {
        name: 'TRAE Young',
        image: require('../../assets/young.webp'),
        stat: '↑ 24 Points'
      },
      joinButton: {
        icon: 'teams',
        text: 'Join Match',
        teamLogos: ['celtics', 'hawks']
      }
    },
    {
      id: '3',
      sport: 'LA LIGA',
      matchup: 'Real Madrid vs Barcelona',
      player: {
        name: 'KYLIAN Mbappe',
        image: require('../../assets/mbappe.png'),
        stat: '↓ 1.5 Goals',
        secondaryStat: '↑ 3.5 Shots'
      },
      joinButton: {
        icon: 'teams',
        text: 'Join Match',
        teamLogos: ['madrid', 'barca']
      }
    }
  ];

  const renderMatch = (match: any) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.sportHeader}>
        <Text style={styles.sportTitle}>{match.sport}</Text>
        <Text style={styles.matchupText}>{match.matchup}</Text>
      </View>
      
      <View style={styles.playerCard}>
        <View style={styles.playerInfo}>
          <Image source={match.player.image} style={styles.playerImage} />
          <View style={styles.playerNameContainer}>
            <Text style={styles.playerFirstName}>{match.player.name.split(' ')[0]}</Text>
            <Text style={styles.playerLastName}>{match.player.name.split(' ').slice(1).join(' ')}</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statContainer}>
            <View style={styles.statContent}>
              <View style={styles.statTopRow}>
                <Ionicons name="arrow-down" size={16} color="#FFFFFF" style={styles.arrowIcon} />
                <Text style={styles.statNumber}>{match.player.stat.replace('↑ ', '').replace('↓ ', '').split(' ')[0]}</Text>
              </View>
              <Text style={styles.statUnit}>{match.player.stat.replace('↑ ', '').replace('↓ ', '').split(' ').slice(1).join(' ')}</Text>
            </View>
          </View>
          {match.player.secondaryStat && (
            <View style={styles.statContainer}>
              <View style={styles.statContent}>
                <View style={styles.statTopRow}>
                  <Ionicons name="arrow-up" size={16} color="#FFFFFF" style={styles.arrowIcon} />
                  <Text style={styles.statNumber}>{match.player.secondaryStat.replace('↑ ', '').replace('↓ ', '').split(' ')[0]}</Text>
                </View>
                <Text style={styles.statUnit}>{match.player.secondaryStat.replace('↑ ', '').replace('↓ ', '').split(' ').slice(1).join(' ')}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinMatch(match)}>
        <View style={styles.joinButtonContent}>
          {match.joinButton.icon === 'G' ? (
            <View style={styles.greenGIcon}>
              <Text style={styles.greenGText}>G</Text>
            </View>
          ) : (
            <View style={styles.teamIconsContainer}>
              {match.joinButton.teamLogos && match.joinButton.teamLogos.map((team: string, index: number) => {
                const logoSource = getTeamLogo(team);
                return (
                  <Image 
                    key={index} 
                    source={logoSource} 
                    style={[
                      styles.teamIcon,
                      index > 0 && styles.overlappingTeamIcon
                    ]} 
                  />
                );
              })}
            </View>
          )}
          <Text style={styles.joinButtonText}>{match.joinButton.text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../../assets/Rectangle 144.png')} 
        style={styles.topGradient}
        resizeMode="stretch"
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/Group 64 (1).png')} 
            style={styles.logoImage}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Active Lineup</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeLineup.map(renderMatch)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050614',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 240,
    height: 65,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  matchCard: {
    backgroundColor: '#121320',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  matchupText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#555555',
    padding: 12,
    marginBottom: 16,
  },
  playersContainer: {
    marginBottom: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  playerNameContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  playerFirstName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Avenir',
    textTransform: 'uppercase',
    lineHeight: 12,
  },
  playerLastName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  statContainer: {
    alignItems: 'flex-end',
  },
  statContent: {
    alignItems: 'flex-end',
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  arrowIcon: {
    marginRight: 4,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  statUnit: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  joinButton: {
    backgroundColor: '#8000FF',
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
    minWidth: 200,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenGIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  greenGText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  teamIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  teamIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 1,
    resizeMode: 'contain',
  },
  overlappingTeamIcon: {
    marginLeft: -8,
    marginTop: 2,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
});

export default Matches;
