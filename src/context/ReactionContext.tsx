import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReactionState {
  voteCounts: Record<string, { yes: number; no: number }>;
  selectedVotes: Record<string, { yes: boolean; no: boolean }>;
}

interface ReactionContextType {
  reactionState: ReactionState;
  updateVoteCounts: (predictionId: string, voteType: 'yes' | 'no', originalYes: number, originalNo: number) => void;
  getVoteCounts: (predictionId: string, defaultYes: number, defaultNo: number) => { yes: number; no: number };
  getSelectedVotes: (predictionId: string) => { yes: boolean; no: boolean };
}

const ReactionContext = createContext<ReactionContextType | undefined>(undefined);

export const ReactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reactionState, setReactionState] = useState<ReactionState>({
    voteCounts: {
      '1': { yes: 546, no: 220 },
      '2': { yes: 674, no: 312 },
      'parlay-1': { yes: 1574, no: 812 }
    },
    selectedVotes: {}
  });

  const getVoteCounts = (predictionId: string, defaultYes: number, defaultNo: number) => {
    if (reactionState.voteCounts[predictionId]) {
      return reactionState.voteCounts[predictionId];
    }
    return { yes: defaultYes, no: defaultNo };
  };

  const getSelectedVotes = (predictionId: string) => {
    return reactionState.selectedVotes[predictionId] || { yes: false, no: false };
  };

  const updateVoteCounts = (predictionId: string, voteType: 'yes' | 'no', originalYes: number, originalNo: number) => {
    const currentCounts = getVoteCounts(predictionId, originalYes, originalNo);
    const currentSelections = getSelectedVotes(predictionId);
    const isCurrentlySelected = currentSelections[voteType];
    
    setReactionState(prev => ({
      voteCounts: {
        ...prev.voteCounts,
        [predictionId]: {
          ...currentCounts,
          [voteType]: isCurrentlySelected ? currentCounts[voteType] - 1 : currentCounts[voteType] + 1
        }
      },
      selectedVotes: {
        ...prev.selectedVotes,
        [predictionId]: {
          ...currentSelections,
          [voteType]: !isCurrentlySelected
        }
      }
    }));
  };

  return (
    <ReactionContext.Provider value={{
      reactionState,
      updateVoteCounts,
      getVoteCounts,
      getSelectedVotes
    }}>
      {children}
    </ReactionContext.Provider>
  );
};

export const useReactions = () => {
  const context = useContext(ReactionContext);
  if (context === undefined) {
    throw new Error('useReactions must be used within a ReactionProvider');
  }
  return context;
};
