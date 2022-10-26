export interface User {
  id: string;
  deviceId: string;
  name: string;
  score: number;
  credit: number;
  isLast?: boolean;
  games: string[];
}
