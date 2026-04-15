import React, { createContext, useContext, useState, useCallback } from "react";
import { PersonalityTrait, gameLocations } from "@/lib/gameData";

export interface CollectedItem {
  locationId: number;
  itemName: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  trait: PersonalityTrait;
  description: string;
}

interface GameState {
  currentLocationId: number;
  currentQuizIndex: number;
  unlockedLocations: number[];
  collectedItems: CollectedItem[];
  traitScores: Record<PersonalityTrait, number>;
  quizAnswers: PersonalityTrait[];
  isQuizActive: boolean;
  showReward: boolean;
  showResponse: string | null;
  locationCompleted: boolean;
}

interface GameContextType extends GameState {
  startQuiz: () => void;
  answerQuiz: (trait: PersonalityTrait, response: string) => void;
  proceedAfterResponse: () => void;
  claimReward: () => void;
  selectLocation: (id: number) => void;
  getDominantTrait: () => PersonalityTrait;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    currentLocationId: 1,
    currentQuizIndex: 0,
    unlockedLocations: [1],
    collectedItems: [],
    traitScores: { 감성: 0, 지혜: 0, 용기: 0, 신비: 0 },
    quizAnswers: [],
    isQuizActive: false,
    showReward: false,
    showResponse: null,
    locationCompleted: false,
  });

  const startQuiz = useCallback(() => {
    setState((s) => ({ ...s, isQuizActive: true, currentQuizIndex: 0, quizAnswers: [], showResponse: null, locationCompleted: false, showReward: false }));
  }, []);

  const answerQuiz = useCallback((trait: PersonalityTrait, response: string) => {
    setState((s) => ({
      ...s,
      traitScores: { ...s.traitScores, [trait]: s.traitScores[trait] + 1 },
      quizAnswers: [...s.quizAnswers, trait],
      showResponse: response,
    }));
  }, []);

  const proceedAfterResponse = useCallback(() => {
    setState((s) => {
      const location = gameLocations.find((l) => l.id === s.currentLocationId);
      if (!location) return s;

      const nextIndex = s.currentQuizIndex + 1;
      if (nextIndex >= location.quizzes.length) {
        return { ...s, showResponse: null, locationCompleted: true, isQuizActive: false };
      }
      return { ...s, showResponse: null, currentQuizIndex: nextIndex };
    });
  }, []);

  const getDominantTrait = useCallback((): PersonalityTrait => {
    const { quizAnswers } = state;
    if (quizAnswers.length === 0) return "감성";
    const counts: Record<string, number> = {};
    quizAnswers.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as PersonalityTrait;
  }, [state.quizAnswers]);

  const claimReward = useCallback(() => {
    setState((s) => {
      const location = gameLocations.find((l) => l.id === s.currentLocationId);
      if (!location) return s;

      const dominant = (() => {
        const counts: Record<string, number> = {};
        s.quizAnswers.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as PersonalityTrait;
      })();

      const reward = location.rewards.find((r) => r.trait === dominant);
      if (!reward) return s;

      const newItem: CollectedItem = {
        locationId: location.id,
        itemName: reward.itemName,
        icon: reward.icon,
        rarity: reward.rarity,
        trait: reward.trait,
        description: reward.description,
      };

      const nextLocationId = s.currentLocationId + 1;
      const newUnlocked = nextLocationId <= 5 ? [...s.unlockedLocations, nextLocationId] : s.unlockedLocations;

      return {
        ...s,
        collectedItems: [...s.collectedItems, newItem],
        showReward: true,
        unlockedLocations: [...new Set(newUnlocked)],
      };
    });
  }, []);

  const selectLocation = useCallback((id: number) => {
    setState((s) => {
      if (!s.unlockedLocations.includes(id)) return s;
      const alreadyCompleted = s.collectedItems.some((i) => i.locationId === id);
      return { ...s, currentLocationId: id, currentQuizIndex: 0, isQuizActive: false, showReward: false, showResponse: null, locationCompleted: alreadyCompleted, quizAnswers: [] };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState({
      currentLocationId: 1,
      currentQuizIndex: 0,
      unlockedLocations: [1],
      collectedItems: [],
      traitScores: { 감성: 0, 지혜: 0, 용기: 0, 신비: 0 },
      quizAnswers: [],
      isQuizActive: false,
      showReward: false,
      showResponse: null,
      locationCompleted: false,
    });
  }, []);

  return (
    <GameContext.Provider value={{ ...state, startQuiz, answerQuiz, proceedAfterResponse, claimReward, selectLocation, getDominantTrait, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
