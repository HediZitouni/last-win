import { Game } from "../games/games.type";

export interface User {
  id: string;
  deviceId: string;
  name: string;
  score: number;
  credit: number;
  isLast?: boolean;
  games: Game[];
}
