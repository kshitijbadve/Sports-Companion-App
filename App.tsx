import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
// Import screens
import Matches from './src/screens/Matches';
import Live from './src/screens/Live';
import Profile from './src/screens/Profile';
// Import context
import { ReactionProvider } from './src/context/ReactionContext';
import { MatchProvider } from './src/context/MatchContext';
import { MenuProvider } from './src/context/MenuContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Preload critical images using Expo Asset API for faster loading
const preloadImages = async () => {
  try {
    // Define all critical images as Asset objects
    const imageAssets = [
      Asset.fromModule(require('./assets/Group 64 (1).png')),
      Asset.fromModule(require('./assets/packers-logo.png')),
      Asset.fromModule(require('./assets/cowboys-logo.png')),
      Asset.fromModule(require('./assets/celtics.png')),
      Asset.fromModule(require('./assets/hawks.png')),
      Asset.fromModule(require('./assets/madrid.png')),
      Asset.fromModule(require('./assets/barca.webp')),
      Asset.fromModule(require('./assets/jordan.png')),
      Asset.fromModule(require('./assets/dak.png')),
      Asset.fromModule(require('./assets/parsons.png')),
      Asset.fromModule(require('./assets/mbappe.png')),
      Asset.fromModule(require('./assets/young.webp')),
      Asset.fromModule(require('./assets/yamal.png')),
      Asset.fromModule(require('./assets/user profile 4.png')),
      Asset.fromModule(require('./assets/user profile 5.png')),
      Asset.fromModule(require('./assets/user profile 6.png')),
      Asset.fromModule(require('./assets/user profile 7.png')),
      Asset.fromModule(require('./assets/user profile 8.png')),
      Asset.fromModule(require('./assets/Group 77.png')),
      Asset.fromModule(require('./assets/Group 78.png')),
      Asset.fromModule(require('./assets/Group 79.png')),
      Asset.fromModule(require('./assets/Rectangle 144.png')),
    ];
    
    // Preload all assets in parallel
    await Asset.loadAsync(imageAssets);
    
    console.log('✅ All images preloaded successfully using Expo Asset API');
  } catch (error) {
    console.log('⚠️ Some images failed to preload:', error);
  }
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconComponent;

        if (route.name === 'Matches') {
          const iconName = isFocused ? 'basketball' : 'basketball-outline';
          iconComponent = <Ionicons name={iconName} size={24} color={isFocused ? '#FFFFFF' : '#6B7280'} />;
        } else if (route.name === 'Live') {
          const iconName = isFocused ? 'radio' : 'radio-outline';
          iconComponent = <Ionicons name={iconName} size={24} color={isFocused ? '#FFFFFF' : '#6B7280'} />;
        } else if (route.name === 'Profile') {
          iconComponent = (
            <View style={styles.profileIconContainer}>
              <Image 
                source={require('./src/screens/Pushin P - Secondary - On Dark 1.png')} 
                style={[styles.profileIcon, isFocused && styles.profileIconFocused]} 
              />
            </View>
          );
        }

        return (
          <View key={route.key} style={styles.tabItem} onTouchEnd={onPress}>
            <View style={route.name === 'Live' ? styles.liveTabContent : styles.tabContent}>
              {iconComponent}
              <Text style={[styles.tabLabel, { color: isFocused ? '#FFFFFF' : '#6B7280' }]}>
                {route.name}
              </Text>
              {isFocused && <View style={route.name === 'Live' ? styles.activeIndicatorLive : route.name === 'Matches' ? styles.activeIndicatorMatches : styles.activeIndicator} />}
            </View>
          </View>
        );
      })}
    </View>
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Matches') {
            iconName = focused ? 'basketball' : 'basketball-outline';
          } else if (route.name === 'Live') {
            iconName = focused ? 'radio' : 'radio-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8000FF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#050614',
          borderTopColor: '#374151',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 12,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: 'Avenir',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Matches" component={Matches} />
      <Tab.Screen name="Live" component={Live} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Preload images using Expo Asset API when app starts
    preloadImages();
  }, []);

  return (
    <MatchProvider>
      <ReactionProvider>
        <MenuProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <TabNavigator />
          </NavigationContainer>
        </MenuProvider>
      </ReactionProvider>
    </MatchProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#050614',
    borderTopColor: '#374151',
    borderTopWidth: 0,
    height: 85,
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
    marginTop: -8,
    marginLeft: 8,
  },
  liveTabContent: {
    alignItems: 'center',
    position: 'relative',
    marginTop: -8,
    marginLeft: 16,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Avenir',
    marginTop: 4,
  },
  profileIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  profileIconFocused: {
    opacity: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -65,
    width: 60,
    height: 4,
    backgroundColor: '#8000FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeIndicatorLive: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -70,
    width: 60,
    height: 4,
    backgroundColor: '#8000FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeIndicatorMatches: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -60,
    width: 60,
    height: 4,
    backgroundColor: '#8000FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});