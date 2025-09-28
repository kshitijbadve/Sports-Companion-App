# PrizePicks Live

A React Native Expo app for live sports viewing with real-time features, built with Expo Go compatibility.

## Features

### 🏈 Live Sports Dashboard
- **Real-time game events** with WebSocket simulation
- **Live event tiles** that update automatically
- **Event overlay banners** for important plays
- **Content feed** with highlights and trending content

### 👥 Watch Party
- **Live chat** with friends during games
- **Interactive polls** for real-time voting
- **Friend status** showing who's online
- **Collaborative features** for group viewing

### 📱 User Experience
- **Push-style notifications** for important events
- **User profile** with stats and settings
- **Modular design** for easy customization
- **Expo Go compatible** - no native build required

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd PrizePicksLive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Open in Expo Go:**
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - The app will load directly on your device

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LiveEventTile.tsx
│   ├── EventOverlayBanner.tsx
│   └── ChatModule.tsx
├── screens/            # Main app screens
│   ├── LiveDashboard.tsx
│   ├── WatchParty.tsx
│   └── Profile.tsx
├── services/           # API and WebSocket services
│   ├── WebSocketSimulator.ts
│   └── MockAPI.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
```

## Key Components

### WebSocket Simulator
- Simulates live game events (goals, fouls, timeouts, etc.)
- Configurable event frequency and types
- Real-time event streaming to components

### Mock API
- User state management
- Content feed simulation
- Notification system
- Chat message handling
- Poll creation and voting

### UI Components
- **LiveEventTile**: Displays individual game events
- **EventOverlayBanner**: Animated overlay for important events
- **ChatModule**: Real-time chat with friends
- **Poll Components**: Interactive voting system

## Features in Detail

### Live Dashboard
- Real-time event streaming
- Event importance levels (high/medium/low)
- Auto-refreshing content feed
- Notification badges
- Toggle chat overlay

### Watch Party
- Live chat with friends
- Create and vote on polls
- Friend online status
- Collaborative viewing experience

### Profile & Settings
- User profile management
- Notification history
- App statistics
- Settings configuration

## Development

### Adding New Event Types
1. Update the `GameEvent` type in `src/types/index.ts`
2. Add event handling in `WebSocketSimulator.ts`
3. Update UI components to display new event types

### Customizing the UI
- All components use a consistent dark theme
- Colors are defined in component styles
- Easy to modify for different sports or themes

### Adding Real WebSocket
Replace `WebSocketSimulator.ts` with actual WebSocket connection:
```typescript
const ws = new WebSocket('wss://your-websocket-url');
ws.onmessage = (event) => {
  const gameEvent = JSON.parse(event.data);
  // Handle real game events
};
```

## Troubleshooting

### Common Issues
1. **QR Code not scanning**: Make sure you're on the same WiFi network
2. **App not loading**: Try clearing Expo Go cache
3. **Dependencies issues**: Run `npm install` again

### Development Tips
- Use `console.log` for debugging (visible in Expo Go)
- Hot reloading works automatically
- Test on both iOS and Android devices

## Next Steps

### Production Ready Features
- Real WebSocket integration
- User authentication
- Push notifications
- Offline support
- Performance optimization

### Additional Features
- Multiple sports support
- Video highlights
- Social sharing
- Advanced analytics

## Support

For issues or questions:
1. Check the Expo documentation
2. Review React Native best practices
3. Test on multiple devices

---

**Built with ❤️ using React Native, Expo, and TypeScript**
