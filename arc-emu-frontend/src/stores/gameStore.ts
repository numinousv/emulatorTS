import { create } from "zustand";
import { persist } from "zustand/middleware";
interface GameStore {
  selectedGameId: string | null;
  recentGames: string[];
  setSelectedGame: (id: string | null) => void;
  addRecentGame: (id: string) => void;
}
export const useGameStore = create<GameStore>()(
  // persist for recent games n header
  persist(
    (set) => ({
      selectedGameId: null,
      recentGames: [],
      setSelectedGame: (id) => set({ selectedGameId: id }),
      addRecentGame: (id) =>
        set((state) => ({
          recentGames: [id, ...state.recentGames.filter((g) => g !== id)].slice(
            0,
            5,
          ),
        })),
    }),
    {
      name: "game-storage", // local storage key
    },
  ),
);
