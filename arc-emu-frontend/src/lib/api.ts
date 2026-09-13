import axios from "axios";

export const api = axios.create({
  baseURL: "$CLOUDFLARE_WORKER_URL/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export type Console = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  core: string;
  count: number;
};

export type ConsoleWithGames = Console & {
  games: Game[];
};

export type Game = {
  id: string;
  name: string;
  core: string;
  url: string;
  description: string;
  consoleId: string;
};
