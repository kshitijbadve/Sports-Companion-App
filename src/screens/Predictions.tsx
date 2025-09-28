import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReactions } from '../context/ReactionContext';
import { useMatch } from '../context/MatchContext';

const Predictions: React.FC = () => {
  const { currentMatch } = useMatch();
  const navigation = useNavigation();
  const [activeSubTab, setActiveSubTab] = useState('Game');
  const [selectedPollOptions, setSelectedPollOptions] = useState<{[pollId: string]: number}>({});
  const [liveParticipantCounts, setLiveParticipantCounts] = useState<{[pollId: string]: number}>({});
  const [liveComments, setLiveComments] = useState<{[pollId: string]: any[]}>({});
  const [commentInput, setCommentInput] = useState('');
  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [heldCommentId, setHeldCommentId] = useState<string | null>(null);
  const { getVoteCounts, getSelectedVotes, updateVoteCounts } = useReactions();

  // Save poll votes to AsyncStorage
  const savePollVotes = async (votes: {[pollId: string]: number}) => {
    try {
      await AsyncStorage.setItem('pollVotes', JSON.stringify(votes));
    } catch (error) {
      console.error('Error saving poll votes:', error);
    }
  };

  // Load poll votes from AsyncStorage
  const loadPollVotes = async () => {
    try {
      const savedVotes = await AsyncStorage.getItem('pollVotes');
      if (savedVotes) {
        setSelectedPollOptions(JSON.parse(savedVotes));
      }
    } catch (error) {
      console.error('Error loading poll votes:', error);
    }
  };

  // Sample comments for each poll with profile images - match specific
  const getSampleComments = () => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return {
        'poll-1': [
          { id: '1', user: 'madridfan', text: 'Real Madrid is going to score first! ⚽', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 30000 },
          { id: '2', user: 'kshitij', text: 'Mbappe is cooking today 🔥', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 25000 },
          { id: '3', user: 'barcafan', text: 'This is going to be a close game', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 20000 },
        ],
        'poll-2': [
          { id: '4', user: 'soccerfan', text: 'Yellow card incoming!', avatar: require('../../assets/user profile 8.png'), isOwn: false, timestamp: Date.now() - 15000 },
          { id: '5', user: 'kshitij', text: 'Corner kick coming up for sure', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 10000 },
        ],
        'poll-3': [
          { id: '6', user: 'madridfan', text: 'Lewandowski is due for a goal', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 5000 },
          { id: '7', user: 'barcafan', text: 'Mbappe has been careful so far', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 2000 },
        ]
      };
    } else if (currentMatch?.id === 'hawks-celtics') {
      return {
        'poll-1': [
          { id: '1', user: 'hawksfan', text: 'Hawks are going to score first! 🏀', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 30000 },
          { id: '2', user: 'kshitij', text: 'Trae Young is cooking today 🔥', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 25000 },
          { id: '3', user: 'celticsfan', text: 'This is going to be a close game', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 20000 },
        ],
        'poll-2': [
          { id: '4', user: 'parthdangi', text: 'Three-pointer incoming!', avatar: require('../../assets/user profile 8.png'), isOwn: false, timestamp: Date.now() - 15000 },
          { id: '5', user: 'kshitij', text: 'Slam dunk coming up for sure', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 10000 },
        ],
        'poll-3': [
          { id: '6', user: 'hawksfan', text: 'Tatum is due for a big game', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 5000 },
          { id: '7', user: 'celticsfan', text: 'Young has been careful so far', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 2000 },
        ]
      };
    } else {
      return {
        'poll-1': [
          { id: '1', user: 'jackdelinski', text: 'Cowboys are going to score first! 💪', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 30000 },
          { id: '2', user: 'kshitij', text: 'Jordan Love is cooking today 🔥', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 25000 },
          { id: '3', user: 'keneh5011', text: 'This is going to be a close game', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 20000 },
        ],
        'poll-2': [
          { id: '4', user: 'packersfan', text: '20+ yard pass incoming!', avatar: require('../../assets/user profile 8.png'), isOwn: false, timestamp: Date.now() - 15000 },
          { id: '5', user: 'kshitij', text: 'Sack coming up for sure', avatar: require('../../assets/user profile 6.png'), isOwn: true, timestamp: Date.now() - 10000 },
        ],
        'poll-3': [
          { id: '6', user: 'jackdelinski', text: 'Dak is due for an INT', avatar: require('../../assets/user profile 5.png'), isOwn: false, timestamp: Date.now() - 5000 },
          { id: '7', user: 'keneh5011', text: 'Love has been careful so far', avatar: require('../../assets/user profile 7.png'), isOwn: false, timestamp: Date.now() - 2000 },
        ]
      };
    }
  };

  const sampleComments = getSampleComments();

  // Load saved poll votes on component mount
  useEffect(() => {
    loadPollVotes();
  }, []);

  // Save poll votes whenever they change
  useEffect(() => {
    if (Object.keys(selectedPollOptions).length > 0) {
      savePollVotes(selectedPollOptions);
    }
  }, [selectedPollOptions]);

  // Initialize live participant counts and comments
  useEffect(() => {
    const initialCounts: {[pollId: string]: number} = {};
    const initialComments: {[pollId: string]: any[]} = {};
    livePolls.forEach(poll => {
      initialCounts[poll.id] = poll.participants;
      initialComments[poll.id] = sampleComments[poll.id as keyof typeof sampleComments] || [];
    });
    setLiveParticipantCounts(initialCounts);
    setLiveComments(initialComments);
  }, []);

  // Generate new live comments - match specific
  const generateNewComment = (pollId: string) => {
    const getPollComments = () => {
      if (currentMatch?.id === 'madrid-barcelona') {
        return {
          'poll-1': [
            'Real Madrid goal incoming! ⚽',
            'Barcelona will score first',
            'This game is intense!',
            'Corner kick coming up',
            'Defense is stepping up'
          ],
          'poll-2': [
            'Big moment coming!',
            'Yellow card incoming',
            'Foul time!',
            'Penalty alert!',
            'This is going to be huge'
          ],
          'poll-3': [
            'Lewandowski is due for a goal',
            'Mbappe has been careful',
            'Goal coming soon',
            'Neither player will score',
            'This is a defensive game'
          ]
        };
      } else if (currentMatch?.id === 'hawks-celtics') {
        return {
          'poll-1': [
            'Hawks three-pointer incoming! 🏀',
            'Celtics will score first',
            'This game is intense!',
            'Slam dunk coming up',
            'Defense is stepping up'
          ],
          'poll-2': [
            'Big play coming!',
            'Three-pointer incoming',
            'Steal time!',
            'Turnover alert!',
            'This is going to be huge'
          ],
          'poll-3': [
            'Tatum is due for a big game',
            'Young has been careful',
            'Big shot coming soon',
            'Neither player will dominate',
            'This is a defensive game'
          ]
        };
      } else {
        return {
          'poll-1': [
            'Cowboys TD incoming! 🏈',
            'Packers will score first',
            'This game is intense!',
            'Field goal coming up',
            'Defense is stepping up'
          ],
          'poll-2': [
            'Big play coming!',
            '20+ yard pass incoming',
            'Sack time!',
            'Turnover alert!',
            'This is going to be huge'
          ],
          'poll-3': [
            'Dak is due for a pick',
            'Love has been careful',
            'INT coming soon',
            'Neither QB will throw one',
            'This is a defensive game'
          ]
        };
      }
    };

    const pollComments = getPollComments();
    
    const getUsers = () => {
      if (currentMatch?.id === 'madrid-barcelona') {
        return [
          { name: 'madridfan', avatar: require('../../assets/user profile 5.png'), isOwn: false },
          { name: 'barcafan', avatar: require('../../assets/user profile 7.png'), isOwn: false },
          { name: 'soccerfan', avatar: require('../../assets/user profile 8.png'), isOwn: false }
        ];
      } else if (currentMatch?.id === 'hawks-celtics') {
        return [
          { name: 'hawksfan', avatar: require('../../assets/user profile 5.png'), isOwn: false },
          { name: 'celticsfan', avatar: require('../../assets/user profile 7.png'), isOwn: false },
          { name: 'parthdangi', avatar: require('../../assets/user profile 8.png'), isOwn: false }
        ];
      } else {
        return [
          { name: 'jackdelinski', avatar: require('../../assets/user profile 5.png'), isOwn: false },
          { name: 'keneh5011', avatar: require('../../assets/user profile 7.png'), isOwn: false },
          { name: 'packersfan', avatar: require('../../assets/user profile 8.png'), isOwn: false }
        ];
      }
    };

    const users = getUsers();
    const comments = pollComments[pollId as keyof typeof pollComments] || ['Great poll!'];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    return {
      id: Date.now().toString(),
      user: randomUser.name,
      text: comments[Math.floor(Math.random() * comments.length)],
      avatar: randomUser.avatar,
      isOwn: randomUser.isOwn,
      timestamp: Date.now()
    };
  };

  // Slowly increment participant counts and add comments
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveParticipantCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        Object.keys(newCounts).forEach(pollId => {
          // Random increment between 1-2 people (slower pace)
          const increment = Math.floor(Math.random() * 2) + 1;
          newCounts[pollId] += increment;
        });
        return newCounts;
      });

      // Add new comment to random poll
      setLiveComments(prevComments => {
        const newComments = { ...prevComments };
        const pollIds = Object.keys(newComments);
        const randomPollId = pollIds[Math.floor(Math.random() * pollIds.length)];
        
        if (randomPollId) {
          const newComment = generateNewComment(randomPollId);
          newComments[randomPollId] = [
            ...(newComments[randomPollId] || []),
            newComment
          ];
        }
        return newComments;
      });
    }, 5000); // Update every 5 seconds for more activity

    return () => clearInterval(interval);
  }, []);

  const handleSendComment = (pollId: string) => {
    if (commentInput.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: 'kshitij',
        text: commentInput.trim(),
        avatar: require('../../assets/user profile 6.png'),
        isOwn: true,
        timestamp: Date.now()
      };
      
      setLiveComments(prev => ({
        ...prev,
        [pollId]: [...(prev[pollId] || []), newComment]
      }));
      
      setCommentInput('');
    }
  };

  const handleDeleteComment = (pollId: string, commentId: string) => {
    setLiveComments(prev => ({
      ...prev,
      [pollId]: prev[pollId].filter(comment => comment.id !== commentId)
    }));
    setHeldCommentId(null);
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


  const getGamePredictions = () => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        {
          id: '1',
          team: 'Both Teams',
          teamName: 'Both Teams',
          teamLogos: ['madrid', 'barca'],
          prediction: 'Game ends in a draw',
          percentage: 28,
          likelihood: 'Unlikely',
          yesVotes: 456,
          noVotes: 320,
        },
        {
          id: '2',
          team: 'Real Madrid',
          teamName: 'Real Madrid',
          teamLogos: ['madrid'],
          prediction: 'Mbappe to score 2+ goals',
          percentage: 42,
          likelihood: 'Possible',
          yesVotes: 574,
          noVotes: 412,
        },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        {
          id: '1',
          team: 'Both Teams',
          teamName: 'Both Teams',
          teamLogos: ['hawks', 'celtics'],
          prediction: 'Game goes into overtime',
          percentage: 35,
          likelihood: 'Unlikely',
          yesVotes: 456,
          noVotes: 320,
        },
        {
          id: '2',
          team: 'Atlanta Hawks',
          teamName: 'Atlanta Hawks',
          teamLogos: ['hawks'],
          prediction: 'Trae Young to score 30+ points',
          percentage: 45,
          likelihood: 'Possible',
          yesVotes: 574,
          noVotes: 412,
        },
      ];
    } else {
      return [
        {
          id: '1',
          team: 'Both Teams',
          teamName: 'Both Teams',
          teamLogos: ['packers', 'cowboys'],
          prediction: 'Game goes into overtime',
          percentage: 33,
          likelihood: 'Unlikely',
          yesVotes: 546,
          noVotes: 220,
        },
        {
          id: '2',
          team: 'Green Bay Packers',
          teamName: 'Green Bay Packers',
          teamLogos: ['packers'],
          prediction: 'Jordan Love to get 150+ yards',
          percentage: 48,
          likelihood: 'Possible',
          yesVotes: 674,
          noVotes: 312,
        },
      ];
    }
  };

  const gamePredictions = getGamePredictions();

  const getParlayPredictions = () => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        {
          id: 'parlay-1',
          team: 'Real Madrid',
          teamName: 'Real Madrid',
          teamLogos: ['madrid'],
          player: 'Kylian Mbappe',
          stat: '1.5 Goals',
          percentage: 68,
          likelihood: 'Likely',
          yesVotes: 1274,
          noVotes: 612,
        },
        {
          id: 'parlay-2',
          team: 'Real Madrid',
          teamName: 'Real Madrid',
          teamLogos: ['madrid'],
          player: 'Kylian Mbappe',
          stat: '3.5 Shots',
          percentage: 52,
          likelihood: 'Possible',
          yesVotes: 892,
          noVotes: 456,
        },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        {
          id: 'parlay-2',
          team: 'Atlanta Hawks',
          teamName: 'Atlanta Hawks',
          teamLogos: ['hawks'],
          player: 'Trae Young',
          stat: '24 Points',
          percentage: 58,
          likelihood: 'Possible',
          yesVotes: 892,
          noVotes: 456,
        },
      ];
    } else {
      return [
        {
          id: 'parlay-1',
          team: 'Green Bay Packers',
          teamName: 'Green Bay Packers',
          teamLogos: ['packers'],
          player: 'Micah Parsons',
          stat: '0.5 Sacks',
          percentage: 76,
          likelihood: 'Likely',
          yesVotes: 1574,
          noVotes: 812,
        },
      ];
    }
  };

  const parlayPredictions = getParlayPredictions();

  const getLivePolls = () => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        {
          id: 'poll-1',
          question: 'Next goal?',
          participants: 15132,
          options: [
            { text: 'Real Madrid Goal', percentage: 45, isLeading: true, teamLogo: 'madrid' },
            { text: 'Barcelona Goal', percentage: 38, isLeading: false, teamLogo: 'barca' },
            { text: 'No Goal', percentage: 17, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-2',
          question: 'Next big moment?',
          participants: 16132,
          options: [
            { text: 'Yellow Card', percentage: 42, isLeading: true, teamLogo: 'both' },
            { text: 'Corner Kick', percentage: 35, isLeading: false, teamLogo: 'both' },
            { text: 'Penalty', percentage: 23, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-3',
          question: 'Who scores first?',
          participants: 18132,
          options: [
            { text: 'Mbappe', percentage: 48, isLeading: true, teamLogo: 'madrid' },
            { text: 'Lewandowski', percentage: 32, isLeading: false, teamLogo: 'barca' },
            { text: 'Other Player', percentage: 20, isLeading: false, teamLogo: 'both' },
          ],
        },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        {
          id: 'poll-1',
          question: 'Next score?',
          participants: 12132,
          options: [
            { text: 'Hawks 3PT', percentage: 35, isLeading: false, teamLogo: 'hawks' },
            { text: 'Celtics 3PT', percentage: 42, isLeading: true, teamLogo: 'celtics' },
            { text: 'Free Throw', percentage: 18, isLeading: false, teamLogo: 'both' },
            { text: 'Layup/Dunk', percentage: 5, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-2',
          question: 'Next big play?',
          participants: 14132,
          options: [
            { text: 'Steal', percentage: 38, isLeading: true, teamLogo: 'both' },
            { text: 'Block', percentage: 32, isLeading: false, teamLogo: 'both' },
            { text: 'Assist', percentage: 30, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-3',
          question: 'Who scores first?',
          participants: 16132,
          options: [
            { text: 'Trae Young', percentage: 45, isLeading: true, teamLogo: 'hawks' },
            { text: 'Jayson Tatum', percentage: 38, isLeading: false, teamLogo: 'celtics' },
            { text: 'Other Player', percentage: 17, isLeading: false, teamLogo: 'both' },
          ],
        },
      ];
    } else {
      return [
        {
          id: 'poll-1',
          question: 'Next score?',
          participants: 12132,
          options: [
            { text: 'Cowboys TD', percentage: 31, isLeading: false, teamLogo: 'cowboys' },
            { text: 'Packers TD', percentage: 47, isLeading: true, teamLogo: 'packers' },
            { text: 'Field Goal', percentage: 16, isLeading: false, teamLogo: 'both' },
            { text: 'Defense/ST', percentage: 6, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-2',
          question: 'Next big play?',
          participants: 14132,
          options: [
            { text: '20+ yard pass', percentage: 52, isLeading: true, teamLogo: 'both' },
            { text: 'Sack/TFL', percentage: 34, isLeading: false, teamLogo: 'both' },
            { text: 'Turnover', percentage: 14, isLeading: false, teamLogo: 'both' },
          ],
        },
        {
          id: 'poll-3',
          question: 'Who throws first INT?',
          participants: 16132,
          options: [
            { text: 'Dak Prescott', percentage: 21, isLeading: false, teamLogo: 'cowboys' },
            { text: 'Jordan Love', percentage: 35, isLeading: false, teamLogo: 'packers' },
            { text: 'None in Q1', percentage: 44, isLeading: true, teamLogo: 'both' },
          ],
        },
      ];
    }
  };

  const livePolls = getLivePolls();

  const renderGamePrediction = (prediction: any) => {
    const counts = getVoteCounts(prediction.id, prediction.yesVotes, prediction.noVotes);
    const selections = getSelectedVotes(prediction.id);

    return (
      <View key={prediction.id} style={styles.predictionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogosContainer}>
              {prediction.teamLogos.map((team: string, index: number) => (
                <Image 
                  key={index}
                  source={getTeamLogo(team)} 
                  style={[
                    styles.teamLogo,
                    index === 1 && team === 'barca' ? styles.barcaLogoOffset : null
                  ]} 
                />
              ))}
            </View>
            <Text style={styles.teamName}>{prediction.teamName}</Text>
          </View>
        </View>
        <View style={styles.predictionContent}>
          <View style={styles.predictionBox}>
            <View style={styles.predictionTitleRow}>
              <Text style={styles.predictionText}>{prediction.prediction}</Text>
              <Text style={styles.percentage}>{prediction.percentage}%</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${prediction.percentage}%` }]} />
              </View>
              <Text style={styles.likelihood}>{prediction.likelihood}</Text>
            </View>
          </View>
        </View>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            style={[
              styles.voteItem,
              selections.yes && styles.voteItemSelected
            ]}
            onPress={() => updateVoteCounts(prediction.id, 'yes', prediction.yesVotes, prediction.noVotes)}
          >
            <Text style={styles.emojiIcon}>✅</Text>
            <Text style={styles.voteCount}>{counts.yes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.voteItem,
              selections.no && styles.voteItemSelected
            ]}
            onPress={() => updateVoteCounts(prediction.id, 'no', prediction.yesVotes, prediction.noVotes)}
          >
            <Text style={styles.emojiIcon}>👎</Text>
            <Text style={styles.voteCount}>{counts.no}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderParlayPrediction = (prediction: any) => {
    const counts = getVoteCounts(prediction.id, prediction.yesVotes, prediction.noVotes);
    const selections = getSelectedVotes(prediction.id);

    return (
      <View key={prediction.id} style={styles.predictionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogosContainer}>
              {prediction.teamLogos.map((team: string, index: number) => (
                <Image 
                  key={index}
                  source={getTeamLogo(team)} 
                  style={styles.teamLogo} 
                />
              ))}
            </View>
            <Text style={styles.teamName}>{prediction.teamName}</Text>
          </View>
        </View>
        <View style={styles.predictionContent}>
          <View style={styles.predictionBox}>
            <View style={styles.predictionTitleRow}>
              <View style={styles.playerNameContainer}>
                {prediction.player === 'Micah Parsons' && (
                  <Image 
                    source={require('../../assets/parsons.png')} 
                    style={styles.playerImage} 
                  />
                )}
                <Text style={styles.playerName}>{prediction.player}</Text>
              </View>
              <View style={styles.statContainer}>
                <Ionicons 
                  name={prediction.stat === "1.5 Goals" || prediction.stat === "24 Points" ? "arrow-down" : "arrow-up"} 
                  size={16} 
                  color="#FFFFFF" 
                  style={styles.arrowIcon} 
                />
                <Text style={styles.statText}>{prediction.stat}</Text>
              </View>
              <Text style={[styles.percentage, { color: '#6DFF01' }]}>{prediction.percentage}%</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${prediction.percentage}%` }]} />
              </View>
              <Text style={styles.likelihood}>{prediction.likelihood}</Text>
            </View>
          </View>
        </View>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            style={[
              styles.voteItem,
              selections.yes && styles.voteItemSelected
            ]}
            onPress={() => updateVoteCounts(prediction.id, 'yes', prediction.yesVotes, prediction.noVotes)}
          >
            <Text style={styles.emojiIcon}>✅</Text>
            <Text style={styles.voteCount}>{counts.yes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.voteItem,
              selections.no && styles.voteItemSelected
            ]}
            onPress={() => updateVoteCounts(prediction.id, 'no', prediction.yesVotes, prediction.noVotes)}
          >
            <Text style={styles.emojiIcon}>👎</Text>
            <Text style={styles.voteCount}>{counts.no}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPoll = (poll: any) => {
    const selectedOption = selectedPollOptions[poll.id];
    const currentCount = liveParticipantCounts[poll.id] || poll.participants;
    const pollComments = liveComments[poll.id] || [];
    
    return (
      <View key={poll.id} style={styles.pollCard} onTouchStart={() => setActivePollId(poll.id)}>
        <View style={styles.pollHeader}>
          <Text style={styles.pollQuestion}>{poll.question}</Text>
          <View style={styles.participantCount}>
            <Ionicons name="people" size={16} color="#9CA3AF" />
            <Text style={styles.participantText}>{currentCount.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.pollOptions}>
          {poll.options.map((option: any, index: number) => {
            const isSelected = selectedOption === index;
            return (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.pollOption,
                  isSelected && styles.pollOptionSelected
                ]}
                onPress={() => {
                  setSelectedPollOptions(prev => ({
                    ...prev,
                    [poll.id]: isSelected ? -1 : index
                  }));
                }}
              >
                <View style={styles.pollOptionContent}>
                  <View style={styles.pollOptionTextContainer}>
                    {option.teamLogo && option.teamLogo !== 'both' && (
                      <Image 
                        source={getTeamLogo(option.teamLogo)} 
                        style={styles.pollTeamLogo} 
                      />
                    )}
                    {option.teamLogo === 'both' && (
                      <View style={styles.overlappingLogosContainer}>
                        <Image 
                          source={getTeamLogo(
                            currentMatch?.id === 'madrid-barcelona' ? 'madrid' : 
                            currentMatch?.id === 'hawks-celtics' ? 'hawks' : 'packers'
                          )} 
                          style={[styles.pollTeamLogo, styles.overlappingLogoBack]} 
                        />
                        <Image 
                          source={getTeamLogo(
                            currentMatch?.id === 'madrid-barcelona' ? 'barca' : 
                            currentMatch?.id === 'hawks-celtics' ? 'celtics' : 'cowboys'
                          )} 
                          style={[styles.pollTeamLogo, styles.overlappingLogoFront]} 
                        />
                      </View>
                    )}
                    <Text style={styles.pollOptionText}>
                      {option.text}
                    </Text>
                  </View>
                  <Text style={[
                    styles.pollPercentage,
                    option.isLeading && styles.pollPercentageLeading
                  ]}>
                    {option.percentage}%
                  </Text>
                </View>
                <View style={styles.pollProgressBar}>
                  <View 
                    style={[
                      styles.pollProgressFill, 
                      { width: `${option.percentage}%` }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Live Comments */}
        <View style={styles.commentsContainer}>
          <View style={styles.commentsHeader}>
            <Ionicons name="chatbubbles" size={14} color="#9CA3AF" />
            <Text style={styles.commentsTitle}>Comments</Text>
          </View>
          
          <ScrollView 
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onTouchStart={() => setHeldCommentId(null)}
          >
            {pollComments.slice(-10).map((comment: any) => (
              <View key={comment.id} style={styles.chatMessageWrapper}>
                {!comment.isOwn ? (
                  <Text style={styles.messageUserName}>{comment.user}</Text>
                ) : (
                  <Text style={styles.messageUserNameRight}>you</Text>
                )}
                {comment.isOwn ? (
                  <TouchableOpacity 
                    style={styles.ownMessageContainer}
                    onLongPress={() => setHeldCommentId(comment.id)}
                    delayLongPress={500}
                  >
                    {heldCommentId === comment.id && (
                      <TouchableOpacity 
                        style={styles.trashIconContainer}
                        onPress={() => handleDeleteComment(poll.id, comment.id)}
                      >
                        <Ionicons name="trash" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                    <View style={[
                      styles.messageBubble,
                      styles.ownMessage
                    ]}>
                      <Text style={styles.messageText}>{comment.text}</Text>
                    </View>
                    <Image 
                      source={comment.avatar} 
                      style={styles.chatAvatarRight}
                      fadeDuration={0}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.chatMessageContainer}>
                    <Image 
                      source={comment.avatar} 
                      style={styles.chatAvatar}
                      fadeDuration={0}
                      resizeMode="cover"
                    />
                    <View style={[
                      styles.messageBubble,
                      styles.otherMessage
                    ]}>
                      <Text style={styles.messageText}>{comment.text}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          
          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="comment..."
              placeholderTextColor="#9CA3AF"
              value={commentInput}
              onChangeText={setCommentInput}
              onSubmitEditing={() => handleSendComment(poll.id)}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={() => handleSendComment(poll.id)}
            >
              <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
      <View style={styles.content}>
        {/* Sub Tab Navigation */}
        <View style={styles.subTabContainer}>
          <TouchableOpacity 
            style={[styles.subTab, activeSubTab === 'Game' && styles.activeSubTab]}
            onPress={() => setActiveSubTab('Game')}
          >
            <Text style={[styles.subTabText, activeSubTab === 'Game' && styles.activeSubTabText]}>
              Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.subTab, activeSubTab === 'Polls' && styles.activeSubTab]}
            onPress={() => setActiveSubTab('Polls')}
          >
            <Text style={[styles.subTabText, activeSubTab === 'Polls' && styles.activeSubTabText]}>
              Polls
            </Text>
          </TouchableOpacity>
        </View>

        {activeSubTab === 'Game' && (
          <>
            {/* Game Predictions Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.liveIndicator} />
                <Text style={styles.sectionTitle}>Game Predictions</Text>
              </View>
              {gamePredictions.map(renderGamePrediction)}
            </View>

            {/* Your Parlay Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.liveIndicator} />
                <Text style={styles.sectionTitle}>Your Parlay</Text>
              </View>
              {parlayPredictions.map(renderParlayPrediction)}
            </View>
          </>
        )}

        {activeSubTab === 'Polls' && (
          <>
            {/* Live Polls Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.liveIndicator} />
                <Text style={styles.sectionTitle}>Live Polls</Text>
                <View style={styles.refreshContainer}>
                  <Text style={styles.refreshText}>These polls refresh every few minutes</Text>
                  <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>
              {livePolls.map(renderPoll)}
            </View>
          </>
        )}
      </View>
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
    paddingBottom: 15,
  },
  content: {
    padding: 16,
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#121320',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  subTab: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeSubTab: {
    backgroundColor: '#1f202d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  subTabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  activeSubTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6DFF01',
    marginRight: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  predictionCard: {
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionContent: {
    marginBottom: 16,
  },
  predictionBox: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  predictionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamLogosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  teamLogo: {
    width: 28,
    height: 28,
    marginRight: -12,
    resizeMode: 'contain',
  },
  barcaLogoOffset: {
    marginTop: 4,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  teamIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  predictionInfo: {
    flex: 1,
  },
  predictionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
    lineHeight: 22,
    flex: 1,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  playerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginLeft: -30,
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8000FF',
    borderRadius: 3,
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  percentageGreen: {
    color: '#10B981',
  },
  likelihood: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Avenir',
    fontStyle: 'italic',
  },
  voteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
  },
  voteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1f202d',
    borderRadius: 20,
    marginRight: 12,
  },
  voteItemSelected: {
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#8000FF',
  },
  emojiIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  voteCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginLeft: 2,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Avenir',
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  refreshText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Avenir',
    marginRight: 8,
  },
  refreshButton: {
    padding: 4,
  },
  pollCard: {
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pollQuestion: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
    flex: 1,
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Avenir',
    marginLeft: 4,
  },
  pollOptions: {
    gap: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#3A3A3A',
  },
  pollOption: {
    backgroundColor: '#1f202d',
    borderRadius: 65,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  pollOptionSelected: {
    borderWidth: 2,
    borderColor: '#8000FF',
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pollTeamLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  overlappingLogosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    position: 'relative',
    width: 20,
    height: 20,
  },
  overlappingLogoBack: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    marginRight: 0,
    width: 16,
    height: 16,
  },
  overlappingLogoFront: {
    position: 'absolute',
    left: 8,
    top: 1,
    zIndex: 2,
    marginRight: 0,
    width: 16,
    height: 16,
  },
  pollOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  pollPercentage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  pollPercentageLeading: {
    color: '#6DFF01',
  },
  pollProgressBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pollProgressFill: {
    height: '100%',
    backgroundColor: '#8000FF',
    borderRadius: 3,
  },
  commentsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#3A3A3A',
    maxHeight: 200,
  },
  commentsList: {
    maxHeight: 200,
    marginBottom: 12,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginLeft: 6,
  },
  chatMessageWrapper: {
    marginBottom: 8,
  },
  messageUserName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 2,
    marginLeft: 32,
  },
  messageUserNameRight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 2,
    marginRight: 32,
    textAlign: 'right',
  },
  chatMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chatAvatarRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ownMessage: {
    backgroundColor: '#8000FF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1f202d',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.25,
    borderColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Avenir',
    paddingVertical: 4,
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
  trashIconContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginRight: 8,
    alignSelf: 'center',
  },
});

export default Predictions;
