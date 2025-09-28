import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Match {
  id: string;
  sport: string;
  matchup: string;
  team1: {
    name: string;
    shortName: string;
    logo: any;
  };
  team2: {
    name: string;
    shortName: string;
    logo: any;
  };
  currentScore: {
    team1: number;
    team2: number;
  };
  gameTime: {
    period: string;
    time: string;
  };
  status: string;
}

interface MatchContextType {
  currentMatch: Match | null;
  setCurrentMatch: (match: Match | null) => void;
  switchMatch: (matchId: string) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Available matches
export const AVAILABLE_MATCHES: Match[] = [
  {
    id: 'cowboys-packers',
    sport: 'NFL',
    matchup: 'Packers vs Cowboys',
    team1: {
      name: 'Green Bay Packers',
      shortName: 'Packers',
      logo: require('../../assets/packers-logo.png')
    },
    team2: {
      name: 'Dallas Cowboys',
      shortName: 'Cowboys',
      logo: require('../../assets/cowboys-logo.png')
    },
    currentScore: { team1: 7, team2: 7 },
    gameTime: { period: 'Q1', time: '2:36' },
    status: 'live'
  },
  {
    id: 'hawks-celtics',
    sport: 'NBA',
    matchup: 'Hawks vs Celtics',
    team1: {
      name: 'Atlanta Hawks',
      shortName: 'Hawks',
      logo: require('../../assets/hawks.png')
    },
    team2: {
      name: 'Boston Celtics',
      shortName: 'Celtics',
      logo: require('../../assets/celtics.png')
    },
    currentScore: { team1: 28, team2: 24 },
    gameTime: { period: 'Q1', time: '8:45' },
    status: 'live'
  },
  {
    id: 'madrid-barcelona',
    sport: 'LA LIGA',
    matchup: 'Real Madrid vs Barcelona',
    team1: {
      name: 'Real Madrid',
      shortName: 'Madrid',
      logo: require('../../assets/madrid.png')
    },
    team2: {
      name: 'Barcelona',
      shortName: 'Barcelona',
      logo: require('../../assets/barca.webp')
    },
    currentScore: { team1: 2, team2: 1 },
    gameTime: { period: '1H', time: '23:45' },
    status: 'live'
  }
];

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const switchMatch = (matchId: string) => {
    const match = AVAILABLE_MATCHES.find(m => m.id === matchId);
    setCurrentMatch(match || null);
  };

  return (
    <MatchContext.Provider value={{ currentMatch, setCurrentMatch, switchMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
