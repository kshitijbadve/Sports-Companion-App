import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Notification } from '../types';
import MockAPI from '../services/MockAPI';
import { useMenu } from '../context/MenuContext';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const { toggleMenu } = useMenu();

  useEffect(() => {
    loadUserData();
    loadNotifications();
  }, []);

  const loadUserData = () => {
    const currentUser = MockAPI.getCurrentUser();
    setUser(currentUser);
    setEditName(currentUser.name);
  };

  const loadNotifications = () => {
    setNotifications(MockAPI.getNotifications());
  };

  const updateProfile = () => {
    if (editName.trim()) {
      const updatedUser = MockAPI.updateUser({ name: editName.trim() });
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid name');
    }
  };

  const markNotificationAsRead = (id: string) => {
    MockAPI.markNotificationAsRead(id);
    loadNotifications();
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd have a clearAllNotifications method
            loadNotifications();
          }
        }
      ]
    );
  };


  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => markNotificationAsRead(notification.id)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={
            notification.type === 'success' ? 'checkmark-circle' :
            notification.type === 'warning' ? 'warning' :
            notification.type === 'error' ? 'close-circle' : 'information-circle'
          } 
          size={24} 
          color={
            notification.type === 'success' ? '#4CAF50' :
            notification.type === 'warning' ? '#FF9800' :
            notification.type === 'error' ? '#F44336' : '#2196F3'
          } 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
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


      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../../assets/user profile 4.png')} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userName}>kshitij</Text>
          <Text style={styles.joinDate}>Joined Feb 2022</Text>
          
          <View style={styles.followStats}>
            <View style={styles.followItem}>
              <Text style={styles.followNumber}>207</Text>
              <Text style={styles.followLabel}>followers</Text>
            </View>
            <View style={styles.followItem}>
              <Text style={styles.followNumber}>20</Text>
              <Text style={styles.followLabel}>following</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="flame" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>297</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>$5,346</Text>
            <Text style={styles.statLabel}>Total won</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>$500</Text>
            <Text style={styles.statLabel}>Top win</Text>
          </View>
        </View>

        {/* All Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All badges</Text>
          <View style={styles.badgesContainer}>
            <View style={styles.badgeItem}>
              <Image 
                source={require('../../assets/Group 77.png')} 
                style={styles.badgeIconImage}
                resizeMode="contain"
              />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>Sharpshooter</Text>
                <Text style={styles.badgeDescription}>5 perfect parlays in a row</Text>
              </View>
              <Text style={styles.badgeEarned}>3x</Text>
            </View>
            <View style={styles.badgeItem}>
              <Image 
                source={require('../../assets/Group 78.png')} 
                style={styles.badgeIconImage}
                resizeMode="contain"
              />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>Parlay Picasso</Text>
                <Text style={styles.badgeDescription}>Unique combos which hit</Text>
              </View>
              <Text style={styles.badgeEarned}>2x</Text>
            </View>
            <View style={styles.badgeItem}>
              <Image 
                source={require('../../assets/Group 79.png')} 
                style={styles.badgeIconImage}
                resizeMode="contain"
              />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>First Win</Text>
                <Text style={styles.badgeDescription}>Won your first parlay</Text>
              </View>
              <Text style={[styles.badgeEarned, { marginTop: 4 }]}>1x</Text>
            </View>
          </View>
        </View>

        {/* Top Winning Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top winning players</Text>
          <View style={styles.playerItem}>
            <Image 
              source={require('../../assets/mbappe.png')} 
              style={styles.playerImage}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>Kylian Mbappe</Text>
              <Text style={styles.playerLeague}>LA LIGA</Text>
            </View>
            <Text style={styles.playerWins}>13 Wins</Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 75,
    paddingBottom: 16,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 4,
  },
  joinDate: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  followStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  followItem: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  followNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  followLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f202d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  badgesContainer: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8000FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeIconImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  badgeIconGrey: {
    backgroundColor: '#6B7280',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  badgeDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  badgeEarned: {
    color: '#6DFF01',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    textAlign: 'right',
    marginTop: -8,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121320',
    borderRadius: 12,
    padding: 16,
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playerLeague: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  playerWins: {
    color: '#6DFF01',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Profile;


