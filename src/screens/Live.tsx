import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Moments from './Moments';
import WatchParty from './WatchParty';
import Predictions from './Predictions';
import Highlights from './Highlights';
import { useMatch } from '../context/MatchContext';
import { useMenu } from '../context/MenuContext';

const Live: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Moments');
  const { currentMatch } = useMatch();
  const { toggleMenu } = useMenu();
  
  // Reset to Moments tab when match changes
  useEffect(() => {
    if (currentMatch) {
      setActiveTab('Moments');
    }
  }, [currentMatch]);
  
  // Persistent voting state
  const [pollResults, setPollResults] = useState({ jordan: 2, dak: 1 });
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);

  const tabs = [
    { id: 'Moments', label: 'Moments' },
    { id: 'Watch Party', label: 'Watch Party' },
    { id: 'Predictions', label: 'Predictions' },
    { id: 'Highlights', label: 'Highlights' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Moments':
        return <Moments />;
      case 'Watch Party':
        return <WatchParty 
          pollResults={pollResults}
          setPollResults={setPollResults}
          hasVoted={hasVoted}
          setHasVoted={setHasVoted}
          userVote={userVote}
          setUserVote={setUserVote}
        />;
      case 'Predictions':
        return <Predictions />;
      case 'Highlights':
        return <Highlights />;
      default:
        return <Moments />;
    }
  };

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

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Avenir',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: 'Avenir',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#8000FF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});

export default Live;
