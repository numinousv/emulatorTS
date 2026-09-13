import { useQuery } from "@tanstack/react-query";
import { api, type Console, type ConsoleWithGames, type Game } from "@/lib/api";

export function useConsoles() {
  return useQuery({
    queryKey: ["consoles"],
    queryFn: async () => {
      const { data } = await api.get<Console[]>("/consoles");
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useConsole(id: string) {
  return useQuery({
    queryKey: ["console", id],
    queryFn: async () => {
      const { data } = await api.get<ConsoleWithGames>(`/consoles/${id}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data } = await api.get<Game[]>("/games");
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data } = await api.get<Game>(`/games/${id}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
