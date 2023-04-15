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

export const initialUser: User = {
  id: "",
  deviceId: "",
  name: "",
  score: 0,
  credit: 0,
  isLast: false,
  games: [],
};
