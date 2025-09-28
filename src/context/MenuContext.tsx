import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuContextType {
  showMenu: boolean;
  toggleMenu: () => void;
  slideAnim: Animated.Value;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  const toggleMenu = () => {
    if (showMenu) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    toggleMenu();
  };

  return (
    <MenuContext.Provider value={{ showMenu, toggleMenu, slideAnim }}>
      {children}
      {/* Global Menu */}
      {showMenu && (
        <Animated.View style={[styles.slideMenu, { transform: [{ translateX: slideAnim }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.menuLogoContainer}>
            <Image 
              source={require('../../assets/Group 64 (1).png')} 
              style={styles.menuLogo}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
        </Animated.View>
      )}
    </MenuContext.Provider>
  );
};

const styles = StyleSheet.create({
  slideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#050614',
    zIndex: 3,
    paddingTop: 100,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    padding: 8,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    backgroundColor: '#1f202d',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  menuLogoContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  menuLogo: {
    width: 160,
    height: 42,
    resizeMode: 'contain',
  },
});
