export interface Game {
  id: string;
  hashtag: string;
  name: string;
  credits: number;
  time: number; // minutes
  blind: boolean;
  maxPlayers: number; // To avoid bots
  idOwner: string;
  users?: UserInGame[];
  last: Last;
  startedAt?: string;
  endedAt?: string;
}

export const initialGame: Game = {
  id: "",
  hashtag: "",
  name: "",
  credits: 0,
  time: 0,
  blind: false,
  maxPlayers: 0,
  idOwner: "",
  last: {
    idUser: "",
    date: 0,
  },
};

interface Last {
  idUser: string;
  date: number;
}

export interface GameInput {
  name?: string;
  credits?: string;
  time?: string;
  blind?: boolean;
  maxPlayers?: string;
  idOwner?: string;
}

export interface UserInGame {
  idUser: string;
  ready: boolean;
  credit: number;
  score: number;
}
