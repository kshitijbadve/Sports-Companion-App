import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMatch } from '../context/MatchContext';

interface Participant {
  id: string;
  name: string;
  avatar: any;
  isYou?: boolean;
  team: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  avatar: any;
  isOwn?: boolean;
}

interface WatchPartyProps {
  pollResults: { jordan: number; dak: number };
  setPollResults: (results: { jordan: number; dak: number }) => void;
  hasVoted: boolean;
  setHasVoted: (voted: boolean) => void;
  userVote: string | null;
  setUserVote: (vote: string | null) => void;
}

const WatchParty: React.FC<WatchPartyProps> = ({
  pollResults,
  setPollResults,
  hasVoted,
  setHasVoted,
  userVote,
  setUserVote,
}) => {
  const { currentMatch } = useMatch();
  const navigation = useNavigation();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInWatchParty, setIsInWatchParty] = useState(true);
  
  // Mock users for search - match specific
  const getAvailableUsers = () => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        { id: '5', name: 'soccerfan23', avatar: require('../../assets/user profile 5.png'), team: 'madrid' },
        { id: '6', name: 'barcanation', avatar: require('../../assets/user profile 6.png'), team: 'barcelona' },
        { id: '7', name: 'madrid4life', avatar: require('../../assets/user profile 7.png'), team: 'madrid' },
        { id: '8', name: 'barcafan', avatar: require('../../assets/user profile 8.png'), team: 'barcelona' },
        { id: '9', name: 'laligafan2024', avatar: require('../../assets/user profile 5.png'), team: 'madrid' },
        { id: '10', name: 'sportslover', avatar: require('../../assets/user profile 6.png'), team: 'barcelona' },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        { id: '5', name: 'hawksfan23', avatar: require('../../assets/user profile 5.png'), team: 'hawks' },
        { id: '6', name: 'celticsnation', avatar: require('../../assets/user profile 6.png'), team: 'celtics' },
        { id: '7', name: 'hawks4life', avatar: require('../../assets/user profile 7.png'), team: 'hawks' },
        { id: '8', name: 'parthdangi', avatar: require('../../assets/user profile 8.png'), team: 'celtics' },
        { id: '9', name: 'nbafan2024', avatar: require('../../assets/user profile 5.png'), team: 'hawks' },
        { id: '10', name: 'sportslover', avatar: require('../../assets/user profile 6.png'), team: 'celtics' },
      ];
    } else {
      return [
        { id: '5', name: 'footballfan23', avatar: require('../../assets/user profile 5.png'), team: 'cowboys' },
        { id: '6', name: 'packersnation', avatar: require('../../assets/user profile 6.png'), team: 'packers' },
        { id: '7', name: 'cowboys4life', avatar: require('../../assets/user profile 7.png'), team: 'cowboys' },
        { id: '8', name: 'greenbayfan', avatar: require('../../assets/user profile 8.png'), team: 'packers' },
        { id: '9', name: 'nflfan2024', avatar: require('../../assets/user profile 5.png'), team: 'cowboys' },
        { id: '10', name: 'sportslover', avatar: require('../../assets/user profile 6.png'), team: 'packers' },
      ];
    }
  };

  const [availableUsers] = useState(getAvailableUsers());
  
  const getParticipants = (): Participant[] => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        { id: '1', name: 'azibrana', avatar: require('../../assets/user profile 5.png'), isYou: false, team: 'madrid' },
        { id: '2', name: 'kshitij', avatar: require('../../assets/user profile 6.png'), isYou: true, team: 'madrid' },
        { id: '3', name: 'nick102', avatar: require('../../assets/user profile 7.png'), isYou: false, team: 'barcelona' },
        { id: '4', name: 'madridfan', avatar: require('../../assets/user profile 8.png'), isYou: false, team: 'madrid' },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        { id: '1', name: 'hawksfan', avatar: require('../../assets/user profile 5.png'), isYou: false, team: 'hawks' },
        { id: '2', name: 'kshitij', avatar: require('../../assets/user profile 6.png'), isYou: true, team: 'hawks' },
        { id: '4', name: 'parthdangi', avatar: require('../../assets/user profile 8.png'), isYou: false, team: 'celtics' },
      ];
    } else {
      return [
        { id: '1', name: 'jackdelinski', avatar: require('../../assets/user profile 5.png'), isYou: false, team: 'cowboys' },
        { id: '2', name: 'kshitij', avatar: require('../../assets/user profile 6.png'), isYou: true, team: 'packers' },
        { id: '3', name: 'keneh5011', avatar: require('../../assets/user profile 7.png'), isYou: false, team: 'cowboys' },
        { id: '4', name: 'packersfan', avatar: require('../../assets/user profile 8.png'), isYou: false, team: 'packers' },
      ];
    }
  };

  const [participants] = useState<Participant[]>(getParticipants());

  const totalVoters = 3; // Number of people in the watch party

  const getChatMessages = (): ChatMessage[] => {
    if (currentMatch?.id === 'madrid-barcelona') {
      return [
        { id: '1', user: 'azibrana', message: 'what a goal', avatar: require('../../assets/user profile 5.png'), isOwn: false },
        { id: '2', user: 'kshitij', message: 'yeah great play', avatar: require('../../assets/user profile 6.png'), isOwn: true },
        { id: '3', user: 'nick102', message: "can't believe he made that", avatar: require('../../assets/user profile 7.png'), isOwn: false },
        { id: '4', user: 'madridfan', message: 'fr bruh', avatar: require('../../assets/user profile 8.png'), isOwn: false },
      ];
    } else if (currentMatch?.id === 'hawks-celtics') {
      return [
        { id: '1', user: 'hawksfan', message: 'what a three pointer', avatar: require('../../assets/user profile 5.png'), isOwn: false },
        { id: '2', user: 'kshitij', message: 'yeah great shot', avatar: require('../../assets/user profile 6.png'), isOwn: true },
        { id: '4', user: 'parthdangi', message: 'fr bruh', avatar: require('../../assets/user profile 8.png'), isOwn: false },
      ];
    } else {
      return [
        { id: '1', user: 'jackdelinski', message: 'what a touchdown', avatar: require('../../assets/user profile 5.png'), isOwn: false },
        { id: '2', user: 'kshitij', message: 'yeah great play', avatar: require('../../assets/user profile 6.png'), isOwn: true },
        { id: '3', user: 'keneh5011', message: "can't believe he made that", avatar: require('../../assets/user profile 7.png'), isOwn: false },
        { id: '4', user: 'packersfan', message: 'fr bruh', avatar: require('../../assets/user profile 8.png'), isOwn: false },
      ];
    }
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(getChatMessages());

  const [chatInput, setChatInput] = useState('');
  const [heldMessageId, setHeldMessageId] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'kshitij',
        message: chatInput.trim(),
        avatar: require('../../assets/user profile 6.png'),
        isOwn: true,
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
    }
  };

  const handleInviteUser = (user: any) => {
    console.log('Inviting user:', user.name);
    setShowInviteModal(false);
    setSearchQuery('');
    // Here you would typically send an invite notification
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteMessage = (messageId: string) => {
    setChatMessages(prev => prev.filter(message => message.id !== messageId));
    setHeldMessageId(null);
  };

  const handleVote = (option: 'jordan' | 'dak') => {
    if (hasVoted && userVote === option) {
      // Unvote - remove your vote
      setHasVoted(false);
      setUserVote(null);
      
      // Remove your vote
      if (option === 'jordan') {
        setPollResults(prev => ({ jordan: Math.max(0, prev.jordan - 1), dak: prev.dak }));
      } else {
        setPollResults(prev => ({ jordan: prev.jordan, dak: Math.max(0, prev.dak - 1) }));
      }
    } else if (!hasVoted) {
      // New vote
      setHasVoted(true);
      setUserVote(option);
      
      // Add your vote
      if (option === 'jordan') {
        setPollResults(prev => ({ jordan: prev.jordan + 1, dak: prev.dak }));
      } else {
        setPollResults(prev => ({ jordan: prev.jordan, dak: prev.dak + 1 }));
      }
    } else if (hasVoted && userVote !== option) {
      // Switch vote
      const previousVote = userVote;
      setUserVote(option);
      
      // Remove previous vote and add new vote
      if (previousVote === 'jordan') {
        setPollResults(prev => ({ jordan: Math.max(0, prev.jordan - 1), dak: prev.dak + 1 }));
      } else {
        setPollResults(prev => ({ jordan: prev.jordan + 1, dak: Math.max(0, prev.dak - 1) }));
      }
    }
  };

  const renderParticipant = (participant: Participant, index: number) => {
    const getTeamLogo = (team: string) => {
      if (team === 'cowboys') {
        return require('../../assets/cowboys-logo.png');
      } else if (team === 'packers') {
        return require('../../assets/packers-logo.png');
      } else if (team === 'hawks') {
        return require('../../assets/hawks.png');
      } else if (team === 'celtics') {
        return require('../../assets/celtics.png');
      } else if (team === 'madrid') {
        return require('../../assets/madrid.png');
      } else if (team === 'barcelona') {
        return require('../../assets/barca.webp');
      }
      return require('../../assets/packers-logo.png'); // fallback
    };

    const teamLogo = getTeamLogo(participant.team);
    
    return (
      <View key={participant.id} style={styles.participantItem}>
        <Image 
          source={participant.avatar} 
          style={styles.avatar}
          fadeDuration={0}
          resizeMode="cover"
        />
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>
            {participant.name} {participant.isYou && <Text style={styles.youText}>(you)</Text>}
          </Text>
          <Image 
            source={teamLogo} 
            style={styles.teamLogoSmall}
            fadeDuration={0}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  const renderChatMessage = (message: ChatMessage, index: number) => {
    return (
      <View key={message.id} style={styles.chatMessageWrapper}>
        {!message.isOwn ? (
          <Text style={styles.messageUserName}>{message.user}</Text>
        ) : (
          <Text style={styles.messageUserNameRight}>you</Text>
        )}
        {message.isOwn ? (
          <TouchableOpacity 
            style={styles.ownMessageContainer}
            onLongPress={() => setHeldMessageId(message.id)}
            delayLongPress={500}
          >
            {heldMessageId === message.id && (
              <TouchableOpacity 
                style={styles.trashIconContainer}
                onPress={() => handleDeleteMessage(message.id)}
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
              </TouchableOpacity>
            )}
            <View style={[
              styles.messageBubble,
              styles.ownMessage
            ]}>
              <Text style={styles.messageText}>{message.message}</Text>
            </View>
            <Image 
              source={message.avatar} 
              style={styles.chatAvatarRight}
              fadeDuration={0}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.chatMessageContainer}>
            <Image 
              source={message.avatar} 
              style={styles.chatAvatar}
              fadeDuration={0}
              resizeMode="cover"
            />
            <View style={[
              styles.messageBubble,
              styles.otherMessage
            ]}>
              <Text style={styles.messageText}>{message.message}</Text>
            </View>
          </View>
        )}
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

  if (!isInWatchParty) {
    return (
      <View style={styles.container}>
        <View style={styles.invitationContainer}>
          <View style={styles.invitationHeader}>
            <Ionicons name="people" size={48} color="#FFFFFF" />
            <Text style={styles.invitationTitle}>You're invited to a Watch Party</Text>
            <Text style={styles.invitationDescription}>
              Join the live watch party to interact with your friends
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => setIsInWatchParty(true)}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Participants Card */}
          <View style={[styles.card, styles.participantsCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Active Viewers</Text>
              <Text style={styles.participantCount}>3</Text>
            </View>
            <View style={styles.participantsListBox}>
              <View style={styles.participantsList}>
                {participants.map((participant, index) => renderParticipant(participant, index))}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.inviteButton}
                onPress={() => setShowInviteModal(true)}
              >
                <Ionicons name="mail-outline" size={16} color="#FFFFFF" style={styles.inviteIcon} />
                <Text style={styles.inviteButtonText}>Invite</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.leaveButton}
                onPress={() => {
                  setIsInWatchParty(false);
                }}
              >
                <Ionicons name="exit-outline" size={16} color="#FFFFFF" style={styles.leaveIcon} />
                <Text style={styles.leaveButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Poll Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.liveIndicator} />
              <Text style={styles.cardTitle}>Live Poll</Text>
            </View>
            <View style={styles.pollContainer}>
              <Text style={styles.pollQuestion}>
                {currentMatch?.id === 'madrid-barcelona' 
                  ? 'Which player will score more goals?' 
                  : currentMatch?.id === 'hawks-celtics'
                  ? 'Which player will score more points?'
                  : 'Which QB will have more Passing Yards?'
                }
              </Text>
              
              <View style={styles.pollOptions}>
                <View style={styles.pollOption}>
                  <Text style={styles.optionNumber}>1</Text>
                  <View style={styles.optionContent}>
                    <View style={styles.playerInfo}>
                      <Image 
                        source={currentMatch?.id === 'madrid-barcelona' 
                          ? require('../../assets/mbappe.png') 
                          : currentMatch?.id === 'hawks-celtics'
                          ? require('../../assets/young.webp')
                          : require('../../assets/jordan.png')
                        } 
                        style={styles.playerAvatar} 
                      />
                      <View style={styles.playerNameContainer}>
                        <Text style={styles.playerNameSmall}>
                          {currentMatch?.id === 'madrid-barcelona' ? 'KYLIAN' : currentMatch?.id === 'hawks-celtics' ? 'TRAE' : 'JORDAN'}
                        </Text>
                        <Text style={styles.playerNameLarge}>
                          {currentMatch?.id === 'madrid-barcelona' ? 'Mbappe' : currentMatch?.id === 'hawks-celtics' ? 'Young' : 'Love'}
                        </Text>
                      </View>
                    </View>
                    <Text style={Math.round((pollResults.jordan / totalVoters) * 100) > 50 ? styles.percentage : styles.percentageWhite}>
                      {Math.round((pollResults.jordan / totalVoters) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[
                      currentMatch?.id === 'madrid-barcelona' ? styles.progressFillGreen : 
                      currentMatch?.id === 'hawks-celtics' ? styles.progressFillHawksBlack : 
                      styles.progressFillPackersGreen, 
                      { width: `${(pollResults.jordan / totalVoters) * 100}%` }
                    ]} />
                    <View style={[
                      currentMatch?.id === 'madrid-barcelona' ? styles.progressFillBlue : 
                      currentMatch?.id === 'hawks-celtics' ? styles.progressFillHawksGreen : 
                      styles.progressFillPackersBlue, 
                      { width: `${(pollResults.dak / totalVoters) * 100}%` }
                    ]} />
                  </View>
                </View>

                <View style={styles.pollOption}>
                  <Text style={styles.optionNumber}>2</Text>
                  <View style={styles.optionContent}>
                    <View style={styles.playerInfo}>
                      <Image 
                        source={currentMatch?.id === 'madrid-barcelona' 
                          ? require('../../assets/yamal.png') 
                          : currentMatch?.id === 'hawks-celtics'
                          ? require('../../assets/jordan.png')
                          : require('../../assets/dak.png')
                        } 
                        style={styles.playerAvatar} 
                      />
                      <View style={styles.playerNameContainer}>
                        <Text style={styles.playerNameSmall}>
                          {currentMatch?.id === 'madrid-barcelona' ? 'LAMINE' : currentMatch?.id === 'hawks-celtics' ? 'JAYSON' : 'DAK'}
                        </Text>
                        <Text style={styles.playerNameLarge}>
                          {currentMatch?.id === 'madrid-barcelona' ? 'Yamal' : currentMatch?.id === 'hawks-celtics' ? 'Tatum' : 'Prescott'}
                        </Text>
                      </View>
                    </View>
                    <Text style={Math.round((pollResults.dak / totalVoters) * 100) > 50 ? styles.percentage : styles.percentageWhite}>
                      {Math.round((pollResults.dak / totalVoters) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[
                      currentMatch?.id === 'madrid-barcelona' ? styles.progressFillBlue : 
                      currentMatch?.id === 'hawks-celtics' ? styles.progressFillHawksGreen : 
                      styles.progressFillPackersBlue, 
                      { width: `${(pollResults.dak / totalVoters) * 100}%` }
                    ]} />
                    <View style={[
                      currentMatch?.id === 'madrid-barcelona' ? styles.progressFillGreen : 
                      currentMatch?.id === 'hawks-celtics' ? styles.progressFillHawksBlack : 
                      styles.progressFillPackersGreen, 
                      { width: `${(pollResults.jordan / totalVoters) * 100}%` }
                    ]} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.pollButtons}>
              <TouchableOpacity 
                style={[
                  styles.pollButton,
                  hasVoted && userVote === 'jordan' && styles.votedButton
                ]}
                onPress={() => handleVote('jordan')}
              >
                <Image 
                  source={currentMatch?.id === 'madrid-barcelona' 
                    ? require('../../assets/madrid.png') 
                    : currentMatch?.id === 'hawks-celtics'
                    ? require('../../assets/hawks.png')
                    : require('../../assets/packers-logo.png')
                  } 
                  style={styles.teamLogo} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.pollButton,
                  hasVoted && userVote === 'dak' && styles.votedButton
                ]}
                onPress={() => handleVote('dak')}
              >
                <Image 
                  source={currentMatch?.id === 'madrid-barcelona' 
                    ? require('../../assets/barca.webp') 
                    : currentMatch?.id === 'hawks-celtics'
                    ? require('../../assets/celtics.png')
                    : require('../../assets/cowboys-logo.png')
                  } 
                  style={styles.teamLogo} 
                />
              </TouchableOpacity>
            </View>
          </View>

        {/* Live Chat Card */}
        <View style={styles.chatCard}>
          <View style={styles.cardHeader}>
            <View style={styles.liveIndicator} />
            <Text style={styles.cardTitle}>Live Chat</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.chatMessagesBox}
            activeOpacity={1}
            onPress={() => setHeldMessageId(null)}
          >
            <View style={styles.chatMessages}>
              {chatMessages.map((message, index) => renderChatMessage(message, index))}
            </View>
          </TouchableOpacity>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="chat here..."
              placeholderTextColor="#9CA3AF"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>

    {/* Invite Modal */}
    <Modal
      visible={showInviteModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Invite Users</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowInviteModal(false)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Text style={styles.suggestedTitle}>Suggested</Text>
        
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.userItem}
              onPress={() => handleInviteUser(item)}
            >
              <Image source={item.avatar} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userTeam}>{item.team.charAt(0).toUpperCase() + item.team.slice(1)}</Text>
              </View>
              <TouchableOpacity style={styles.inviteUserButton}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          style={styles.usersList}
        />
      </View>
    </Modal>
    </>
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
    paddingBottom: 30,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  participantsCard: {
    paddingLeft: 24,
  },
  chatCard: {
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
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
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  participantCount: {
    color: '#6DFF01',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginLeft: 8,
  },
  participantsListBox: {
    borderWidth: 0.5,
    borderColor: '#555555',
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginBottom: 12,
    padding: 12,
    marginLeft: -4,
    marginRight: 4,
  },
  participantsList: {
    marginBottom: 0,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 8,
  },
  participantName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    flex: 1,
  },
  teamLogoSmall: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  youText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: -8,
  },
  inviteButton: {
    backgroundColor: '#1f202d',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 140,
    marginRight: 8,
  },
  inviteIcon: {
    marginRight: 8,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  leaveButton: {
    backgroundColor: '#1f202d',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  leaveIcon: {
    marginRight: 8,
  },
  leaveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  pollContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  pollQuestion: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    maxWidth: 200,
    alignSelf: 'center',
  },
  pollOptions: {
    marginBottom: 0,
  },
  pollOption: {
    marginBottom: 20,
  },
  optionNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#555555',
  },
  playerNameContainer: {
    flexDirection: 'column',
  },
  playerNameSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  playerNameLarge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  percentage: {
    color: '#6DFF01',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  percentageWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressFillGreen: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressFillBlue: {
    height: '100%',
    backgroundColor: '#A50044',
  },
  progressFillPackersGreen: {
    height: '100%',
    backgroundColor: '#203731',
  },
  progressFillPackersBlue: {
    height: '100%',
    backgroundColor: '#041E42',
  },
  progressFillHawksGreen: {
    height: '100%',
    backgroundColor: '#007A33',
  },
  progressFillHawksBlack: {
    height: '100%',
    backgroundColor: '#000000',
  },
  pollButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pollButton: {
    backgroundColor: '#1f202d',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  pollButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  teamLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  votedButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8000FF',
  },
  chatMessages: {
    marginBottom: 16,
  },
  chatMessagesBox: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  chatMessageWrapper: {
    marginBottom: 12,
  },
  messageUserName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 4,
    marginLeft: 40,
  },
  messageUserNameRight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 4,
    marginRight: 40,
    alignSelf: 'flex-end',
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
    backgroundColor: '#3A3A3A',
    alignSelf: 'flex-start',
  },
  messageUser: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginBottom: 2,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.25,
    borderColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Avenir',
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#050614',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Avenir',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Avenir',
  },
  suggestedTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  userTeam: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Avenir',
    marginTop: 2,
  },
  inviteUserButton: {
    backgroundColor: '#8000FF',
    borderRadius: 20,
    padding: 8,
  },
  // Invitation screen styles
  invitationContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  invitationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  invitationTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Avenir',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  invitationDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Avenir',
    textAlign: 'center',
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#8000FF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  joinIcon: {
    marginRight: 4,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Avenir',
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

export default WatchParty;